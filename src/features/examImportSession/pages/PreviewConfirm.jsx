import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getTempQuestionsBySessionAsync,
    selectTempQuestions,
    selectTempQuestionLoadingGet,
    selectTempQuestionLoadingLinkSection,
    clearTempQuestions,
    unlinkQuestionsFromSection,
    linkQuestionToSectionAsync,
    reorderTempQuestionsAsync,
    selectTempQuestionLoadingReorder,
} from '../../tempQuestion/store/tempQuestionSlice';
import {
    getTempSectionsBySessionAsync,
    createTempSectionAsync,
    updateTempSectionAsync,
    deleteTempSectionAsync,
    selectTempSections,
    selectTempSectionLoadingGet,
    selectTempSectionLoadingCreate,
    selectTempSectionLoadingUpdate,
    selectTempSectionLoadingDelete,
    clearTempSections,
} from '../../tempSection/store/tempSectionSlice';
import { SectionTabs } from '../components/SectionTabs';
import { SectionDetailPanel } from '../components/SectionDetailPanel';
import { SectionQuestionsList } from '../components/SectionQuestionsList';
import { PreviewQuestionsList } from '../components/PreviewQuestionsList';
import { TempSectionForm } from '../components/TempSectionForm';
import { ExamPreview } from '../components/ExamPreview';
import { ConfirmModal } from '../../../shared/components';

