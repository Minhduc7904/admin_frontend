import { useDispatch } from 'react-redux';
import { SearchableMultiSelect } from '../../../shared/components/ui';
import { searchClassSessionsAsync } from '../store/classSesssionSlice';
import { formatDate, formatTime } from '../../../shared/utils';
/**
 * ClassSessionSearchMultiSelect
 * Wrapper component for searching & selecting MULTIPLE class sessions
 */
export const ClassSessionSearchMultiSelect = ({
    label = 'Buổi học',
    placeholder = 'Tìm kiếm buổi học...',
    value = [],                     // array<ClassSession>
    onChange,                       // (sessions[]) => void
    error,
    required = false,
    disabled = false,
    className = '',
    classIds = [],                  // 🔥 filter theo courseClassIds
}) => {
    const dispatch = useDispatch();

    /* ===================== SEARCH ===================== */
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(
                searchClassSessionsAsync({
                    search: keyword,
                    classIds: classIds.length ? classIds : undefined,
                })
            ).unwrap();

            return result.data || [];
        } catch (error) {
            console.error('Error searching class sessions:', error);
            return [];
        }
    };

    /* ===================== DEFAULT ===================== */
    const fetchDefaultSessions = async () => {
        try {
            const result = await dispatch(
                searchClassSessionsAsync({
                    classIds: classIds.length ? classIds : undefined,
                })
            ).unwrap();

            return result.data || [];
        } catch (error) {
            console.error('Error fetching class sessions:', error);
            return [];
        }
    };

    /* ===================== RENDER OPTION ===================== */
    const renderSessionOption = (session) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">
                    {session.name ||
                        `Buổi ${new Date(session.sessionDate).toLocaleDateString('vi-VN')}`}
                </span>

                <div className="flex items-center gap-2 text-xs text-foreground-light">
                    {session.courseClass?.className && (
                        <span>{session.courseClass.className}</span>
                    )}

                    {session.sessionDate && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                            {formatDate(session.sessionDate)}
                        </span>
                    )}

                    {session.startTime && session.endTime && (
                        <span>
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    /* ===================== RENDER ===================== */
    return (
        <SearchableMultiSelect
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultSessions}
            getOptionLabel={(s) =>
                s?.name ||
                `Buổi ${new Date(s.sessionDate).toLocaleDateString('vi-VN')}`
            }
            getOptionValue={(s) => s?.sessionId}
            renderOption={renderSessionOption}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
        />
    );
};
