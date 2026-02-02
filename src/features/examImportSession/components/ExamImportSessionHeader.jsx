import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../../../core/constants';
import { 
    migrateExamAsync, 
    selectExamImportSessionLoadingMigrate 
} from '../store/examImportSessionSlice';

export const ExamImportSessionHeader = ({ session, loading }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loadingMigrate = useSelector(selectExamImportSessionLoadingMigrate);
    const getStatusBadge = () => {
        if (!session) return null;

        const statusConfig = {
            PENDING: { label: 'Đang chờ', class: 'bg-yellow-100 text-yellow-800' },
            PROCESSING: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-800' },
            PARSED: { label: 'Đã phân tích', class: 'bg-indigo-100 text-indigo-800' },
            REVIEWING: { label: 'Đang xem xét', class: 'bg-purple-100 text-purple-800' },
            APPROVED: { label: 'Đã phê duyệt', class: 'bg-teal-100 text-teal-800' },
            MIGRATING: { label: 'Đang migrate', class: 'bg-blue-100 text-blue-800 animate-pulse' },
            COMPLETED: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
            REJECTED: { label: 'Từ chối', class: 'bg-red-100 text-red-800' },
            FAILED: { label: 'Thất bại', class: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[session.status] || { label: session.status, class: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const canMigrate = () => {
        if (!session) return false;
        // Có thể migrate khi status là APPROVED hoặc REVIEWING
        return true
    };

    const handleMigrate = async () => {
        if (!session?.sessionId) return;

        const result = await dispatch(migrateExamAsync(session.sessionId));
        
        if (result.meta.requestStatus === 'fulfilled') {
            const examId = result.payload.data.examId;
            // Navigate to exam detail page after successful migration
            // Uncomment and adjust route when exam detail page is available
            // navigate(ROUTES.EXAM_DETAIL(examId));
        }
    };

    return (
        <div className="bg-white border-b border-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Left: Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm">
                        <Link 
                            to={ROUTES.DASHBOARD}
                            className="text-foreground-light hover:text-foreground transition-colors"
                        >
                            <Home size={16} />
                        </Link>
                        
                        <ChevronRight size={16} className="text-foreground-light" />
                        
                        <Link 
                            to={ROUTES.EXAM_IMPORT_SESSIONS}
                            className="text-foreground-light hover:text-foreground transition-colors"
                        >
                            Phiên import đề thi
                        </Link>
                        
                        <ChevronRight size={16} className="text-foreground-light" />
                        
                        <span className="text-foreground font-medium">
                            {loading ? 'Đang tải...' : (session?.sessionId || 'Chi tiết')}
                        </span>
                    </div>

                    {/* Right: Actions & Status */}
                    <div className="flex items-center gap-3">
                        {/* Migrate Button */}
                        {canMigrate() && (
                            <button
                                onClick={handleMigrate}
                                disabled={loadingMigrate || loading}
                                className="inline-flex items-center gap-2 px-4 py-2.5 
                                         bg-gradient-to-r from-emerald-500 to-teal-600 
                                         text-white rounded-lg font-medium text-sm
                                         hover:from-emerald-600 hover:to-teal-700 
                                         active:scale-95
                                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-500 disabled:hover:to-teal-600
                                         transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <CheckCircle size={16} className={loadingMigrate ? 'animate-spin' : ''} />
                                {loadingMigrate ? 'Đang migrate...' : 'Migrate đề thi'}
                            </button>
                        )}

                        {/* Status Badge */}
                        {loading ? (
                            <div className="h-7 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                        ) : (
                            getStatusBadge()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
