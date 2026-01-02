import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const AdminDetailBreadcrumb = ({ adminName }) => {
    return (
        <div className="space-y-2">
            <nav className="flex items-center gap-2 text-sm text-foreground-light" aria-label="Breadcrumb">
                <Link to="/dashboard" className="hover:text-foreground transition-colors">Bảng điều khiển</Link>
                <ChevronRight className="w-4 h-4 text-border" />
                <Link to="/admins" className="hover:text-foreground transition-colors">Quản trị viên</Link>
                <ChevronRight className="w-4 h-4 text-border" />
                <span className="text-foreground font-semibold truncate" title={adminName || 'Chi tiết'}>
                    {adminName || 'Chi tiết'}
                </span>
            </nav>
            <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-info-bg text-info-text rounded-sm">
                    Hồ sơ quản trị viên
                </span>
                <p className="text-sm text-foreground-light">
                    Theo dõi thông tin, trạng thái và quyền hạn của quản trị viên trong hệ thống.
                </p>
            </div>
        </div>
    );
};
