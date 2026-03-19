import { Button, Input, Textarea } from '../../../shared/components/ui';
import { HomeworkContentSearchSelect } from '../../homeworkContent/components/HomeworkContentSearchSelect';

export const ClassSessionForm = ({
    formData,
    errors = {},
    onChange,
    onSubmit,
    onCancel,
    onHomeworkChange,
    loading,
    courseId,
    mode = 'create',
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            {/* ===== BODY ===== */}
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* ===== NAME ===== */}
                <div>
                    <Input
                        label="Tên buổi học"
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="Ví dụ: Buổi 1 - Giới thiệu môn học"
                        maxLength={200}
                        error={errors.name}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Tên mô tả cho buổi học (tối đa 200 ký tự)
                    </p>
                </div>

                {/* ===== SESSION DATE ===== */}
                <div>
                    <Input
                        label="Ngày học"
                        required
                        type="date"
                        name="sessionDate"
                        value={formData.sessionDate}
                        onChange={onChange}
                        error={errors.sessionDate}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Chọn ngày diễn ra buổi học
                    </p>
                </div>

                {/* ===== START TIME ===== */}
                <div>
                    <Input
                        label="Giờ bắt đầu"
                        required
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={onChange}
                        error={errors.startTime}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Thời gian bắt đầu buổi học
                    </p>
                </div>

                {/* ===== END TIME ===== */}
                <div>
                    <Input
                        label="Giờ kết thúc"
                        required
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={onChange}
                        error={errors.endTime}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Thời gian kết thúc buổi học
                    </p>
                </div>

                {/* ===== MAKEUP NOTE ===== */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Ghi chú học bù
                    </label>
                    <Textarea
                        name="makeupNote"
                        value={formData.makeupNote || ''}
                        onChange={onChange}
                        placeholder="Ghi chú các buổi có thể học bù thay cho buổi này..."
                        rows={4}
                        maxLength={500}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Thông tin về các buổi học bù (nếu có)
                    </p>
                </div>

                {/* ===== HOMEWORK CONTENT ===== */}
                <div>
                    <HomeworkContentSearchSelect
                        label="Bài tập về nhà"
                        placeholder={courseId ? 'Chọn bài tập cho buổi học...' : 'Chưa xác định khóa học của lớp'}
                        onSelect={onHomeworkChange}
                        value={formData.homeworkId}
                        error={errors.homeworkId}
                        courseId={courseId}
                        disabled={!courseId || loading}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Có thể chọn bài tập về nhà liên kết cho buổi học (không bắt buộc)
                    </p>
                </div>
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="border-t border-border px-6 py-4 flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                >
                    {mode === 'create' ? 'Tạo buổi học' : 'Cập nhật'}
                </Button>
            </div>
        </form>
    );
};
