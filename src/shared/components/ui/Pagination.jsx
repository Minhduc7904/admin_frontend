import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dropdown } from './Dropdown';

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
    disabled = false
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-light">Hiển thị</span>
                <Dropdown
                    value={itemsPerPage}
                    onChange={(value) => onItemsPerPageChange(value)}
                    options={[
                        { value: 10, label: '10' },
                        { value: 20, label: '20' },
                        { value: 50, label: '50' },
                        { value: 100, label: '100' }
                    ]}
                    disabled={disabled}
                    dropUp={true}
                    className="w-20"
                />
                <span className="text-sm text-foreground-light">
                    {startItem}-{endItem} của {totalItems}
                </span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={disabled || currentPage === 1}
                    className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-foreground-light">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            disabled={disabled}
                            className={`px-3 py-1 text-sm rounded-sm transition-colors ${currentPage === page
                                    ? 'bg-foreground text-white font-medium'
                                    : 'hover:bg-gray-100 text-foreground-light'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={disabled || currentPage === totalPages}
                    className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
