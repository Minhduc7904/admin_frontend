import { useDispatch } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import {
    getAllClassSessionsAsync,
} from '../store/classSesssionSlice';

/**
 * ClassSessionSearchSelect
 * Component tìm kiếm & chọn buổi học
 * Dùng cho Attendance (Filter, Create)
 */
export const ClassSessionSearchSelect = ({
    label = 'Buổi học',
    placeholder = 'Tìm kiếm buổi học...',
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = '',
    classId, // Filter by class
}) => {
    const dispatch = useDispatch();

    /* ===================== SEARCH ===================== */
    const handleSearch = async (keyword) => {
        try {
            const params = {
                search: keyword,
                limit: 10,
            };
            
            if (classId) {
                params.classId = classId;
            }

            const result = await dispatch(
                getAllClassSessionsAsync(params)
            ).unwrap();

            return result.data;
        } catch (error) {
            console.error('Error searching class sessions:', error);
            return [];
        }
    };

    /* ===================== DEFAULT LIST ===================== */
    const fetchDefaultSessions = async () => {
        try {
            const params = {
                page: 1,
                limit: 10,
                sortBy: 'sessionDate',
                sortOrder: 'desc',
            };

            if (classId) {
                params.classId = classId;
            }

            const result = await dispatch(
                getAllClassSessionsAsync(params)
            ).unwrap();

            return result.data;
        } catch (error) {
            console.error('Error fetching default sessions:', error);
            return [];
        }
    };

    /* ===================== RENDER OPTION ===================== */
    const renderSessionOption = (session) => {
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        };

        const formatTime = (time) => {
            return new Date(time).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        return (
            <div className="flex flex-col">
                <span className="font-medium">
                    {session.name || `Buổi #${session.sessionId}`}
                </span>
                <span className="text-xs text-foreground-light">
                    {formatDate(session.sessionDate)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </span>
            </div>
        );
    };

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultSessions}
            onSelect={onSelect}
            getOptionLabel={(session) =>
                session?.name || `Buổi #${session?.sessionId}` || 'N/A'
            }
            getOptionValue={(session) => session?.sessionId}
            renderOption={renderSessionOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
        />
    );
};
