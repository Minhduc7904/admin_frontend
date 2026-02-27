import { FileText } from 'lucide-react';
import { Input, Button, Dropdown, Textarea } from '../../../shared/components';
import { SubjectSearchSelect } from '../../subject/components/SubjectSearchSelect';
import { GRADE_OPTIONS } from '../../../core/constants/grade-constants';

import { VISIBILITY_OPTIONS } from '../../../core/constants';

export const TempExamForm = ({ 
    formData, 
    onChange, 
    onSubmit, 
    onCancel, 
    isSubmitting,
    errors = {},
    isEditing = false,
    onGradeChange,
    onVisibilityChange,
    onSubjectSelect,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
            <div className="flex items-center mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Thông tin đề thi
                </h2>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
                <div>
                    <Input
                        error={errors.title}
                        name="title"
                        label="Tiêu đề"
                        required={true}
                        value={formData.title}
                        onChange={onChange}
                        placeholder="Nhập tiêu đề đề thi"
                    />
                </div>

                <div>
                    <Textarea
                        error={errors.description}
                        name="description"
                        label="Mô tả"
                        value={formData.description}
                        onChange={onChange}
                        placeholder="Nhập mô tả đề thi"
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Dropdown
                            label="Khối"
                            value={formData.grade}
                            onChange={onGradeChange}
                            options={GRADE_OPTIONS}
                            error={errors.grade}
                        />
                    </div>

                    <div>
                        <SubjectSearchSelect
                            required={true}
                            label="Môn học"
                            placeholder="Tìm kiếm môn học..."
                            value={formData.subjectId}
                            onSelect={onSubjectSelect}
                            error={errors.subjectId}
                        />
                    </div>
                </div>

                <div>
                    <Dropdown
                        label="Trạng thái hiển thị"
                        value={formData.visibility}
                        onChange={onVisibilityChange}
                        options={VISIBILITY_OPTIONS}
                        error={errors.visibility}
                    />
                </div>

                <div>
                    <Input
                        error={errors.solutionYoutubeUrl}
                        name="solutionYoutubeUrl"
                        label="Link YouTube hướng dẫn giải"
                        value={formData.solutionYoutubeUrl}
                        onChange={onChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>
            </div>

            <div className="pt-6 flex gap-3 border-t border-border mt-auto">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Hủy
                </Button>
                <Button
                    type="button"
                    onClick={onSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {isEditing ? 'Cập nhật' : 'Tạo đề thi'}
                </Button>
            </div>
        </div>
    );
};

