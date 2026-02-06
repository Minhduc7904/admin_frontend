import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getSectionsByExamAsync,
    clearSections,
} from '../store/sectionSlice';
import {
    getQuestionsByExamAsync,
    clearCurrentQuestion,
    addQuestionToSectionAsync,
    selectQuestionLoadingAddToSection,
    updateQuestionSectionInfo,
    reorderQuestionsAsync,
    selectQuestionLoadingReorder,
    updateQuestionsOrder,
    removeQuestionFromExamAsync,
    selectQuestionLoadingRemoveFromExam,
} from '../../question/store/questionSlice';
import { ExamSectionTabs } from '../components/ExamSectionTabs';
import { ExamSectionDetail } from '../components/ExamSectionDetail';
import { ExamQuestionsList } from '../components/ExamQuestionsList';
import { AddSection } from '../components/AddSection';
import { EditSection } from '../components/EditSection';
import { EditQuestion } from '../../question/components/EditQuestion';
import { RightPanel, ConfirmModal } from '../../../shared/components';

export const ExamQuestions = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Active tab state: null = uncategorized, number = sectionId
    const [activeTab, setActiveTab] = useState(null);
    
    // Right panel state
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
    const [rightPanelMode, setRightPanelMode] = useState('add'); // 'add' | 'edit' | 'editQuestion'
    const [editingSection, setEditingSection] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    
    // Drag & drop state
    const [draggedQuestion, setDraggedQuestion] = useState(null);
    const [isDragOverSection, setIsDragOverSection] = useState(false);
    const [isDragOverAllQuestions, setIsDragOverAllQuestions] = useState(false);
    const [dragSource, setDragSource] = useState(null); // 'section' | 'allQuestions'
    
    // Confirm modal state
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [questionToRemove, setQuestionToRemove] = useState(null);

    // Selectors
    const sections = useSelector((state) => state.section.sections);
    const sectionsLoading = useSelector((state) => state.section.loadingGet);
    const questions = useSelector((state) => state.question.questions);
    const questionsLoading = useSelector((state) => state.question.loadingGet);
    const addToSectionLoading = useSelector(selectQuestionLoadingAddToSection);
    const reorderLoading = useSelector(selectQuestionLoadingReorder);
    const removeFromExamLoading = useSelector(selectQuestionLoadingRemoveFromExam);

    // Load sections and questions when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getSectionsByExamAsync(id));
            dispatch(getQuestionsByExamAsync({ examId: id, params: { limit: 1000 } }));
        }
        return () => {
            dispatch(clearSections());
            dispatch(clearCurrentQuestion());
        };
    }, [id, dispatch]);

    // Sort sections by order
    const sortedSections = useMemo(() => {
        if (!sections) return [];
        return [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [sections]);

    // Filter questions by active tab
    const filteredQuestions = useMemo(() => {
        if (!questions) return [];

        if (activeTab === null) {
            // Uncategorized: questions without sectionId
            return questions.filter(q => !q.sectionId);
        } else {
            // Questions belonging to selected section
            return questions.filter(q => q.sectionId === activeTab);
        }
    }, [questions, activeTab]);

    // Uncategorized questions for right panel (only questions without sectionId)
    const uncategorizedQuestions = useMemo(() => {
        if (!questions) return [];
        return questions.filter(q => !q.sectionId);
    }, [questions]);

    // Get current section object
    const currentSection = useMemo(() => {
        if (activeTab === null) return null;
        return sortedSections.find(s => s.sectionId === activeTab);
    }, [sortedSections, activeTab]);

    const handleTabChange = (sectionId) => {
        setActiveTab(sectionId);
    };

    const handleAddSection = () => {
        setRightPanelMode('add');
        setEditingSection(null);
        setIsRightPanelOpen(true);
    };

    const handleEditSection = (section) => {
        setRightPanelMode('edit');
        setEditingSection(section);
        setIsRightPanelOpen(true);
    };

    const handleCloseRightPanel = () => {
        setIsRightPanelOpen(false);
        setEditingSection(null);
        setEditingQuestion(null);
    };

    const handleSectionCreated = (newSection) => {
        // Auto-select the newly created section
        setActiveTab(newSection.sectionId);
    };

    const handleSectionUpdated = (updatedSection) => {
        // Keep the current tab active after update
        // Redux will automatically update the section in the list
    };

    const handleEditQuestion = (question) => {
        setRightPanelMode('editQuestion');
        setEditingQuestion(question);
        setIsRightPanelOpen(true);
    };

    const handleQuestionUpdated = () => {
        // Reload questions after update
        if (id) {
            dispatch(getQuestionsByExamAsync({ examId: id, params: { limit: 1000 } }));
        }
    };

    const handleRemoveQuestion = (question) => {
        setQuestionToRemove(question);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (!questionToRemove) return;

        try {
            await dispatch(removeQuestionFromExamAsync({
                examId: parseInt(id),
                questionId: questionToRemove.questionId,
            })).unwrap();

            // Redux slice đã xử lý việc xóa question khỏi state
            setIsConfirmModalOpen(false);
            setQuestionToRemove(null);
        } catch (error) {
            console.error('Failed to remove question from exam:', error);
        }
    };

    const handleCancelRemove = () => {
        setIsConfirmModalOpen(false);
        setQuestionToRemove(null);
    };

    // Drag & Drop handlers
    const handleQuestionDragStart = (question, source = 'allQuestions') => {
        setDraggedQuestion(question);
        setDragSource(source);
    };

    const handleQuestionDragEnd = () => {
        setDraggedQuestion(null);
        setIsDragOverSection(false);
        setIsDragOverAllQuestions(false);
        setDragSource(null);
    };

    const handleSectionDragOver = (e) => {
        e.preventDefault();
        if (draggedQuestion && dragSource === 'allQuestions') {
            setIsDragOverSection(true);
        }
    };

    const handleSectionDragLeave = () => {
        setIsDragOverSection(false);
    };

    const handleSectionDrop = async (e) => {
        e.preventDefault();
        setIsDragOverSection(false);

        if (!draggedQuestion || dragSource !== 'allQuestions') return;

        const targetSectionId = activeTab; // null = uncategorized, number = sectionId

        // Check if question is already in this section
        if (draggedQuestion.sectionId === targetSectionId) {
            setDraggedQuestion(null);
            return;
        }

        try {
            await dispatch(addQuestionToSectionAsync({
                examId: parseInt(id),
                questionId: draggedQuestion.questionId,
                sectionId: targetSectionId, // null will unlink
            })).unwrap();

            // Update question's sectionId in Redux state instead of reloading
            dispatch(updateQuestionSectionInfo({
                questionId: draggedQuestion.questionId,
                sectionId: targetSectionId,
            }));
            
            setDraggedQuestion(null);
        } catch (error) {
            console.error('Failed to add question to section:', error);
            setDraggedQuestion(null);
        }
    };

    const handleAllQuestionsDragOver = (e) => {
        e.preventDefault();
        if (draggedQuestion && draggedQuestion.sectionId && dragSource === 'section') {
            // Only allow drop if question is currently in a section
            setIsDragOverAllQuestions(true);
        }
    };

    const handleAllQuestionsDragLeave = () => {
        setIsDragOverAllQuestions(false);
    };

    const handleAllQuestionsDrop = async (e) => {
        e.preventDefault();
        setIsDragOverAllQuestions(false);

        if (!draggedQuestion || !draggedQuestion.sectionId || dragSource !== 'section') return;

        try {
            await dispatch(addQuestionToSectionAsync({
                examId: parseInt(id),
                questionId: draggedQuestion.questionId,
                sectionId: null, // Unlink from section
            })).unwrap();

            // Update question's sectionId to null in Redux state instead of reloading
            dispatch(updateQuestionSectionInfo({
                questionId: draggedQuestion.questionId,
                sectionId: null,
            }));
            
            setDraggedQuestion(null);
        } catch (error) {
            console.error('Failed to remove question from section:', error);
            setDraggedQuestion(null);
        }
    };

    const handleReorderQuestions = async (items) => {
        try {
            items.examId = parseInt(id);
            await dispatch(reorderQuestionsAsync(items)).unwrap();
            
            // Update questions order in Redux state instead of reloading
            dispatch(updateQuestionsOrder({ items: items.items }));
        } catch (error) {
            console.error('Failed to reorder questions:', error);
            // Reload questions to revert UI changes on error
            if (id) {
                dispatch(getQuestionsByExamAsync({ examId: id, params: { limit: 1000 } }));
            }
        }
    };

    const isLoading = sectionsLoading || questionsLoading;

    return (
        <div className="h-full flex-1 flex flex-col">
            <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
                {/* Left Panel - Section Details & Questions */}
                <div className="flex flex-1 flex-col gap-4">
                    {/* Section Tabs */}
                    <ExamSectionTabs
                        sections={sortedSections}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        onAddSection={handleAddSection}
                    />

                    {/* Scrollable content */}
                    <div className="flex-1 bg-primary border border-border rounded-lg p-4">
                        <div className="flex flex-1 flex-col gap-6">
                            <ExamSectionDetail
                                section={currentSection}
                                questionsCount={filteredQuestions.length}
                                onEditSection={handleEditSection}
                            />

                            <ExamQuestionsList
                                questions={filteredQuestions}
                                loading={isLoading}
                                sectionTitle={currentSection?.title}
                                isDragOver={isDragOverSection}
                                onDragOver={handleSectionDragOver}
                                onDragLeave={handleSectionDragLeave}
                                onDrop={handleSectionDrop}
                                draggedQuestionId={draggedQuestion?.questionId}
                                onQuestionDragStart={handleQuestionDragStart}
                                onQuestionDragEnd={handleQuestionDragEnd}
                                isUncategorized={activeTab === null}
                                dragSource={dragSource}
                                onReorderQuestions={handleReorderQuestions}
                                height='h-[600px]'
                                onEditQuestion={handleEditQuestion}
                                onRemoveQuestion={handleRemoveQuestion}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - All Questions */}
                <div className="flex flex-col min-h-0">
                    <div 
                        className={`
                            h-fit bg-primary border-2 rounded-lg p-4 transition-colors
                            ${isDragOverAllQuestions && dragSource === 'section' 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-border'
                            }
                        `}
                        onDragOver={handleAllQuestionsDragOver}
                        onDragLeave={handleAllQuestionsDragLeave}
                        onDrop={handleAllQuestionsDrop}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Câu hỏi chưa phân loại
                        </h3>
                        <ExamQuestionsList
                            questions={uncategorizedQuestions}
                            loading={isLoading}
                            draggedQuestionId={draggedQuestion?.questionId}
                            onQuestionDragStart={handleQuestionDragStart}
                            onQuestionDragEnd={handleQuestionDragEnd}
                            dragSource={dragSource}
                            isAllQuestions={true}
                            height="h-[800px]"
                            onEditQuestion={handleEditQuestion}
                            onRemoveQuestion={handleRemoveQuestion}
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel for Adding/Editing Section or Question */}
            <RightPanel
                isOpen={isRightPanelOpen}
                onClose={handleCloseRightPanel}
                title={
                    rightPanelMode === 'add' 
                        ? 'Tạo phần mới' 
                        : rightPanelMode === 'editQuestion'
                        ? 'Chỉnh sửa câu hỏi'
                        : 'Chỉnh sửa phần'
                }
            >
                {rightPanelMode === 'add' ? (
                    <AddSection 
                        onClose={handleCloseRightPanel}
                        examId={id}
                        onSectionCreated={handleSectionCreated}
                    />
                ) : rightPanelMode === 'editQuestion' ? (
                    <EditQuestion
                        questionId={editingQuestion?.questionId}
                        onClose={handleCloseRightPanel}
                        loadQuestions={handleQuestionUpdated}
                    />
                ) : (
                    <EditSection 
                        onClose={handleCloseRightPanel}
                        section={editingSection}
                        onSectionUpdated={handleSectionUpdated}
                    />
                )}
            </RightPanel>

            {/* Confirm Modal for Removing Question */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancelRemove}
                onConfirm={handleConfirmRemove}
                title="Gỡ câu hỏi khỏi đề thi"
                message={`Bạn có chắc chắn muốn gỡ câu hỏi "${questionToRemove?.content?.substring(0, 50)}..." khỏi đề thi này không?`}
                confirmText="Gỡ câu hỏi"
                cancelText="Hủy"
                variant="danger"
                isLoading={removeFromExamLoading}
            />
        </div>
    );
};
