import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../../core/constants';

export const ExamImportSessionHeader = ({ session, loading }) => {
    const getStatusBadge = () => {
        if (!session) return null;

        const statusConfig = {
            pending: { label: 'Đang chờ', class: 'bg-yellow-100 text-yellow-800' },
            processing: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-800' },
            completed: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
            failed: { label: 'Thất bại', class: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[session.status] || { label: session.status, class: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
                {config.label}
            </span>
        );
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

                    {/* Right: Status */}
                    <div>
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
