import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button, Input, Textarea } from '../../../shared/components/ui';
import { CourseSearchSelect } from '../../course/components/CourseSearchSelect';
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
    defaultCourse,
    mode = 'create',
}) => {
    // Khóa học đang dùng để lọc danh sách bài tập về nhà bên dưới.
    // Mặc định là khóa học của lớp hiện tại — admin có thể đổi sang khóa học khác
    // để gắn bài tập về nhà thuộc khóa học đó cho buổi học này.
    const [homeworkCourse, setHomeworkCourse] = useState(
        defaultCourse || (courseId ? { courseId } : null)
    );

    const homeworkCourseId = homeworkCourse?.courseId ?? null;
    const isOwnCourse = !courseId || homeworkCourseId === courseId;

    const handleHomeworkCourseChange = (course) => {
        setHomeworkCourse(course);
        // Đổi khóa học thì danh sách bài tập thay đổi theo => bỏ bài tập đã chọn trước đó
        // để tránh gắn nhầm bài tập của khóa học cũ.
        onHomeworkChange(null);
    };

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
                <div className="space-y-3 rounded-md border border-border p-4">
                    <div>
                        <p className="text-sm font-medium text-foreground mb-2">
                            Bài tập về nhà cho buổi học
                        </p>
                        <p className="text-xs text-foreground-light mb-3">
                            Không bắt buộc. Nếu muốn gắn bài tập về nhà, hãy chọn khóa học chứa bài tập đó,
                            rồi chọn bài tập cụ thể ở ô bên dưới.
                        </p>
                    </div>

                    {/* ===== COURSE OF THE HOMEWORK ===== */}
                    <div>
                        <CourseSearchSelect
                            label="Khóa học chứa bài tập"
                            placeholder="Tìm khóa học..."
                            value={homeworkCourse}
                            onSelect={handleHomeworkCourseChange}
                            disabled={loading}
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Mặc định là khóa học của lớp này. Chọn một khóa học khác nếu bài tập
                            bạn muốn gắn thuộc khóa học đó.
                        </p>
                    </div>

                    {!isOwnCourse && (
                        <div className="flex items-start gap-2 rounded-sm bg-amber-50 border border-amber-200 px-3 py-2">
                            <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-700">
                                Bạn đang chọn bài tập về nhà từ khóa học "{homeworkCourse?.title || 'khác'}" —
                                khác với khóa học của lớp này{defaultCourse?.title ? ` ("${defaultCourse.title}")` : ''}.
                                Chọn lại khóa học của lớp ở trên nếu muốn quay về bài tập thuộc khóa học gốc.
                            </p>
                        </div>
                    )}

                    {/* ===== HOMEWORK PICKER (scoped to the course selected above) ===== */}
                    <div>
                        <HomeworkContentSearchSelect
                            label="Bài tập về nhà"
                            placeholder={homeworkCourseId ? 'Chọn bài tập trong khóa học đã chọn ở trên...' : 'Chọn khóa học ở trên trước'}
                            onSelect={onHomeworkChange}
                            value={formData.homeworkId}
                            error={errors.homeworkId}
                            courseId={homeworkCourseId}
                            disabled={!homeworkCourseId || loading}
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Danh sách chỉ hiển thị bài tập thuộc khóa học đã chọn ở trên.
                        </p>
                    </div>
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
