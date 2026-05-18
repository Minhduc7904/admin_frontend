import { Plus } from 'lucide-react';
import { Button, ConfirmModal } from '../../../shared/components';
import { Pagination } from '../../../shared/components/ui';
import { DocumentFilters, DocumentTable } from '../components';

export const DocumentList = ({
    documents,
    loading,
    pagination,
    filters,
    search,
    onCreate,
    onView,
    onDelete,
    onSearchChange,
    onVisibilityChange,
    onFeaturedChange,
    onTagIdChange,
    onPageChange,
    onItemsPerPageChange,
    deleteTarget,
    onCloseDeleteModal,
    onConfirmDelete,
    loadingDelete,
}) => {
    return (
        <>
            <div className="mb-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý tài liệu</h1>
                        <p className="mt-1 text-sm text-foreground-light">
                            Quản lý kho tài liệu PDF, nội dung OCR, thumbnail và SEO.
                        </p>
                    </div>
                    <Button onClick={onCreate}>
                        <Plus size={16} />
                        Tạo tài liệu
                    </Button>
                </div>

                <DocumentFilters
                    search={search}
                    visibility={filters.visibility}
                    isFeatured={filters.isFeatured}
                    tagId={filters.tagId}
                    onSearchChange={onSearchChange}
                    onVisibilityChange={onVisibilityChange}
                    onFeaturedChange={onFeaturedChange}
                    onTagIdChange={onTagIdChange}
                />
            </div>

            <div className="rounded-sm border border-border bg-white">
                <DocumentTable
                    documents={documents}
                    loading={loading}
                    onView={onView}
                    onDelete={onDelete}
                />
                <div className="border-t border-border p-4">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                        itemsPerPage={pagination.limit}
                        onPageChange={onPageChange}
                        onItemsPerPageChange={onItemsPerPageChange}
                    />
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={onCloseDeleteModal}
                onConfirm={onConfirmDelete}
                title="Xóa tài liệu"
                message={`Bạn có chắc chắn muốn xóa tài liệu "${deleteTarget?.title}"? Thao tác này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={loadingDelete}
            />
        </>
    );
};
