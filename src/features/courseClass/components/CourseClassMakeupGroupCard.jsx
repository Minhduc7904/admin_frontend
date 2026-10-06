// 1. Imports
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertTriangle, Calendar, Clock, MapPin, RotateCcw, Save, User, X } from 'lucide-react';
import {
    clearMakeupGroup,
    getCourseClassMakeupGroupAsync,
    resetMakeupSelection,
    selectIsMakeupDirty,
    selectLoadingGetMakeupGroup,
    selectLoadingUpdateMakeupGroup,
    selectMakeupCandidates,
    selectMakeupError,
    selectMakeupGroupId,
    selectMakeupSourceClassId,
    selectSelectedMakeupClassIds,
    toggleMakeupClass,
    updateCourseClassMakeupGroupAsync,
} from '../store/courseClassSlice';
import { filterMakeupCandidates, formatMakeupDateRange } from '../utils/makeupGroup';
import { Badge, Button, Checkbox, ConfirmModal, SearchInput } from '../../../shared/components/ui';
import { SkeletonCard } from '../../../shared/components/loading';
import { useHasPermission, useUnsavedChangesGuard } from '../../../shared/hooks';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';

const CandidateMeta = ({ icon, children }) => (
    <span className="inline-flex items-center gap-1 text-xs text-foreground-light">
        {icon}
        {children}
    </span>
);

const META_ICON_CLASS = 'w-3 h-3 shrink-0';

const CandidateRow = ({ candidate, checked, readOnly, onToggle }) => {
    // Lớp chưa chọn mà bị disable thì không được thêm; lớp đã chọn luôn bỏ chọn được.
    const blocked = candidate.disabled && !checked;
    const inputId = `makeup-class-${candidate.classId}`;
    const dateRange = formatMakeupDateRange(candidate.startDate, candidate.endDate);

    return (
        <li
            className={`flex items-start gap-3 px-4 py-3 ${blocked ? 'bg-gray-50' : ''}`}
            data-testid={`makeup-candidate-${candidate.classId}`}
        >
            <Checkbox
                id={inputId}
                checked={checked}
                onChange={() => onToggle(candidate.classId)}
                disabled={readOnly || blocked}
                className="pt-0.5"
            />
            <label
                htmlFor={inputId}
                className={`flex-1 min-w-0 space-y-1 ${readOnly || blocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-medium ${blocked ? 'text-foreground-light' : 'text-foreground'}`}>
                        {candidate.className}
                    </span>
                    {candidate.isExpired && (
                        <Badge variant="default" size="small">
                            Đã kết thúc
                        </Badge>
                    )}
                </span>
                <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <CandidateMeta icon={<Clock className={META_ICON_CLASS} />}>
                        {candidate.weeklySchedule || 'Chưa có lịch tuần'}
                    </CandidateMeta>
                    <CandidateMeta icon={<MapPin className={META_ICON_CLASS} />}>
                        {candidate.room || 'Chưa có phòng'}
                    </CandidateMeta>
                    <CandidateMeta icon={<User className={META_ICON_CLASS} />}>
                        {candidate.instructorName || 'Chưa phân công'}
                    </CandidateMeta>
                    {dateRange && (
                        <CandidateMeta icon={<Calendar className={META_ICON_CLASS} />}>{dateRange}</CandidateMeta>
                    )}
                </span>
                {candidate.disabledReason && (
                    <span className="flex items-center gap-1 text-xs text-warning-text">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        {candidate.disabledReason}
                    </span>
                )}
            </label>
        </li>
    );
};

