import { useState } from 'react'
import { MinusCircle } from 'lucide-react'

import { Pagination } from '../../../../../shared/components/ui'
import { formatDate } from '../../../../../shared/utils'
import { paginate } from '../utils/constants'
import { Section, StudentInfoCell } from './CommonComponents'

export const UnchangedPaymentsTable = ({ data }) => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    if (!data || !data.length) return null

    const { items: pageData, totalPages, totalItems } = paginate(data, page, limit)

    return (
        <Section
            title={`Khoản thu không thay đổi (${data.length})`}
            icon={MinusCircle}
        >
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left">
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
                    {pageData.map(row => (
                        <tr key={row.rowNumber} className="border-b last:border-0">
                            <td className='font-medium'># {row.rowNumber}</td>

                            <td>
                                <StudentInfoCell student={row.student} />
                            </td>

                            <td>{row.payment.month}/{row.payment.year}</td>
                            <td>{row.payment.amount.toLocaleString()}</td>

                            <td className="text-gray-500">
                                {row.payment.status}
                            </td>
                            <td>
                                {row.payment.paidAt
                                    ? formatDate(row.payment.paidAt)
                                    : '—'}
                            </td>
                            <td className="text-xs text-gray-600">
                                {row.payment.notes || '—'}
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
