// 1. Imports
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react';
import { courseClassApi } from '../../../core/api';
import { ROUTES } from '../../../core/constants';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';
import { Button } from '../../../shared/components/ui';
import { useHasPermission } from '../../../shared/hooks/permissions';
import { formatTimeRange } from '../../../shared/utils/dateTime';
import {
    formatSessionDay,
    formatWeekRange,
    getWeekStart,
    normalizeMakeupSessions,
    shiftWeek,
} from '../utils/makeupSessions';

const SessionLabel = ({ session, showClass = false }) => (
    <span className="block text-sm text-foreground">
        {showClass && <span className="font-medium">{session.className} · </span>}
        {formatSessionDay(session.sessionDate)} · {formatTimeRange(session.startTime, session.endTime)}
    </span>
);

// 2. Component
/**
 * Bảng nổi các buổi học có thể học bù cho nhau trong một tuần: buổi của lớp này và buổi của các lớp cùng nhóm học bù.
 * Gọi API trực tiếp, không dùng slice chung (state buổi học và nhóm học bù là state toàn cục của trang khác).
 */
export const CourseClassMakeupSessionsPanel = ({ classId }) => {
    const canReadClass = useHasPermission(PERMISSIONS.COURSE_CLASS.GET_BY_ID);
    const canReadSessions = useHasPermission(PERMISSIONS.CLASS_SESSION.GET_ALL);
    const canView = canReadClass && canReadSessions;

    const [open, setOpen] = useState(false);
    const [weekStart, setWeekStart] = useState(() => getWeekStart());
    const [reloadKey, setReloadKey] = useState(0);
    // Kết quả gắn với khóa request đã sinh ra nó: khóa khác khóa hiện tại nghĩa là đang tải (hoặc dữ liệu cũ của tuần/lớp khác).
    const [result, setResult] = useState({ key: null, data: null, error: null });

    const requestKey = `${classId}|${weekStart}|${reloadKey}`;
    const current = result.key === requestKey ? result : null;
    const loading = open && canView && !current;
    const data = current?.data ?? null;
    const error = current?.error ?? null;

    useEffect(() => {
        if (!open || !canView || !classId) {
            return undefined;
        }

        // Bỏ qua kết quả của request cũ khi đổi tuần/đổi lớp trước khi nó trả về.
        let ignore = false;

        courseClassApi
            .getMakeupSessions(classId, { weekStart })
            .then((response) => {
                if (!ignore) {
                    setResult({ key: requestKey, data: normalizeMakeupSessions(response?.data?.data), error: null });
                }
            })
            .catch((requestError) => {
                if (!ignore) {
                    setResult({
                        key: requestKey,
                        data: null,
                        error: requestError?.response?.data?.message || 'Không thể tải các buổi học bù trong tuần',
                    });
                }
            });

        return () => {
            ignore = true;
        };
    }, [open, canView, classId, weekStart, requestKey]);

    const handleReload = useCallback(() => setReloadKey((key) => key + 1), []);

    if (!canView) {
        return null;
    }

    const renderBody = () => {
        if (loading) {
            return <p className="py-6 text-center text-sm text-foreground-light">Đang tải...</p>;
        }

        if (error) {
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

        if (!data) {
            return null;
        }

        if (data.groupId === null) {
            return (
                <p className="py-6 text-center text-sm text-foreground-light">
                    Lớp này chưa thuộc nhóm học bù nào. Thiết lập nhóm ở{' '}
                    <Link to={ROUTES.CLASS_DETAIL(classId)} className="text-primary underline">
                        trang chi tiết lớp
                    </Link>
                    .
                </p>
            );
        }

        if (data.sessions.length === 0) {
            return (
                <p className="py-6 text-center text-sm text-foreground-light">
                    Lớp này không có buổi học nào trong tuần này.
                </p>
            );
        }

        return (
            <table className="w-full text-left" data-testid="makeup-sessions-table">
                <thead>
                    <tr className="border-b border-border text-xs uppercase text-foreground-light">
                        <th className="py-2 pr-3 font-medium">Buổi của lớp này</th>
                        <th className="py-2 font-medium">Có thể học bù tại</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.sessions.map((session) => (
                        <tr key={session.sessionId} className="align-top">
                            <td className="py-3 pr-3">
                                <span className="block text-sm font-medium text-foreground">{session.name}</span>
                                <SessionLabel session={session} />
                            </td>
                            <td className="py-3">
                                {session.makeupCandidates.length === 0 ? (
                                    <span className="text-sm text-foreground-light">
                                        Chưa có buổi của lớp cùng nhóm trong tuần này
                                    </span>
                                ) : (
                                    <ul className="space-y-1">
                                        {session.makeupCandidates.map((candidate) => (
                                            <li key={candidate.sessionId}>
                                                <SessionLabel session={candidate} showClass />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg hover:opacity-90"
                aria-expanded={open}
                aria-controls="makeup-sessions-panel"
            >
                <CalendarClock className="w-4 h-4" />
                Buổi học bù trong tuần
            </button>

            {open && (
                <section
                    id="makeup-sessions-panel"
                    role="dialog"
                    aria-label="Buổi học bù trong tuần"
                    data-testid="makeup-sessions-panel"
                    className="fixed bottom-16 right-4 z-30 flex max-h-[70vh] w-[min(92vw,640px)] flex-col rounded-sm border border-border bg-white shadow-xl"
                >
                    <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Buổi học bù trong tuần</h3>
                            <p className="mt-0.5 text-xs text-foreground-light">
                                Các buổi của lớp cùng nhóm học bù nằm trong cùng tuần với buổi của lớp này.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Đóng bảng buổi học bù"
                            className="rounded-sm p-1 hover:bg-gray-100"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setWeekStart((current) => shiftWeek(current, -1))}
                                aria-label="Tuần trước"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="min-w-36 text-center text-sm font-medium" data-testid="makeup-week-range">
                                {formatWeekRange(weekStart)}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setWeekStart((current) => shiftWeek(current, 1))}
                                aria-label="Tuần sau"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setWeekStart(getWeekStart())}>
                            Tuần này
                        </Button>
                    </div>

                    <div className="overflow-y-auto px-4 py-2">{renderBody()}</div>
                </section>
            )}
        </>
    );
};