// 2. Component
export const CourseClassMakeupGroupCard = ({ classId }) => {
    const dispatch = useDispatch();
    const canUpdate = useHasPermission(PERMISSIONS.COURSE_CLASS.UPDATE);

    const sourceClassId = useSelector(selectMakeupSourceClassId);
    const groupId = useSelector(selectMakeupGroupId);
    const loading = useSelector(selectLoadingGetMakeupGroup);
    const saving = useSelector(selectLoadingUpdateMakeupGroup);
    const candidates = useSelector(selectMakeupCandidates);
    const selectedIds = useSelector(selectSelectedMakeupClassIds);
    const error = useSelector(selectMakeupError);
    const isDirty = useSelector(selectIsMakeupDirty);

    const [keyword, setKeyword] = useState('');
    const { isPrompting, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

    const readOnly = !canUpdate;
    // Dữ liệu trong store thuộc lớp khác (vừa đổi lớp) thì coi như chưa tải.
    const isCurrentClassLoaded = sourceClassId === classId;

    useEffect(() => {
        dispatch(getCourseClassMakeupGroupAsync(classId));

        return () => {
            dispatch(clearMakeupGroup());
        };
    }, [dispatch, classId]);

    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const selectedCandidates = useMemo(
        () => candidates.filter((candidate) => selectedIdSet.has(candidate.classId)),
        [candidates, selectedIdSet]
    );
    const visibleCandidates = useMemo(
        () => filterMakeupCandidates(candidates, keyword),
        [candidates, keyword]
    );

    const handleToggle = (id) => dispatch(toggleMakeupClass(id));
    const handleReload = () => dispatch(getCourseClassMakeupGroupAsync(classId));
    const handleReset = () => dispatch(resetMakeupSelection());
    const handleSave = () =>
        dispatch(updateCourseClassMakeupGroupAsync({ classId, makeupClassIds: selectedIds }));

    const showSkeleton = loading || !isCurrentClassLoaded;
    const loadFailed = !showSkeleton && error && candidates.length === 0;

    const renderBody = () => {
        if (showSkeleton) {
            return <SkeletonCard count={1} className="rounded-sm" />;
        }

        if (loadFailed) {
            return (
                <div className="flex flex-col items-center gap-3 rounded-sm bg-error-bg p-4 text-center">
                    <p className="text-sm text-error-text">{error}</p>
                    <Button variant="outline" size="sm" onClick={handleReload}>
                        <RotateCcw className="w-4 h-4" />
                        Thử lại
                    </Button>
                </div>
            );
        }

        if (candidates.length === 0) {
            return (
                <p className="py-6 text-center text-sm text-foreground-light">
                    Khóa học này chưa có lớp nào khác để lập nhóm học bù.
                </p>
            );
        }

        return (
            <>
                <SearchInput
                    value={keyword}
                    onChange={setKeyword}
                    placeholder="Tìm theo tên lớp..."
                />

                {selectedCandidates.length > 0 && (
                    <div className="flex flex-wrap gap-2" aria-label="Các lớp cùng nhóm học bù">
                        {selectedCandidates.map((candidate) => (
                            <span
                                key={candidate.classId}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                            >
                                {candidate.className}
                                {candidate.isExpired && <span className="text-blue-500">(đã kết thúc)</span>}
                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(candidate.classId)}
                                        disabled={saving}
                                        aria-label={`Bỏ chọn ${candidate.className}`}
                                        className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-100 disabled:opacity-50"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                )}

                {visibleCandidates.length === 0 ? (
                    <p className="py-6 text-center text-sm text-foreground-light">
                        Không có lớp nào khớp với "{keyword}".
                    </p>
                ) : (
                    <ul className="max-h-96 divide-y divide-border overflow-y-auto rounded-sm border border-border">
                        {visibleCandidates.map((candidate) => (
                            <CandidateRow
                                key={candidate.classId}
                                candidate={candidate}
                                checked={selectedIdSet.has(candidate.classId)}
                                readOnly={readOnly || saving}
                                onToggle={handleToggle}
                            />
                        ))}
                    </ul>
                )}

                {error && (
                    <p role="alert" className="rounded-sm bg-error-bg px-3 py-2 text-sm text-error-text">
                        {error}
                    </p>
                )}
            </>
        );
    };

    return (
        <>
            <div className="bg-white border border-border rounded-sm" data-testid="makeup-group-card">
                <div className="flex flex-col gap-2 px-4 py-3 border-b border-border sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Nhóm lớp học bù</h3>
                        <p className="mt-0.5 text-xs text-foreground-light">
                            Các lớp trong nhóm có thể học bù cho nhau. Thay đổi áp dụng cho cả nhóm.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {groupId !== null && !isDirty && (
                            <Badge variant="info" size="small">
                                {selectedIds.length + 1} lớp trong nhóm
                            </Badge>
                        )}
                        {isDirty && <Badge variant="warning" size="small">Chưa lưu</Badge>}
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {readOnly && !showSkeleton && (
                        <p className="rounded-sm bg-gray-50 px-3 py-2 text-xs text-foreground-light">
                            Bạn chỉ có quyền xem nhóm lớp học bù.
                        </p>
                    )}
                    {renderBody()}
                </div>

                {!readOnly && !showSkeleton && !loadFailed && candidates.length > 0 && (
                    <div className="flex flex-col-reverse gap-2 border-t border-border bg-gray-50 px-4 py-3 sm:flex-row sm:justify-end">
                        <Button variant="outline" onClick={handleReset} disabled={!isDirty || saving}>
                            <RotateCcw className="w-4 h-4" />
                            Hoàn tác
                        </Button>
                        <Button onClick={handleSave} loading={saving} disabled={!isDirty}>
                            <Save className="w-4 h-4" />
                            Lưu nhóm học bù
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isPrompting}
                onClose={cancelLeave}
                onConfirm={confirmLeave}
                title="Rời trang khi chưa lưu?"
                message="Nhóm lớp học bù có thay đổi chưa lưu. Nếu rời trang, các thay đổi này sẽ bị mất."
                confirmText="Rời trang"
                cancelText="Ở lại"
                variant="warning"
            />
        </>
    );
};
