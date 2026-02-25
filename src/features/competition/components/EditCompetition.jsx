import {
    updateCompetitionAsync,
    selectCompetitionLoadingUpdate,
    getCompetitionByIdAsync,
    selectCurrentCompetition,
    selectCompetitionLoadingGetById
} from "../store/competitionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Input, Button, Dropdown, Checkbox } from "../../../shared/components/ui";
import { VISIBILITY_OPTIONS } from "../../../core/constants";
import { MarkdownEditorWithLabel } from "../../../shared/components/markdown";
import { ExamSearchSelect } from "../../exam/components/ExamSearchSelect";

export const EditCompetition = ({ competitionId, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const loadingUpdate = useSelector(selectCompetitionLoadingUpdate);
    const loadingGet = useSelector(selectCompetitionLoadingGetById);
    const competition = useSelector(selectCurrentCompetition);

    const [errors, setErrors] = useState({});
    const [selectedExam, setSelectedExam] = useState(null);

    const [formData, setFormData] = useState({
        examId: '',
        title: '',
        subtitle: '',
        policies: '',
        startDate: '',
        endDate: '',
        durationMinutes: '',
        maxAttempts: '',
        visibility: 'DRAFT',
        showResultDetail: true,
        allowLeaderboard: true,
        allowViewScore: true,
        allowViewAnswer: false,
        enableAntiCheating: false,
        allowViewSolutionYoutubeUrl: false,
        allowViewExamContent: false,
    });

    // Fetch competition data on mount
    useEffect(() => {
        if (competitionId) {
            dispatch(getCompetitionByIdAsync(competitionId));
        }
    }, [dispatch, competitionId]);

    // Update form when competition data loads
    useEffect(() => {
        if (competition) {
            setFormData({
                examId: competition.examId || '',
                title: competition.title || '',
                subtitle: competition.subtitle || '',
                policies: competition.processedPolicies || competition.policies || '',
                startDate: competition.startDate ? new Date(competition.startDate).toISOString().slice(0, 16) : '',
                endDate: competition.endDate ? new Date(competition.endDate).toISOString().slice(0, 16) : '',
                durationMinutes: competition.durationMinutes || '',
                maxAttempts: competition.maxAttempts || '',
                visibility: competition.visibility || 'DRAFT',
                showResultDetail: competition.showResultDetail ?? true,
                allowLeaderboard: competition.allowLeaderboard ?? true,
                allowViewScore: competition.allowViewScore ?? true,
                allowViewAnswer: competition.allowViewAnswer ?? false,
                enableAntiCheating: competition.enableAntiCheating ?? false,
                allowViewSolutionYoutubeUrl: competition.allowViewSolutionYoutubeUrl ?? false,
                allowViewExamContent: competition.allowViewExamContent ?? false,
            });
        }
    }, [competition]);

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

    const validateUpdateCompetition = (data) => {
        const errors = {};

        // examId có thể update nếu chưa có (competition.examId === null)
        if (!competition?.examId && !data.examId) {
            errors.examId = 'Đề thi không được để trống';
        }

        if (!data.title?.trim()) errors.title = 'Tên cuộc thi không được để trống';
        if (data.subtitle && data.subtitle.length > 255) errors.subtitle = 'Phụ đề không được quá 255 ký tự';

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

        const validationErrors = validateUpdateCompetition(formData);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            title: formData.title.trim(),
            subtitle: formData.subtitle?.trim() || undefined,
            policies: formData.policies?.trim() || undefined,
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
            durationMinutes: formData.durationMinutes ? Number(formData.durationMinutes) : undefined,
            maxAttempts: formData.maxAttempts ? Number(formData.maxAttempts) : undefined,
            visibility: formData.visibility,
            showResultDetail: formData.showResultDetail,
            allowLeaderboard: formData.allowLeaderboard,
            allowViewScore: formData.allowViewScore,
            allowViewAnswer: formData.allowViewAnswer,
            enableAntiCheating: formData.enableAntiCheating,
            allowViewSolutionYoutubeUrl: formData.allowViewSolutionYoutubeUrl,
            allowViewExamContent: formData.allowViewExamContent,
        };

        // Only include examId if competition doesn't have one (allow setting it for the first time)
        if (!competition?.examId && formData.examId) {
            payload.examId = Number(formData.examId);
        }

        try {
            await dispatch(updateCompetitionAsync({
                id: competitionId,
                data: payload
            })).unwrap();
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error updating competition:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">

                {loadingGet ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">Đang tải dữ liệu...</div>
                    </div>
                ) : (
                    <>
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

                        {/* Đề thi - Editable if null, Read-only if set */}
                        {!competition?.examId ? (
                            <ExamSearchSelect
                                label="Đề thi"
                                required
                                placeholder="Tìm và chọn đề thi..."
                                value={selectedExam}
                                onSelect={(exam) => {
                                    setSelectedExam(exam);
                                    setFormData(prev => ({ ...prev, examId: exam?.examId || '' }));
                                }}
                                visibility="PUBLISHED"
                                error={errors.examId}
                                tooltipText={`Chọn đề thi cho cuộc thi.
⚠️ Đề thi không thể thay đổi sau khi được gán.`}
                            />
                        ) : (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Đề thi
                                </label>
                                <div className="p-4 bg-gray-50 border border-gray-300 rounded-md">
                                    {competition?.exam ? (
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {competition.exam.title}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        {competition.exam.grade && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                Lớp {competition.exam.grade}
                                                            </span>
                                                        )}
                                                        {competition.exam.visibility && (
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${competition.exam.visibility === 'PUBLISHED'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : competition.exam.visibility === 'DRAFT'
                                                                        ? 'bg-gray-100 text-gray-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {competition.exam.visibility === 'PUBLISHED'
                                                                    ? 'Đã xuất bản'
                                                                    : competition.exam.visibility === 'DRAFT'
                                                                        ? 'Bản nháp'
                                                                        : competition.exam.visibility === 'PRIVATE'
                                                                            ? 'Riêng tư'
                                                                            : competition.exam.visibility}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-500">
                                                            ID: {competition.exam.examId}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Không có đề thi</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    ⚠️ Đề thi không thể thay đổi sau khi tạo cuộc thi
                                </p>
                            </div>
                        )}

                        {/* Thời gian */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Ngày bắt đầu"
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                error={errors.startDate}
                                tooltipText={`Thời điểm cuộc thi bắt đầu.
Học sinh chỉ có thể truy cập sau thời gian này.
Để trống nếu không giới hạn.`}
                            />

                            <Input
                                label="Ngày kết thúc"
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                error={errors.endDate}
                                tooltipText={`Thời điểm cuộc thi kết thúc.
Sau thời gian này học sinh không thể làm bài.
Để trống nếu không giới hạn.`}
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

                            <Checkbox
                                label="Cho phép xem video giải chi tiết"
                                checked={formData.allowViewSolutionYoutubeUrl}
                                onChange={(v) => handleCheckboxChange('allowViewSolutionYoutubeUrl', v)}
                                tooltipText="Học sinh được xem video hướng dẫn giải chi tiết trên YouTube."
                            />

                            <Checkbox
                                label="Cho phép xem nội dung đề thi trước"
                                checked={formData.allowViewExamContent}
                                onChange={(v) => handleCheckboxChange('allowViewExamContent', v)}
                                tooltipText="Học sinh có thể xem nội dung đề thi trước khi bắt đầu làm bài."
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={loadingUpdate || loadingGet}>
                    Hủy
                </Button>
                <Button type="submit" loading={loadingUpdate} disabled={loadingUpdate || loadingGet}>
                    Cập nhật
                </Button>
            </div>
        </form>
    );
};
