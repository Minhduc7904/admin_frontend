import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    showInfo?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage = 10,
    onPageChange,
    showInfo = true,
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between px-3 py-3 border-t border-gray-200">
            {showInfo && (
                <p className="text-xs text-gray-600">
                    Hiển thị <span className="font-semibold">{startItem}-{endItem}</span> trong tổng số{' '}
                    <span className="font-semibold">{totalItems}</span>
                </p>
            )}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                            currentPage === page
                                ? 'bg-black text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};
