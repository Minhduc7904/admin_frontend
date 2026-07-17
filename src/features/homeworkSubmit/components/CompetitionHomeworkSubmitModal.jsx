import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClipboardPlus, Sparkles } from 'lucide-react';
import { Button, Checkbox, Dropdown, Input, Modal, Textarea } from '../../../shared/components';
import { StudentSearchSelect } from '../../student/components/StudentSearchSelect';
import { CompetitionAttemptSelect } from '../../competitionSubmit/components/CompetitionAttemptSelect';
import {
    createHomeworkSubmitFromCompetitionAsync,
    selectHomeworkSubmitLoadingCreateFromCompetition,
    selectHomeworkSubmitLoadingUpdateCompetitionSubmit,
    updateHomeworkSubmitCompetitionAsync,
} from '../store/homeworkSubmitSlice';

const SELECTION_OPTIONS = [
    { value: 'LATEST', label: 'Lượt nộp mới nhất' },
    { value: 'OLDEST', label: 'Lượt nộp sớm nhất' },
    { value: 'HIGHEST_SCORE', label: 'Lượt có điểm cao nhất' },
    { value: 'SPECIFIC', label: 'Chọn một lượt nộp cụ thể' },
];

const studentLabel = (student) => student?.fullName || student?.user?.fullName || `Học sinh #${student?.studentId}`;

export const CompetitionHomeworkSubmitModal = ({ isOpen, onClose, homework, existingSubmit, onSuccess }) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectHomeworkSubmitLoadingCreateFromCompetition);
    const loadingUpdate = useSelector(selectHomeworkSubmitLoadingUpdateCompetitionSubmit);
    const isEditingExisting = Boolean(existingSubmit?.homeworkSubmitId);
    const initialStudent = isEditingExisting
        ? (existingSubmit.student ?? { studentId: existingSubmit.studentId, fullName: `Học sinh #${existingSubmit.studentId}` })
        : null;
    const [student, setStudent] = useState(initialStudent);
    const [selection, setSelection] = useState(isEditingExisting && existingSubmit.competitionSubmitId ? 'SPECIFIC' : 'LATEST');
    const [competitionSubmitId, setCompetitionSubmitId] = useState(isEditingExisting ? String(existingSubmit.competitionSubmitId ?? '') : '');
    const [autoFeedback, setAutoFeedback] = useState(false);
    const [manualFeedback, setManualFeedback] = useState(isEditingExisting ? existingSubmit.feedback ?? '' : '');
    const [errors, setErrors] = useState({});

    const handleStudentChange = (selectedStudent) => {
        setStudent(selectedStudent);
        setCompetitionSubmitId('');
        setErrors({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = {};
        const selectedAttemptId = Number(competitionSubmitId);
        if (!isEditingExisting && !student?.studentId) nextErrors.student = 'Vui lòng chọn học sinh.';
        if (selection === 'SPECIFIC' && (!Number.isInteger(selectedAttemptId) || selectedAttemptId <= 0)) {
            nextErrors.competitionSubmitId = 'Vui lòng chọn hoặc nhập mã lượt thi hợp lệ.';
        }
        if (!autoFeedback && !manualFeedback.trim()) nextErrors.manualFeedback = 'Vui lòng nhập nhận xét, hoặc bật nhận xét AI tự động.';
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        const data = {
            selection,
            autoFeedback,
            ...(selection === 'SPECIFIC' ? { competitionSubmitId: selectedAttemptId } : {}),
            ...(!autoFeedback ? { manualFeedback: manualFeedback.trim() } : {}),
        };

        try {
            if (isEditingExisting) {
                await dispatch(updateHomeworkSubmitCompetitionAsync({ id: existingSubmit.homeworkSubmitId, data })).unwrap();
            } else {
                await dispatch(createHomeworkSubmitFromCompetitionAsync({
                    ...data,
                    homeworkContentId: homework.homeworkContentId,
                    studentId: student.studentId,
                })).unwrap();
            }
            onSuccess?.();
            onClose();
        } catch {
            // Toast notification from the thunk provides the backend validation message.
        }
    };

    const loading = loadingCreate || loadingUpdate;
    const title = isEditingExisting ? 'Đổi lượt thi Competition' : 'Tạo bài nộp từ Competition';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-sm text-amber-900">
                    <div className="flex items-center gap-2 font-semibold"><ClipboardPlus className="h-4 w-4" /> Lấy kết quả từ lượt thi đã nộp</div>
                    <p className="mt-1 text-xs leading-5">Chỉ hiển thị lượt thi có trạng thái đã nộp. Mỗi lượt thi chỉ được liên kết với một bài nộp bài tập.</p>
                </div>

                <StudentSearchSelect
                    label="Học sinh"
                    required
                    value={student}
                    onSelect={handleStudentChange}
                    error={errors.student}
                    disabled={isEditingExisting}
                />
                {isEditingExisting && <p className="-mt-3 text-xs text-muted-foreground">Đang đổi lượt thi cho {studentLabel(student)}. Không thể thay đổi học sinh của bài nộp hiện có.</p>}

                <Dropdown
                    label="Cách chọn lượt thi"
                    value={selection}
                    onChange={(value) => {
                        setSelection(value);
                        setErrors((current) => ({ ...current, competitionSubmitId: undefined }));
                    }}
                    options={SELECTION_OPTIONS}
                />

                {selection === 'SPECIFIC' && (
                    <div className="space-y-3 rounded-xl border border-border bg-gray-50/60 p-3">
                        <CompetitionAttemptSelect
                            label="Chọn từ danh sách lượt thi"
                            studentId={student?.studentId}
                            value={Number(competitionSubmitId) || undefined}
                            onSelect={(attempt) => setCompetitionSubmitId(String(attempt.competitionSubmitId))}
                            error={errors.competitionSubmitId}
                            required
                        />
                        <Input
                            label="Hoặc nhập mã lượt thi"
                            type="number"
                            min="1"
                            value={competitionSubmitId}
                            onChange={(event) => setCompetitionSubmitId(event.target.value)}
                            error={errors.competitionSubmitId}
                            helperText="Mã phải thuộc học sinh đang chọn và có trạng thái Đã nộp."
                        />
                    </div>
                )}

                <Checkbox
                    label="Tạo lại nhận xét tự động bằng AI"
                    checked={autoFeedback}
                    onChange={setAutoFeedback}
                />
                {autoFeedback ? (
                    <div className="flex items-start gap-2 rounded-lg border border-info/20 bg-info/5 p-3 text-xs text-info-dark"><Sparkles className="mt-0.5 h-4 w-4 shrink-0" /> Hệ thống sẽ tạo lại nhận xét dựa trên kết quả của lượt thi.</div>
                ) : (
                    <Textarea
                        label="Nhận xét"
                        required
                        rows={4}
                        value={manualFeedback}
                        onChange={(event) => setManualFeedback(event.target.value)}
                        error={errors.manualFeedback}
                        placeholder="Nhập nhận xét để học sinh xem lại..."
                    />
                )}

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
                    <Button type="submit" loading={loading} disabled={loading}>{isEditingExisting ? 'Cập nhật lượt thi' : 'Tạo bài nộp'}</Button>
                </div>
            </form>
        </Modal>
    );
};
