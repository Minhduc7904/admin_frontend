import { useState } from 'react';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { Button, Input, Dropdown, Checkbox } from '../../../shared/components';
import { DIFFICULTY_OPTIONS } from '../../../core/constants/question-constants';
import { MarkdownEditorPreview } from '../../../shared/components/markdown/MarkdownEditorPreview';

export const StatementManager = ({ statements = [], onChange, error }) => {
    const handleAddStatement = () => {
        const newStatement = {
            content: '',
            isCorrect: false,
            order: statements.length + 1,
            difficulty: undefined,
        };
        onChange([...statements, newStatement]);
    };

    const handleRemoveStatement = (index) => {
        const newStatements = statements.filter((_, i) => i !== index);
        // Reorder
        const reordered = newStatements.map((stmt, i) => ({ ...stmt, order: i + 1 }));
        onChange(reordered);
    };

    const handleUpdateStatement = (index, field, value) => {
        const newStatements = [...statements];
        newStatements[index] = { ...newStatements[index], [field]: value };
        onChange(newStatements);
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newStatements = [...statements];
        [newStatements[index - 1], newStatements[index]] = [newStatements[index], newStatements[index - 1]];
        // Reorder
        const reordered = newStatements.map((stmt, i) => ({ ...stmt, order: i + 1 }));
        onChange(reordered);
    };

    const handleMoveDown = (index) => {
        if (index === statements.length - 1) return;
        const newStatements = [...statements];
        [newStatements[index], newStatements[index + 1]] = [newStatements[index + 1], newStatements[index]];
        // Reorder
        const reordered = newStatements.map((stmt, i) => ({ ...stmt, order: i + 1 }));
        onChange(reordered);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    Đáp án (Statements)
                </label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStatement}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Thêm đáp án
                </Button>
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="space-y-3">
                {statements.map((statement, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                        <div className="flex items-start gap-2">
                            <div className="flex-1 space-y-3">
                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung đáp án {index + 1}
                                    </label>
                                    <MarkdownEditorPreview
                                        value={statement.content}
                                        onChange={(value) => handleUpdateStatement(index, 'content', value)}
                                        height="300px"
                                        editable={true}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Is Correct */}
                                    <Checkbox
                                        id={`correct-${index}`}
                                        checked={statement.isCorrect}
                                        onChange={(checked) => handleUpdateStatement(index, 'isCorrect', checked)}
                                        label="Đáp án đúng"
                                    />

                                    {/* Difficulty */}
                                    <Dropdown
                                        label="Độ khó"
                                        value={statement.difficulty || ''}
                                        onChange={(value) => handleUpdateStatement(index, 'difficulty', value || undefined)}
                                        options={[{ value: '', label: 'Không chọn' }, ...DIFFICULTY_OPTIONS]}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                    className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Di chuyển lên"
                                >
                                    <MoveUp className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === statements.length - 1}
                                    className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Di chuyển xuống"
                                >
                                    <MoveDown className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveStatement(index)}
                                    className="p-1.5 hover:bg-red-100 text-red-600 rounded"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {statements.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                        Chưa có đáp án nào. Nhấn "Thêm đáp án" để tạo mới.
                    </div>
                )}
            </div>
        </div>
    );
};