export const PreviewConfirm = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Active tab state: null = uncategorized, number = sectionId
    const [activeTab, setActiveTab] = useState(null);
    const [isCreatingSection, setIsCreatingSection] = useState(false);
    const [isEditingSection, setIsEditingSection] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    
    // Right panel tab state: 'questions' | 'preview'
    const [rightPanelTab, setRightPanelTab] = useState('questions');
    
    // Drag & drop state
    const [draggedQuestion, setDraggedQuestion] = useState(null);
    const [isDragOverSection, setIsDragOverSection] = useState(false);
    const [isDragOverUncategorized, setIsDragOverUncategorized] = useState(false);
    const [dragSource, setDragSource] = useState(null); // 'section' | 'uncategorized'

    const tempQuestions = useSelector(selectTempQuestions);
    const tempQuestionsLoading = useSelector(selectTempQuestionLoadingGet);
    const tempSections = useSelector(selectTempSections);
    const tempSectionsLoading = useSelector(selectTempSectionLoadingGet);
    const createSectionLoading = useSelector(selectTempSectionLoadingCreate);
    const updateSectionLoading = useSelector(selectTempSectionLoadingUpdate);
    const deleteSectionLoading = useSelector(selectTempSectionLoadingDelete);
    const linkSectionLoading = useSelector(selectTempQuestionLoadingLinkSection);
    const reorderLoading = useSelector(selectTempQuestionLoadingReorder);

    // Load sections and questions when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getTempSectionsBySessionAsync(id));
            dispatch(getTempQuestionsBySessionAsync(id));
        }
        return () => {
            dispatch(clearTempSections());
            dispatch(clearTempQuestions());
        };
    }, [id, dispatch]);

    // Filter questions by active tab and sort by order
    const filteredQuestions = useMemo(() => {
        if (!tempQuestions) return [];

        let filtered;
        if (activeTab === null) {
            // Uncategorized: questions without tempSectionId
            filtered = tempQuestions.filter(q => !q.tempSectionId);
        } else {
            // Questions belonging to selected section
            filtered = tempQuestions.filter(q => q.tempSectionId === activeTab);
        }

        // Sort by order
        return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [tempQuestions, activeTab]);

    // Uncategorized questions for right panel (only questions without section)
    const uncategorizedQuestions = useMemo(() => {
        if (!tempQuestions) return [];
        return tempQuestions
            .filter(q => !q.tempSectionId)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [tempQuestions]);

    // Sort sections by order
    const sortedSections = useMemo(() => {
        if (!tempSections) return [];
        return [...tempSections].sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [tempSections]);

    // Get current section object
    const currentSection = useMemo(() => {
        if (activeTab === null) return null;
        return sortedSections.find(s => s.tempSectionId === activeTab);
    }, [sortedSections, activeTab]);

    const handleTabChange = (sectionId) => {
        setActiveTab(sectionId);
        setIsCreatingSection(false);
        setIsEditingSection(false);
    };

    const handleCreateSection = () => {
        setIsCreatingSection(true);
    };

    const handleCancelCreate = () => {
        setIsCreatingSection(false);
    };

    const handleEditSection = () => {
        if (!currentSection) return;
        setIsEditingSection(true);
        setIsCreatingSection(false);
    };

    const handleCancelEdit = () => {
        setIsEditingSection(false);
    };

    const handleSubmitCreate = async (formData) => {
        try {
            const result = await dispatch(createTempSectionAsync({ 
                sessionId: id, 
                data: formData 
            })).unwrap();

            if (!result || !result.data) return;
            // Reload sections to ensure UI is in sync
            await dispatch(getTempSectionsBySessionAsync(id));

            // Switch to the newly created section first
            setActiveTab(result.data?.tempSectionId);
            
            // Then close form to show the new section
            setIsCreatingSection(false);
        } catch (error) {
            // Error handling is done by asyncThunkHelper with toast
            console.error('Failed to create section:', error);
        }
    };

    const handleSubmitEdit = async (formData) => {
        if (!currentSection) return;

        try {
            await dispatch(updateTempSectionAsync({ 
                tempSectionId: currentSection.tempSectionId, 
                data: formData 
            })).unwrap();

            // Success - close edit form
            setIsEditingSection(false);
        } catch (error) {
            // Error handling is done by asyncThunkHelper with toast
            console.error('Failed to update section:', error);
        }
    };

    const handleCloseTab = (sectionId) => {
        // Find section to get its info for modal
        const section = sortedSections.find(s => s.tempSectionId === sectionId);
        setSectionToDelete(section);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!sectionToDelete) return;

        try {
            await dispatch(deleteTempSectionAsync(sectionToDelete.tempSectionId)).unwrap();
            
            // Unlink all questions from this section
            dispatch(unlinkQuestionsFromSection(sectionToDelete.tempSectionId));
            
            // If deleting active tab, switch to uncategorized
            if (activeTab === sectionToDelete.tempSectionId) {
                setActiveTab(null);
            }
            
            setIsDeleteModalOpen(false);
            setSectionToDelete(null);
        } catch (error) {
            // Error already handled by asyncThunkHelper with toast
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setSectionToDelete(null);
    };

    // Drag & Drop handlers
    const handleQuestionDragStart = (question, source = 'uncategorized') => {
        setDraggedQuestion(question);
        setDragSource(source);
    };

    const handleQuestionDragEnd = () => {
        setDraggedQuestion(null);
        setIsDragOverSection(false);
        setDragSource(null);
    };

    const handleSectionDragOver = (e) => {
        e.preventDefault();
        if (draggedQuestion) {
            setIsDragOverSection(true);
        }
    };

    const handleSectionDragLeave = () => {
        setIsDragOverSection(false);
    };

    const handleSectionDrop = async (e) => {
        e.preventDefault();
        setIsDragOverSection(false);

        if (!draggedQuestion) return;

        const targetSectionId = activeTab; // null = uncategorized, number = sectionId

        // Check if question is already in this section
        if (draggedQuestion.tempSectionId === targetSectionId) {
            setDraggedQuestion(null);
            return;
        }

        try {
            await dispatch(linkQuestionToSectionAsync({
                tempQuestionId: draggedQuestion.tempQuestionId,
                tempSectionId: targetSectionId, // null will unlink
            })).unwrap();

            setDraggedQuestion(null);
        } catch (error) {
            console.error('Failed to link question to section:', error);
            setDraggedQuestion(null);
        }
    };

    const handleUncategorizedDragOver = (e) => {
        e.preventDefault();
        if (draggedQuestion && draggedQuestion.tempSectionId) {
            // Only allow drop if question is currently in a section
            setIsDragOverUncategorized(true);
        }
    };

    const handleUncategorizedDragLeave = () => {
        setIsDragOverUncategorized(false);
    };

    const handleUncategorizedDrop = async (e) => {
        e.preventDefault();
        setIsDragOverUncategorized(false);

        if (!draggedQuestion || !draggedQuestion.tempSectionId) return;

        try {
            await dispatch(linkQuestionToSectionAsync({
                tempQuestionId: draggedQuestion.tempQuestionId,
                tempSectionId: null, // Unlink from section
            })).unwrap();

            setDraggedQuestion(null);
        } catch (error) {
            console.error('Failed to unlink question from section:', error);
            setDraggedQuestion(null);
        }
    };

    const handleReorderQuestions = async (items) => {
        try {
            await dispatch(reorderTempQuestionsAsync(items)).unwrap();
        } catch (error) {
            console.error('Failed to reorder questions:', error);
            // Reload questions to revert UI changes
            if (id) {
                dispatch(getTempQuestionsBySessionAsync(id));
            }
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
                {/* Left Panel - Section Details & Questions */}
                <div className="flex flex-col gap-4 min-h-0">
                    {/* Browser-like tabs */}
                    <SectionTabs
                        sections={sortedSections}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        onCreateSection={handleCreateSection}
                        onCloseTab={handleCloseTab}
                    />

                    {/* Scrollable content or Create Form */}
                    <div className="flex flex-col gap-6 overflow-y-auto bg-primary border border-border rounded-lg p-4 flex-1 min-h-0">
                        {isCreatingSection ? (
                            <TempSectionForm
                                onSubmit={handleSubmitCreate}
                                onCancel={handleCancelCreate}
                                isSubmitting={createSectionLoading}
                            />
                        ) : isEditingSection ? (
                            <TempSectionForm
                                onSubmit={handleSubmitEdit}
                                onCancel={handleCancelEdit}
                                isSubmitting={updateSectionLoading}
                                initialData={currentSection}
                            />
                        ) : (
                            <>
                                <SectionDetailPanel
                                    section={currentSection}
                                    questionsCount={filteredQuestions.length}
                                    onEdit={handleEditSection}
                                />

                                <SectionQuestionsList
                                    questions={filteredQuestions}
                                    loading={tempQuestionsLoading || tempSectionsLoading}
                                    sectionTitle={currentSection?.title}
                                    isDragOver={isDragOverSection}
                                    onDragOver={handleSectionDragOver}
                                    onDragLeave={handleSectionDragLeave}
                                    onDrop={handleSectionDrop}
                                    draggedQuestionId={draggedQuestion?.tempQuestionId}
                                    onQuestionDragStart={handleQuestionDragStart}
                                    onQuestionDragEnd={handleQuestionDragEnd}
                                    isUncategorized={activeTab === null}
                                    onReorderQuestions={handleReorderQuestions}
                                    dragSource={dragSource}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Right Panel - Tabs and Content */}
                <div className="flex flex-col min-h-0 gap-4">
                    {/* Tab Switcher */}
                    <div className="flex gap-2 border-b border-border">
                        <button
                            onClick={() => setRightPanelTab('questions')}
                            className={`
                                px-4 py-2 font-medium text-sm transition-colors
                                ${rightPanelTab === 'questions'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }
                            `}
                        >
                            Danh sách câu hỏi
                        </button>
                        <button
                            onClick={() => setRightPanelTab('preview')}
                            className={`
                                px-4 py-2 font-medium text-sm transition-colors
                                ${rightPanelTab === 'preview'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }
                            `}
                        >
                            Preview đề thi
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {rightPanelTab === 'questions' ? (
                            <PreviewQuestionsList
                                loading={tempQuestionsLoading}
                                questions={uncategorizedQuestions}
                                draggedQuestionId={draggedQuestion?.tempQuestionId}
                                onDragStart={handleQuestionDragStart}
                                onDragEnd={handleQuestionDragEnd}
                                isDragOver={isDragOverUncategorized}
                                onDragOver={handleUncategorizedDragOver}
                                onDragLeave={handleUncategorizedDragLeave}
                                onDrop={handleUncategorizedDrop}
                            />
                        ) : (
                            <ExamPreview
                                tempSections={sortedSections}
                                tempQuestions={tempQuestions}
                                loading={tempQuestionsLoading || tempSectionsLoading}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Section Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Xóa Section"
                message={`Bạn có chắc chắn muốn xóa section "${sectionToDelete?.title}"? Tất cả câu hỏi thuộc section này sẽ chuyển về chưa phân loại.`}
                confirmText="Xóa Section"
                cancelText="Hủy"
                variant="danger"
                loading={deleteSectionLoading}
            />
        </div>
    );
};
