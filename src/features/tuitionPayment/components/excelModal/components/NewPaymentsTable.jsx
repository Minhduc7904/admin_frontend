import { useState, useEffect } from 'react'
import { CheckCircle, Plus } from 'lucide-react'

import { Pagination, Button, Checkbox } from '../../../../../shared/components/ui'
import { formatDate } from '../../../../../shared/utils'
import { paginate } from '../utils/constants'
import { Section, StudentInfoCell } from './CommonComponents'

export const NewPaymentsTable = ({ data, onAdd, loading = false }) => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [isSelecting, setIsSelecting] = useState(false)
    const [selectedItems, setSelectedItems] = useState(new Set())

    // reset page khi data thay đổi
    useEffect(() => {
        setPage(1)
    }, [data])

    if (!data?.length) return null

    const { items, totalPages, totalItems } = paginate(data, page, limit)

    const handleSelectAll = () => {
        if (selectedItems.size === data.length) {
            // Deselect all
            setSelectedItems(new Set())
        } else {
            // Select all
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

    const handleAdd = () => {
        const selectedData = data.filter(item => selectedItems.has(item.rowNumber))
        onAdd?.(selectedData)
        // Reset after add
        setSelectedItems(new Set())
        setIsSelecting(false)
    }

    const allSelected = data.length > 0 && selectedItems.size === data.length
    const someSelected = selectedItems.size > 0 && selectedItems.size < data.length

    return (
        <Section
            title={`Khoản thu mới (${data.length})`}
            icon={CheckCircle}
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
                                onClick={handleAdd}
                                disabled={selectedItems.size === 0}
                                loading={loading}
                            >
                                <Plus size={16} />
                                Thêm ({selectedItems.size})
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
                        <th>Tháng/Năm</th>
                        <th>Số tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày đóng</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map(r => (
                        <tr 
                            key={r.rowNumber} 
                            className={`border-b last:border-0 ${
                                isSelecting ? 'cursor-pointer hover:bg-gray-50' : ''
                            } ${
                                selectedItems.has(r.rowNumber) ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => isSelecting && handleSelectItem(r.rowNumber)}
                        >
                            {isSelecting && (
                                <td onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selectedItems.has(r.rowNumber)}
                                        onChange={() => handleSelectItem(r.rowNumber)}
                                    />
                                </td>
                            )}
                            <td className='font-medium'># {r.rowNumber}</td>
                            <td>
                                <StudentInfoCell student={r.student} />
                            </td>
                            <td>{r.payment.month}/{r.payment.year}</td>
                            <td>{r.payment.amount.toLocaleString()}</td>
                            <td className="text-blue-600">
                                {r.payment.status}
                            </td>
                            <td>
                                {r.payment.paidAt
                                    ? formatDate(r.payment.paidAt)
                                    : '—'}
                            </td>
                            <td className="text-xs text-gray-600">
                                {r.payment.notes || '—'}
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
