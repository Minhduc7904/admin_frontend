import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Clock3, FileCheck2, Hash, Trophy } from 'lucide-react';
import { SearchableSelect } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils';
import { getStudentCompetitionAttemptsAsync } from '../../homeworkSubmit/store/homeworkSubmitSlice';

const formatDuration = (seconds) => {
    if (seconds == null) return 'Chưa có dữ liệu';
    if (seconds < 60) return `${seconds} giây`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds ? `${minutes} phút ${remainingSeconds} giây` : `${minutes} phút`;
};

/**
 * Chọn một lượt thi đã nộp của học sinh. Component tự tải dữ liệu theo studentId
 * và có thể dùng lại ở mọi luồng cần liên kết CompetitionSubmit.
 */
export const CompetitionAttemptSelect = ({
    studentId,
    value,
    onSelect,
    label = 'Lượt thi đã nộp',
    placeholder = 'Chọn lượt thi đã nộp...',
    error,
    required = false,
    disabled = false,
    className = '',
}) => {
    const dispatch = useDispatch();

    const fetchAttempts = useCallback(async () => {
        if (!studentId) return [];
        try {
            const result = await dispatch(getStudentCompetitionAttemptsAsync(studentId)).unwrap();
            return result.data?.competitionSubmits ?? [];
        } catch {
            return [];
        }
    }, [dispatch, studentId]);

    const searchAttempts = useCallback(async (keyword) => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        const attempts = await fetchAttempts();
        if (!normalizedKeyword) return attempts;
        return attempts.filter((attempt) => [
            attempt.competitionSubmitId,
            attempt.competitionId,
            attempt.attemptNumber,
        ].some((item) => String(item ?? '').includes(normalizedKeyword)));
    }, [fetchAttempts]);

    const renderAttempt = (attempt) => (
        <div className="min-w-0 space-y-2 py-0.5">
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 font-semibold text-foreground"><Hash className="h-3.5 w-3.5 text-info" />Lượt #{attempt.competitionSubmitId}</span>
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">Lần làm {attempt.attemptNumber ?? '-'}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">{attempt.status === 'SUBMITTED' ? 'Đã nộp' : attempt.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-3">
                <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-amber-600" />Cuộc thi #{attempt.competitionId}</span>
                <span className="flex items-center gap-1"><FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />{attempt.totalPoints ?? 0}/{attempt.maxPoints ?? 0} điểm</span>
                <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-sky-600" />{formatDuration(attempt.timeSpentSeconds)}</span>
                <span className="col-span-2 sm:col-span-1">Bắt đầu: {formatDateTime(attempt.startedAt)}</span>
                <span className="col-span-2">Nộp: {formatDateTime(attempt.submittedAt)}</span>
            </div>
        </div>
    );

    return (
        <SearchableSelect
            label={label}
            placeholder={studentId ? placeholder : 'Chọn học sinh trước'}
            value={value}
            onSelect={onSelect}
            searchFunction={searchAttempts}
            fetchDefaultItems={fetchAttempts}
            getOptionLabel={(attempt) => `Lượt #${attempt?.competitionSubmitId} · Lần ${attempt?.attemptNumber ?? '-'} · ${attempt?.totalPoints ?? 0}/${attempt?.maxPoints ?? 0} điểm`}
            getOptionValue={(attempt) => attempt?.competitionSubmitId}
            renderOption={renderAttempt}
            error={error}
            required={required}
            disabled={disabled || !studentId}
            className={className}
        />
    );
};
