import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    splitExamFromSessionAsync,
    splitExamFromRawContentAsync,
    classifyChaptersAsync,
    selectExamImportSessionSplitResult,
    selectExamImportSessionLoadingSplit,
    selectExamImportSessionLoadingClassifyChapters,
    getSessionRawContentAsync,
    selectExamImportSessionRawContent,
    selectExamImportSessionLoadingRawContent,
} from '../store/examImportSessionSlice';
import {
    getTempQuestionsBySessionAsync,
    getTempQuestionByIdAsync,
    deleteTempQuestionAsync,
    updateStatementsOrder,
    selectTempQuestions,
    selectTempQuestionLoadingGet,
    selectTempQuestionLoadingDelete,
    clearTempQuestions,
} from '../../tempQuestion/store/tempQuestionSlice';
import { ProcessQuestionsSidebar, QuestionsList, SplitConfirmationModal } from '../components';
import { EditTempQuestionPanel } from '../components/EditTempQuestionPanel';
import { EditTempStatementPanel } from '../components/EditTempStatementPanel';
import { CreateQuestionModal } from '../components/CreateQuestionModal';
import { CreateStatementModal } from '../components/CreateStatementModal';
import { deleteTempStatementAsync, reorderTempStatementsAsync, selectTempStatementLoadingDelete } from '../../tempStatement/store/tempStatementSlice';
import { ConfirmModal } from '../../../shared/components';

