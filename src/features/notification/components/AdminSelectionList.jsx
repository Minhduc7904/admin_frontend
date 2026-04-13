import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input, Checkbox } from '../../../shared/components/ui'
import { Spinner } from '../../../shared/components/loading'
import { Pagination } from '../../../shared/components/ui/Pagination'

/* ======================================================
   SUB COMPONENTS (INTERNAL)
====================================================== */

const AdminListHeader = ({ selectedCount, total }) => (
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Danh sách quản trị viên</h3>
        <div className="text-sm text-foreground-light">
            {selectedCount}/{total} đã chọn
        </div>
    </div>
)

const AdminSearch = ({ value, onChange }) => (
    <div className="relative mb-4">
        <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light"
            size={18}
        />
        <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tìm kiếm quản trị viên..."
            className="pl-10"
        />
    </div>
)

const SelectAllBar = ({ isAllSelected, isSomeSelected, onToggle }) => (
    <div className="flex items-center gap-2 p-2 bg-surface-light rounded-sm">
        <Checkbox
            checked={isAllSelected}
            onChange={onToggle}
            label={isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        />
        {isSomeSelected && !isAllSelected && (
            <span className="text-xs text-foreground-light ml-auto">
                (Một số được chọn)
            </span>
        )}
    </div>
)

const AdminRow = ({ admin, isSelected, onToggle, isLast }) => {
    return (
        <div
            className={`
                px-4 py-2 transition-colors cursor-pointer
                flex items-center gap-3
                ${!isLast ? 'border-b border-border' : ''}
                ${isSelected ? 'bg-primary/5' : 'hover:bg-gray-50'}
            `}
            onClick={onToggle}
        >
            {/* Checkbox */}
            <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <Checkbox
                    checked={isSelected}
                    onChange={onToggle}
                />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
                {/* Line 1: Name + Status */}
                <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-foreground truncate">
                        {admin?.fullName || 'N/A'}
                    </span>

                    {admin?.isActive !== undefined && (
                        <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${
                            admin.isActive 
                                ? 'bg-success/10 text-success' 
                                : 'bg-error/10 text-error'
                        }`}>
                            {admin.isActive ? 'Hoạt động' : 'Vô hiệu'}
                        </span>
                    )}
                </div>

                {/* Line 2: Meta info (inline) */}
                <div className="text-xs text-foreground-light truncate">
                    {admin?.user?.username && <span>@{admin.user.username}</span>}

                    {admin?.user?.email && (
                        <span className="mx-1">•</span>
                    )}
                    {admin?.user?.email && (
                        <span>{admin.user.email}</span>
                    )}

                    {admin?.role?.name && (
                        <span className="mx-1">•</span>
                    )}
                    {admin?.role?.name && (
                        <span>{admin.role.name}</span>
                    )}
                </div>
            </div>
        </div>
    )
}


const AdminListContent = ({
    admins,
    filteredAdmins,
    selectedAdminIds,
    searchTerm,
    onToggleAdmin,
}) => {
    if (admins.length === 0) {
        return (
            <div className="p-8 text-center text-foreground-light">
                Chưa có quản trị viên nào
            </div>
        )
    }

    if (filteredAdmins.length === 0 && searchTerm) {
        return (
            <div className="p-8 text-center text-foreground-light">
                Không tìm thấy quản trị viên phù hợp
            </div>
        )
    }

    return (
        <div>
            {filteredAdmins.map((admin, index) => (
                <AdminRow
                    key={admin.adminId}
                    admin={admin}
                    isSelected={selectedAdminIds.includes(admin.adminId)}
                    onToggle={() => onToggleAdmin(admin.adminId)}
                    isLast={index === filteredAdmins.length - 1}
                />
            ))}
        </div>
    )
}

/* ======================================================
   MAIN COMPONENT
====================================================== */

export const AdminSelectionList = ({
    admins = [],
    selectedAdminIds = [],
    onSelectionChange,
    loading = false,
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const normalizeText = (value = '') =>
        String(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase()
            .trim()

    const normalizeCompact = (value = '') => normalizeText(value).replace(/\s+/g, '')

    const filteredAdmins = useMemo(() => {
        if (!searchTerm.trim()) return admins
        const normalizedTerm = normalizeText(searchTerm)
        const compactTerm = normalizeCompact(searchTerm)

        return admins.filter((admin) => {
            const fullName = admin?.fullName || ''
            const normalizedFullName = normalizeText(fullName)
            const compactFullName = normalizeCompact(fullName)

            const username = normalizeText(admin?.user?.username || '')
            const email = normalizeText(admin?.user?.email || '')
            const roleName = normalizeText(admin?.role?.name || '')

            return (
                normalizedFullName.includes(normalizedTerm) ||
                compactFullName.includes(compactTerm) ||
                username.includes(normalizedTerm) ||
                email.includes(normalizedTerm) ||
                roleName.includes(normalizedTerm)
            )
        })
    }, [admins, searchTerm])

    const totalPages = useMemo(() => {
        if (filteredAdmins.length === 0) return 1
        return Math.ceil(filteredAdmins.length / itemsPerPage)
    }, [filteredAdmins.length, itemsPerPage])

    const safeCurrentPage = useMemo(() => {
        return Math.min(currentPage, totalPages)
    }, [currentPage, totalPages])

    const paginatedAdmins = useMemo(() => {
        const start = (safeCurrentPage - 1) * itemsPerPage
        const end = start + itemsPerPage
        return filteredAdmins.slice(start, end)
    }, [filteredAdmins, safeCurrentPage, itemsPerPage])

    const isAllSelected = useMemo(() => {
        if (filteredAdmins.length === 0) return false
        return filteredAdmins.every((admin) =>
            selectedAdminIds.includes(admin.adminId)
        )
    }, [filteredAdmins, selectedAdminIds])

    const isSomeSelected = useMemo(() => {
        if (filteredAdmins.length === 0) return false
        return !isAllSelected && filteredAdmins.some((admin) =>
            selectedAdminIds.includes(admin.adminId)
        )
    }, [filteredAdmins, selectedAdminIds, isAllSelected])

    const handleToggleAll = () => {
        const filteredIds = filteredAdmins.map((admin) => admin.adminId)

        if (isAllSelected) {
            onSelectionChange(
                selectedAdminIds.filter((id) => !filteredIds.includes(id))
            )
        } else {
            onSelectionChange([...new Set([...selectedAdminIds, ...filteredIds])])
        }
    }

    const handleToggleAdmin = (adminId) => {
        onSelectionChange(
            selectedAdminIds.includes(adminId)
                ? selectedAdminIds.filter((id) => id !== adminId)
                : [...selectedAdminIds, adminId]
        )
    }

    if (loading) {
        return (
            <div className="bg-white border border-border rounded-sm p-6">
                <div className="flex items-center justify-center h-64">
                    <Spinner size="lg" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-border rounded-sm">
            <div className="p-4 border-b border-border">
                <AdminListHeader
                    selectedCount={selectedAdminIds.length}
                    total={admins.length}
                />

                <AdminSearch
                    value={searchTerm}
                    onChange={(value) => {
                        setSearchTerm(value)
                        setCurrentPage(1)
                    }}
                />

                {filteredAdmins.length > 0 && (
                    <SelectAllBar
                        isAllSelected={isAllSelected}
                        isSomeSelected={isSomeSelected}
                        onToggle={handleToggleAll}
                    />
                )}
            </div>

            <div className="max-h-[600px] overflow-y-auto">
                <AdminListContent
                    admins={admins}
                    filteredAdmins={paginatedAdmins}
                    selectedAdminIds={selectedAdminIds}
                    searchTerm={searchTerm}
                    onToggleAdmin={handleToggleAdmin}
                />
            </div>

            {filteredAdmins.length > 0 && (
                <Pagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                    }}
                    totalItems={filteredAdmins.length}
                />
            )}
        </div>
    )
}
