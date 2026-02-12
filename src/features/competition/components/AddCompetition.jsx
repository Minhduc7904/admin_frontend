import { createCompetitionAsync, selectCompetitionLoadingCreate } from "../store/competitionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Input, Button, Dropdown, Checkbox } from "../../../shared/components/ui";
import { ExamSearchSelect } from "../../exam/components/ExamSearchSelect";
import { VISIBILITY_OPTIONS, VISIBILITY } from "../../../core/constants";
import { MarkdownEditorWithLabel } from "../../../shared/components/markdown";

export const AddCompetition = ({ onClose, loadCompetitions }) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectCompetitionLoadingCreate);

    const [errors, setErrors] = useState({});
    const [selectedExam, setSelectedExam] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        examId: '',
        policies: '',
        startDate: '',
        endDate: '',
        durationMinutes: '',
        maxAttempts: '',
        visibility: VISIBILITY.DRAFT,
        showResultDetail: true,
        allowLeaderboard: true,
        allowViewScore: true,
        allowViewAnswer: false,
        enableAntiCheating: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCheckboxChange = (name, checked) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const validateCreateCompetition = (data) => {
        const errors = {};

        if (!data.title?.trim()) errors.title = 'Tên cuộc thi không được để trống';
        if (data.subtitle && data.subtitle.length > 255) errors.subtitle = 'Phụ đề không được quá 255 ký tự';
        if (!data.startDate) errors.startDate = 'Vui lòng chọn ngày bắt đầu';
        if (!data.endDate) errors.endDate = 'Vui lòng chọn ngày kết thúc';

        if (data.startDate && data.endDate) {
            if (new Date(data.endDate) <= new Date(data.startDate)) {
                errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }

        if (data.durationMinutes && (+data.durationMinutes < 1 || +data.durationMinutes > 999999)) {
            errors.durationMinutes = 'Thời lượng phải từ 1 đến 999999 phút';
        }

        if (data.maxAttempts && (+data.maxAttempts < 1 || +data.maxAttempts > 999)) {
            errors.maxAttempts = 'Số lần làm phải từ 1 đến 999';
        }

        if (!data.visibility) errors.visibility = 'Vui lòng chọn trạng thái';

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateCreateCompetition(formData);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            title: formData.title.trim(),
            subtitle: formData.subtitle?.trim() || undefined,
            examId: formData.examId ? Number(formData.examId) : undefined,
            policies: formData.policies?.trim() || undefined,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            durationMinutes: formData.durationMinutes ? Number(formData.durationMinutes) : undefined,
            maxAttempts: formData.maxAttempts ? Number(formData.maxAttempts) : undefined,
            visibility: formData.visibility,
            showResultDetail: formData.showResultDetail,
            allowLeaderboard: formData.allowLeaderboard,
            allowViewScore: formData.allowViewScore,
            allowViewAnswer: formData.allowViewAnswer,
            enableAntiCheating: formData.enableAntiCheating,
        };

        await dispatch(createCompetitionAsync(payload)).unwrap();
        loadCompetitions?.();
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">

                {/* Tên cuộc thi */}
                <Input
                    label="Tên cuộc thi"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    placeholder="VD: Olympic Toán học cấp trường 2024"
                    tooltipText={`Tên hiển thị chính của cuộc thi.
Học sinh sẽ thấy tên này ở danh sách và trang chi tiết.`}
                />

                {/* Phụ đề */}
                <Input
                    label="Phụ đề"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    error={errors.subtitle}
                    placeholder="VD: Dành cho học sinh lớp 10–12"
                    tooltipText={`Mô tả ngắn bổ sung cho tên cuộc thi.
Có thể bỏ trống nếu không cần.`}
                />

                {/* Đề thi */}
                <ExamSearchSelect
                    label="Đề thi"
                    placeholder="Tìm và chọn đề thi..."
                    value={selectedExam}
                    onSelect={(exam) => {
                        setSelectedExam(exam);
                        setFormData(prev => ({ ...prev, examId: exam?.examId || '' }));
                        console.log(exam);
                    }}
                    visibility="PUBLISHED"
                    tooltipText={`Đề thi được dùng cho cuộc thi này.
Chỉ các đề đã công khai mới có thể chọn.`}
                />

                {/* Thời gian */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Ngày bắt đầu"
                        type="datetime-local"
                        required
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        error={errors.startDate}
                        tooltipText={`Thời điểm cuộc thi bắt đầu.
Học sinh chỉ có thể truy cập sau thời gian này.`}
                    />

                    <Input
                        label="Ngày kết thúc"
                        type="datetime-local"
                        required
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        error={errors.endDate}
                        tooltipText={`Thời điểm cuộc thi kết thúc.
Sau thời gian này học sinh không thể làm bài.`}
                    />
                </div>

                {/* Giới hạn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Thời lượng làm bài (phút)"
                        type="number"
                        name="durationMinutes"
                        value={formData.durationMinutes}
                        onChange={handleChange}
                        error={errors.durationMinutes}
                        placeholder="VD: 90"
                        tooltipText={`Thời gian tối đa cho mỗi lượt làm bài.
Để trống nếu không giới hạn thời gian.`}
                    />

                    <Input
                        label="Số lần được làm"
                        type="number"
                        name="maxAttempts"
                        value={formData.maxAttempts}
                        onChange={handleChange}
                        error={errors.maxAttempts}
                        placeholder="VD: 3"
                        tooltipText={`Số lượt làm bài tối đa cho mỗi học sinh.
Để trống nếu cho phép làm không giới hạn.`}
                    />
                </div>

                {/* Trạng thái */}
                <Dropdown
                    label="Trạng thái cuộc thi"
                    required
                    value={formData.visibility}
                    onChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                    options={VISIBILITY_OPTIONS}
                    error={errors.visibility}
                    tooltipText={`Công khai: Hiển thị ở trang public.
Riêng tư: Chỉ người có link mới truy cập được.
Nháp: Chỉ admin mới có thể xem.`}
                />

                {/* Chính sách */}
                <MarkdownEditorWithLabel
                    label="Chính sách cuộc thi"
                    value={formData.policies}
                    onChange={(value) => setFormData(prev => ({ ...prev, policies: value }))}
                    height="200px"
                    maxLength={5000}
                    error={errors.policies}
                    tooltipText={`Quy định và lưu ý dành cho học sinh.
Ví dụ: cách tính điểm, xử lý gian lận, khiếu nại.`}
                />

                {/* Cài đặt */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700">Cài đặt hiển thị</h3>

                    <Checkbox
                        label="Hiển thị chi tiết kết quả"
                        checked={formData.showResultDetail}
                        onChange={(v) => handleCheckboxChange('showResultDetail', v)}
                        tooltipText="Cho phép học sinh xem đúng/sai từng câu sau khi làm xong."
                    />

                    <Checkbox
                        label="Hiển thị bảng xếp hạng"
                        checked={formData.allowLeaderboard}
                        onChange={(v) => handleCheckboxChange('allowLeaderboard', v)}
                        tooltipText="Công khai bảng xếp hạng điểm của các học sinh tham gia."
                    />

                    <Checkbox
                        label="Cho phép xem điểm"
                        checked={formData.allowViewScore}
                        onChange={(v) => handleCheckboxChange('allowViewScore', v)}
                        tooltipText="Học sinh có thể xem điểm tổng sau khi hoàn thành."
                    />

                    <Checkbox
                        label="Cho phép xem đáp án"
                        checked={formData.allowViewAnswer}
                        onChange={(v) => handleCheckboxChange('allowViewAnswer', v)}
                        tooltipText="Học sinh được xem đáp án đúng sau khi nộp bài."
                    />

                    <Checkbox
                        label="Bật chống gian lận"
                        checked={formData.enableAntiCheating}
                        onChange={(v) => handleCheckboxChange('enableAntiCheating', v)}
                        tooltipText="Kích hoạt các biện pháp hạn chế gian lận như chuyển tab, copy."
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button type="submit" loading={loadingCreate}>
                    Tạo cuộc thi
                </Button>
            </div>
        </form>
    );
};
