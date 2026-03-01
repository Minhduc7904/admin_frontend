import { useState } from 'react'
import { RefreshCcw, Wallet, Tag, CalendarDays } from 'lucide-react'

import { Pagination, Button, Checkbox } from '../../../../../shared/components/ui'
import { paginate } from '../utils/constants'
import { Section, StudentInfoCell } from './CommonComponents'

export const ExistingPaymentsTable = ({ data, onUpdate, loading = false }) => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [isSelecting, setIsSelecting] = useState(false)
    const [selectedItems, setSelectedItems] = useState(new Set())

    if (!data || !data.length) return null

    const { items, totalPages, totalItems } = paginate(data, page, limit)

    const handleSelectAll = () => {
        if (selectedItems.size === data.length) {
            setSelectedItems(new Set())
        } else {
            setSelectedItems(new Set(data.map(item => item.rowNumber)))
        }
    }

    const handleSelectItem = (rowNumber) => {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(rowNumber)) {
            newSelected.delete(rowNumber)
        } else {
            newSelected.add(rowNumber)
        }
        setSelectedItems(newSelected)
    }

    const handleUpdate = () => {
        const selectedData = data.filter(item => selectedItems.has(item.rowNumber))
        onUpdate?.(selectedData)
        // Reset after update
        setSelectedItems(new Set())
        setIsSelecting(false)
    }

    const allSelected = data.length > 0 && selectedItems.size === data.length
    const someSelected = selectedItems.size > 0 && selectedItems.size < data.length

    return (
        <Section
            title={`Khoản thu cần cập nhật (${data.length})`}
            icon={RefreshCcw}
            actions={
                <div className="flex items-center gap-2">
                    {isSelecting && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleSelectAll}
                            >
                                {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleUpdate}
                                disabled={selectedItems.size === 0}
                                loading={loading}
                            >
                                <RefreshCcw size={16} />
                                Cập nhật ({selectedItems.size})
                            </Button>
                        </>
                    )}
                    <Button
                        size="sm"
                        variant={isSelecting ? "outline" : "default"}
                        onClick={() => {
                            setIsSelecting(!isSelecting)
                            if (isSelecting) {
                                setSelectedItems(new Set())
                            }
                        }}
                    >
                        {isSelecting ? 'Huỷ' : 'Chọn'}
                    </Button>
                </div>
            }
        >
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left">
                        {isSelecting && (
                            <th className="w-12">
                                <Checkbox
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        <th>Row</th>
                        <th>Học sinh</th>
                        <th>OLD</th>
                        <th>NEW</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map(row => (
                        <tr 
                            key={row.rowNumber} 
                            className={`border-b last:border-0 align-top ${
                                isSelecting ? 'cursor-pointer hover:bg-gray-50' : ''
                            } ${
                                selectedItems.has(row.rowNumber) ? 'bg-yellow-50' : ''
                            }`}
                            onClick={() => isSelecting && handleSelectItem(row.rowNumber)}
                        >
                            {isSelecting && (
                                <td onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selectedItems.has(row.rowNumber)}
                                        onChange={() => handleSelectItem(row.rowNumber)}
                                    />
                                </td>
                            )}
                            <td className='font-medium'># {row.rowNumber}</td>

                            <td>
                                <StudentInfoCell student={row.student} />
                            </td>

                            {/* OLD PAYMENT */}
                            <td className="text-xs space-y-1 text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Wallet size={14} />
                                    {row.oldPayment.amount != null ? row.oldPayment.amount.toLocaleString() : '—'}
                                </div>

                                <div className="flex items-center gap-1">
                                    <Tag size={14} />
                                    {row.oldPayment.status}
                                </div>

                                <div className="flex items-center gap-1">
                                    <CalendarDays size={14} />
                                    {row.oldPayment.paidAt
                                        ? new Date(row.oldPayment.paidAt).toLocaleDateString()
                                        : '—'}
                                </div>

                                {row.oldPayment.notes && (
                                    <div className="text-xs italic text-gray-500">
                                        {row.oldPayment.notes}
                                    </div>
                                )}
                            </td>

                            {/* NEW PAYMENT */}
                            <td className="text-xs space-y-1 text-blue-700">
                                <div className="flex items-center gap-1">
                                    <Wallet size={14} />
                                    {row.newPayment.amount != null ? row.newPayment.amount.toLocaleString() : '—'}
                                </div>

                                <div className="flex items-center gap-1">
                                    <Tag size={14} />
                                    {row.newPayment.status}
                                </div>

                                <div className="flex items-center gap-1">
                                    <CalendarDays size={14} />
                                    {row.newPayment.paidAt
                                        ? new Date(row.newPayment.paidAt).toLocaleDateString()
                                        : '—'}
                                </div>

                                {row.newPayment.notes && (
                                    <div className="text-xs italic text-blue-600">
                                        {row.newPayment.notes}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onPageChange={setPage}
                    onItemsPerPageChange={(v) => {
                        setLimit(v)
                        setPage(1)
                    }}
                />
            )}
        </Section>
    )
}
