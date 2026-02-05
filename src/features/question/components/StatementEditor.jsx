import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, MoveUp, MoveDown, Save, X } from 'lucide-react';
import { Button, Dropdown, Checkbox } from '../../../shared/components';
import { DIFFICULTY_OPTIONS } from '../../../core/constants/question-constants';
import { MarkdownEditorPreview } from '../../../shared/components/markdown/MarkdownEditorPreview';
import { 
    createStatementAsync, 
    updateStatementAsync, 
    deleteStatementAsync,
    selectStatementLoadingCreate,
    selectStatementLoadingUpdate,
    selectStatementLoadingDelete
} from '../../statement/store/statementSlice';

export const StatementEditor = ({ questionId, statements: initialStatements = [] }) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectStatementLoadingCreate);
    const loadingUpdate = useSelector(selectStatementLoadingUpdate);
    const loadingDelete = useSelector(selectStatementLoadingDelete);

    const [statements, setStatements] = useState(
        initialStatements.map(stmt => ({
            ...stmt,
            isEditing: false,
            editedContent: stmt.processedContent || stmt.content,
            editedIsCorrect: stmt.isCorrect,
            editedDifficulty: stmt.difficulty,
        }))
    );

    const [newStatement, setNewStatement] = useState({
        content: '',
        isCorrect: false,
        difficulty: undefined,
    });

    const [isAddingNew, setIsAddingNew] = useState(false);

    // Handle edit existing statement
    const handleStartEdit = (index) => {
        const newStatements = [...statements];
        newStatements[index].isEditing = true;
        setStatements(newStatements);
    };

    const handleCancelEdit = (index) => {
        const newStatements = [...statements];
        const stmt = newStatements[index];
        stmt.isEditing = false;
        stmt.editedContent = stmt.processedContent || stmt.content;
        stmt.editedIsCorrect = stmt.isCorrect;
        stmt.editedDifficulty = stmt.difficulty;
        setStatements(newStatements);
    };

    const handleUpdateStatementField = (index, field, value) => {
        const newStatements = [...statements];
        newStatements[index][field] = value;
        setStatements(newStatements);
    };

    const handleSaveEdit = async (index) => {
        const stmt = statements[index];
        const data = {
            content: stmt.editedContent,
            isCorrect: stmt.editedIsCorrect,
            difficulty: stmt.editedDifficulty || undefined,
        };

        try {
            await dispatch(updateStatementAsync({ id: stmt.statementId, data })).unwrap();
            const newStatements = [...statements];
            newStatements[index] = {
                ...stmt,
                content: stmt.editedContent,
                processedContent: stmt.editedContent,
                isCorrect: stmt.editedIsCorrect,
                difficulty: stmt.editedDifficulty,
                isEditing: false,
            };
            setStatements(newStatements);
        } catch (error) {
            console.error('Failed to update statement:', error);
        }
    };

    // Handle delete statement
    const handleDeleteStatement = async (index) => {
        const stmt = statements[index];
        if (!window.confirm(`Bạn có chắc muốn xóa đáp án này?`)) {
            return;
        }

        try {
            await dispatch(deleteStatementAsync(stmt.statementId)).unwrap();
            const newStatements = statements.filter((_, i) => i !== index);
            setStatements(newStatements);
        } catch (error) {
            console.error('Failed to delete statement:', error);
        }
    };

    // Handle create new statement
    const handleStartAddNew = () => {
        setIsAddingNew(true);
    };

    const handleCancelAddNew = () => {
        setIsAddingNew(false);
        setNewStatement({
            content: '',
            isCorrect: false,
            difficulty: undefined,
        });
    };

    const handleSaveNew = async () => {
        if (!newStatement.content.trim()) {
            alert('Nội dung đáp án không được để trống');
            return;
        }

        const data = {
            content: newStatement.content,
            isCorrect: newStatement.isCorrect,
            order: statements.length + 1,
            difficulty: newStatement.difficulty || undefined,
        };

        try {
            const result = await dispatch(createStatementAsync({ questionId, data })).unwrap();
            setStatements([...statements, {
                ...result.data,
                isEditing: false,
                editedContent: result.data.processedContent || result.data.content,
                editedIsCorrect: result.data.isCorrect,
                editedDifficulty: result.data.difficulty,
            }]);
            handleCancelAddNew();
        } catch (error) {
            console.error('Failed to create statement:', error);
        }
    };

    const handleMoveUp = async (index) => {
        if (index === 0) return;
        const newStatements = [...statements];
        [newStatements[index - 1], newStatements[index]] = [newStatements[index], newStatements[index - 1]];
        
        // Update order for both statements
        try {
            await Promise.all([
                dispatch(updateStatementAsync({ 
                    id: newStatements[index].statementId, 
                    data: { order: index + 1 } 
                })).unwrap(),
                dispatch(updateStatementAsync({ 
                    id: newStatements[index - 1].statementId, 
                    data: { order: index } 
                })).unwrap(),
            ]);
            setStatements(newStatements);
        } catch (error) {
            console.error('Failed to reorder statements:', error);
        }
    };

    const handleMoveDown = async (index) => {
        if (index === statements.length - 1) return;
        const newStatements = [...statements];
        [newStatements[index], newStatements[index + 1]] = [newStatements[index + 1], newStatements[index]];
        
        // Update order for both statements
        try {
            await Promise.all([
                dispatch(updateStatementAsync({ 
                    id: newStatements[index].statementId, 
                    data: { order: index + 1 } 
                })).unwrap(),
                dispatch(updateStatementAsync({ 
                    id: newStatements[index + 1].statementId, 
                    data: { order: index + 2 } 
                })).unwrap(),
            ]);
            setStatements(newStatements);
        } catch (error) {
            console.error('Failed to reorder statements:', error);
        }
    };

    const statementLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    Đáp án (Statements)
                </label>
                {!isAddingNew && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleStartAddNew}
                        className="flex items-center gap-2"
                        disabled={loadingCreate}
                    >
                        <Plus className="w-4 h-4" />
                        Thêm đáp án
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {/* Existing Statements */}
                {statements.map((statement, index) => (
                    <div key={statement.statementId} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                        <div className="flex items-start gap-2">
                            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                statement.isCorrect 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-300 text-gray-700'
                            }`}>
                                {statementLabels[index] || index + 1}
                            </span>

                            <div className="flex-1 space-y-3">
                                {statement.isEditing ? (
                                    <>
                                        {/* Edit Mode */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nội dung đáp án {statementLabels[index]}
                                            </label>
                                            <MarkdownEditorPreview
                                                value={statement.editedContent}
                                                onChange={(value) => handleUpdateStatementField(index, 'editedContent', value)}
                                                height="300px"
                                                editable={true}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Checkbox
                                                id={`correct-edit-${index}`}
                                                checked={statement.editedIsCorrect}
                                                onChange={(checked) => handleUpdateStatementField(index, 'editedIsCorrect', checked)}
                                                label="Đáp án đúng"
                                            />

                                            <Dropdown
                                                label="Độ khó"
                                                value={statement.editedDifficulty || ''}
                                                onChange={(value) => handleUpdateStatementField(index, 'editedDifficulty', value || undefined)}
                                                options={[{ value: '', label: 'Không chọn' }, ...DIFFICULTY_OPTIONS]}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleSaveEdit(index)}
                                                loading={loadingUpdate}
                                                disabled={loadingUpdate}
                                                className="flex items-center gap-1"
                                            >
                                                <Save className="w-4 h-4" />
                                                Lưu
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCancelEdit(index)}
                                                disabled={loadingUpdate}
                                                className="flex items-center gap-1"
                                            >
                                                <X className="w-4 h-4" />
                                                Hủy
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* View Mode */}
                                        <div className="prose prose-sm max-w-none">
                                            <MarkdownEditorPreview
                                                value={statement.processedContent || statement.content}
                                                height="auto"
                                                editable={false}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className={statement.isCorrect ? 'text-green-600 font-semibold' : ''}>
                                                {statement.isCorrect ? '✓ Đáp án đúng' : 'Đáp án sai'}
                                            </span>
                                            {statement.difficulty && (
                                                <span>Độ khó: {statement.difficulty}</span>
                                            )}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStartEdit(index)}
                                        >
                                            Chỉnh sửa
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0 || statement.isEditing}
                                    className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Di chuyển lên"
                                >
                                    <MoveUp className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === statements.length - 1 || statement.isEditing}
                                    className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Di chuyển xuống"
                                >
                                    <MoveDown className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteStatement(index)}
                                    disabled={statement.isEditing}
                                    className="p-1.5 hover:bg-red-100 text-red-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Statement Form */}
                {isAddingNew && (
                    <div className="border-2 border-dashed border-primary rounded-lg p-4 bg-blue-50 space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung đáp án mới
                            </label>
                            <MarkdownEditorPreview
                                value={newStatement.content}
                                onChange={(value) => setNewStatement(prev => ({ ...prev, content: value }))}
                                height="300px"
                                editable={true}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Checkbox
                                id="correct-new"
                                checked={newStatement.isCorrect}
                                onChange={(checked) => setNewStatement(prev => ({ ...prev, isCorrect: checked }))}
                                label="Đáp án đúng"
                            />

                            <Dropdown
                                label="Độ khó"
                                value={newStatement.difficulty || ''}
                                onChange={(value) => setNewStatement(prev => ({ ...prev, difficulty: value || undefined }))}
                                options={[{ value: '', label: 'Không chọn' }, ...DIFFICULTY_OPTIONS]}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleSaveNew}
                                loading={loadingCreate}
                                disabled={loadingCreate}
                                className="flex items-center gap-1"
                            >
                                <Save className="w-4 h-4" />
                                Tạo đáp án
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCancelAddNew}
                                disabled={loadingCreate}
                                className="flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Hủy
                            </Button>
                        </div>
                    </div>
                )}

                {statements.length === 0 && !isAddingNew && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                        Chưa có đáp án nào. Nhấn "Thêm đáp án" để tạo mới.
                    </div>
                )}
            </div>
        </div>
    );
};
