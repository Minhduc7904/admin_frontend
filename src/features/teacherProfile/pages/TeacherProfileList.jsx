import { Plus } from 'lucide-react';
import { Button, ConfirmModal } from '../../../shared/components';
import { Pagination } from '../../../shared/components/ui';
import { TeacherProfileFilters, TeacherProfileTable } from '../components';

export const TeacherProfileList = ({
    teacherProfiles,
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
                        <h1 className="text-2xl font-bold text-foreground">Quản lý SEO profile giáo viên</h1>
                        <p className="mt-1 text-sm text-foreground-light">
                            Quản lý hồ sơ giáo viên, nội dung giảng dạy, liên hệ và cấu hình SEO.
                        </p>
                    </div>
                    <Button onClick={onCreate}>
                        <Plus size={16} />
                        Tạo hồ sơ
                    </Button>
                </div>

                <TeacherProfileFilters
                    search={search}
                    visibility={filters.visibility}
                    isFeatured={filters.isFeatured}
                    onSearchChange={onSearchChange}
                    onVisibilityChange={onVisibilityChange}
                    onFeaturedChange={onFeaturedChange}
                />
            </div>

            <div className="rounded-sm border border-border bg-white">
                <TeacherProfileTable
                    teacherProfiles={teacherProfiles}
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
                title="Xóa hồ sơ giáo viên"
                message={`Bạn có chắc chắn muốn xóa hồ sơ "${deleteTarget?.displayName}"? Thao tác này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={loadingDelete}
            />
        </>
    );
};