export const ProcessQuestions = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingSplitData, setPendingSplitData] = useState(null);
    const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
    const [isEditStatementModalOpen, setIsEditStatementModalOpen] = useState(false);
    const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] = useState(false);
    const [isCreateStatementModalOpen, setIsCreateStatementModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'question' | 'statement', item, question? }
    const [currentEditingQuestion, setCurrentEditingQuestion] = useState(null);
    const [currentEditingStatement, setCurrentEditingStatement] = useState(null);
    const [currentCreatingForQuestion, setCurrentCreatingForQuestion] = useState(null);

    const splitResult = useSelector(selectExamImportSessionSplitResult);
    const splitLoading = useSelector(selectExamImportSessionLoadingSplit);
    const classifyChaptersLoading = useSelector(selectExamImportSessionLoadingClassifyChapters);
    const tempQuestions = useSelector(selectTempQuestions);
    const tempQuestionsLoading = useSelector(selectTempQuestionLoadingGet);
    const questionDeleteLoading = useSelector(selectTempQuestionLoadingDelete);
    const statementDeleteLoading = useSelector(selectTempStatementLoadingDelete);
    const sessionRawContentData = useSelector(selectExamImportSessionRawContent);
    const sessionRawContentLoading = useSelector(selectExamImportSessionLoadingRawContent);

    // Load session raw content and temp questions when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getSessionRawContentAsync({ sessionId: id }));
            dispatch(getTempQuestionsBySessionAsync(id));
        }
        return () => {
            dispatch(clearTempQuestions());
        };
    }, [id, dispatch]);

    const handleRefreshSessionContent = async () => {
        if (id) {
            await dispatch(getSessionRawContentAsync({ sessionId: id }));
        }
    };

    const handleSplitRequest = (content, method) => {
        setPendingSplitData({ content, method, sessionId: id });
        setIsConfirmModalOpen(true);
    };

    const handleConfirmSplit = async () => {
        if (!pendingSplitData) return;

        try {
            if (pendingSplitData.method === 'session') {
                // Tách từ session - gọi API với sessionId
                await dispatch(splitExamFromSessionAsync(pendingSplitData.sessionId)).unwrap();
            } else {
                // Tách từ custom content - gọi API với sessionId và rawContent
                await dispatch(splitExamFromRawContentAsync({ 
                    sessionId: pendingSplitData.sessionId,
                    rawContent: pendingSplitData.content 
                })).unwrap();
            }
            
            // Reload temp questions after split completes successfully
            dispatch(getTempQuestionsBySessionAsync(id));
            setIsConfirmModalOpen(false);
            setPendingSplitData(null);
        } catch (error) {
            // Error already handled by asyncThunkHelper
        }
    };

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setPendingSplitData(null);
    };

    const handleCloseEditQuestionModal = () => {
        setIsEditQuestionModalOpen(false);
        setCurrentEditingQuestion(null);
    };

    const handleCloseEditStatementModal = () => {
        setIsEditStatementModalOpen(false);
        setCurrentEditingStatement(null);
    };

    const handleCloseCreateQuestionModal = () => {
        setIsCreateQuestionModalOpen(false);
    };

    const handleCloseCreateStatementModal = () => {
        setIsCreateStatementModalOpen(false);
        setCurrentCreatingForQuestion(null);
    };

    const handleEditSuccess = () => {
        // Reload only the edited question by ID (faster than reloading entire list)
        if (currentEditingQuestion?.tempQuestionId) {
            dispatch(getTempQuestionByIdAsync(currentEditingQuestion.tempQuestionId));
        }
    };

    const handleCreateSuccess = () => {
        // Reload entire list after creating new question/statement
        if (id) {
            dispatch(getTempQuestionsBySessionAsync(id));
        }
    };

    const handleEditQuestion = (question) => {
        setCurrentEditingQuestion(question);
        setIsEditQuestionModalOpen(true);
    };

    const handleEditStatement = (statement, question) => {
        setCurrentEditingStatement(statement);
        setCurrentEditingQuestion(question);
        setIsEditStatementModalOpen(true);
    };

    const handleCreateQuestion = () => {
        setIsCreateQuestionModalOpen(true);
    };

    const handleCreateStatement = (question) => {
        setCurrentCreatingForQuestion(question);
        setIsCreateStatementModalOpen(true);
    };

    const handleDeleteQuestion = (question) => {
        if (!question?.tempQuestionId) return;
        setDeleteTarget({ type: 'question', item: question });
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteStatement = (statement, question) => {
        if (!statement?.tempStatementId) return;
        setDeleteTarget({ type: 'statement', item: statement, question });
        setIsDeleteConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            if (deleteTarget.type === 'question') {
                await dispatch(deleteTempQuestionAsync(deleteTarget.item.tempQuestionId)).unwrap();
                // Reload list after successful delete
                if (id) {
                    dispatch(getTempQuestionsBySessionAsync(id));
                }
            } else if (deleteTarget.type === 'statement') {
                await dispatch(deleteTempStatementAsync(deleteTarget.item.tempStatementId)).unwrap();
                // Reload the question to refresh statement list
                if (deleteTarget.question?.tempQuestionId) {
                    dispatch(getTempQuestionByIdAsync(deleteTarget.question.tempQuestionId));
                }
            }
            setIsDeleteConfirmModalOpen(false);
            setDeleteTarget(null);
        } catch (error) {
            // Error already handled by asyncThunkHelper
        }
    };

    const handleCloseDeleteConfirmModal = () => {
        setIsDeleteConfirmModalOpen(false);
        setDeleteTarget(null);
    };

    const handleReorderStatements = async (items, questionId) => {
        try {
            // First update local UI optimistically
            dispatch(updateStatementsOrder({ questionId, items }));
            
            // Then call API in background
            await dispatch(reorderTempStatementsAsync(items)).unwrap();
            // Success - UI already updated, no need to reload
        } catch (error) {
            // Error - reload the question to revert UI changes
            if (questionId) {
                dispatch(getTempQuestionByIdAsync(questionId));
            }
        }
    };

    const handleClassifyChapters = async () => {
        if (!id) return;
        
        try {
            await dispatch(classifyChaptersAsync(id)).unwrap();
            // Reload questions to show updated chapters
            dispatch(getTempQuestionsBySessionAsync(id));
        } catch (error) {
            // Error already handled by asyncThunkHelper
        }
    };

    // Called by ManualSplitTab after a successful (no-error) manual split
    const handleManualSplitSuccess = () => {
        if (id) {
            dispatch(getTempQuestionsBySessionAsync(id));
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-6 h-full">
                {/* Left Side - Action Panel */}
                <div className="flex flex-col h-full overflow-y-auto">
                    <ProcessQuestionsSidebar
                        sessionId={id}
                        sessionRawContentData={sessionRawContentData}
                        sessionRawContentLoading={sessionRawContentLoading}
                        onSplit={handleSplitRequest}
                        loading={splitLoading}
                        splitResult={splitResult}
                        onRefreshSessionContent={handleRefreshSessionContent}
                        onSplitSuccess={handleManualSplitSuccess}
                    />
                </div>

                {/* Right Side - Questions Preview */}
                <div className="flex flex-col h-full overflow-y-auto">
                    <QuestionsList
                        loading={tempQuestionsLoading}
                        questions={tempQuestions}
                        onEditQuestion={handleEditQuestion}
                        onEditStatement={handleEditStatement}
                        onCreateQuestion={handleCreateQuestion}
                        onCreateStatement={handleCreateStatement}
                        onDeleteQuestion={handleDeleteQuestion}
                        onDeleteStatement={handleDeleteStatement}
                        onReorderStatements={handleReorderStatements}
                        onClassifyChapters={handleClassifyChapters}
                        classifyChaptersLoading={classifyChaptersLoading}
                    />
                </div>
            </div>

            {/* Confirmation Modal */}
            <SplitConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmModal}
                onConfirm={handleConfirmSplit}
                rawContent={pendingSplitData?.content}
                method={pendingSplitData?.method}
                loading={splitLoading}
            />

            {/* Edit Question Panel */}
            <EditTempQuestionPanel
                isOpen={isEditQuestionModalOpen}
                onClose={handleCloseEditQuestionModal}
                question={currentEditingQuestion}
                onSuccess={handleEditSuccess}
            />

            {/* Edit Statement Panel */}
            <EditTempStatementPanel
                isOpen={isEditStatementModalOpen}
                onClose={handleCloseEditStatementModal}
                statement={currentEditingStatement}
                question={currentEditingQuestion}
                onSuccess={handleEditSuccess}
            />

            {/* Create Question Modal */}
            <CreateQuestionModal
                isOpen={isCreateQuestionModalOpen}
                onClose={handleCloseCreateQuestionModal}
                sessionId={id}
                onSuccess={handleCreateSuccess}
            />

            {/* Create Statement Modal */}
            <CreateStatementModal
                isOpen={isCreateStatementModalOpen}
                onClose={handleCloseCreateStatementModal}
                tempQuestionId={currentCreatingForQuestion?.tempQuestionId}
                question={currentCreatingForQuestion}
                onSuccess={handleCreateSuccess}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteConfirmModalOpen}
                onClose={handleCloseDeleteConfirmModal}
                onConfirm={handleConfirmDelete}
                title={deleteTarget?.type === 'question' ? 'Xóa câu hỏi' : 'Xóa đáp án'}
                message={
                    deleteTarget?.type === 'question'
                        ? `Bạn có chắc chắn muốn xóa câu hỏi ${deleteTarget?.item?.order}? Thao tác này không thể hoàn tác.`
                        : 'Bạn có chắc chắn muốn xóa đáp án này? Thao tác này không thể hoàn tác.'
                }
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deleteTarget?.type === 'question' ? questionDeleteLoading : statementDeleteLoading}
            />
        </>
    );
};
