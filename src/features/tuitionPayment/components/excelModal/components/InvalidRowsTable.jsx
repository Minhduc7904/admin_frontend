import { useState } from 'react'
import { AlertTriangle, Info, FileJson } from 'lucide-react'

import { Pagination } from '../../../../../shared/components/ui'
import { paginate } from '../utils/constants'
import { Section } from './CommonComponents'

export const InvalidRowsTable = ({ data }) => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    if (!data || !data.length) return null

    const { items, totalPages, totalItems } = paginate(data, page, limit)

    return (
        <Section
            title={`Dòng lỗi (${data.length})`}
            icon={AlertTriangle}
            danger
        >
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left">
                        <th className="w-16">Row</th>
                        <th className="w-40">Lý do</th>
                        <th className="w-40">Thông báo</th>
                        <th className="w-[320px]">Raw data</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map(row => (
                        <tr key={row.rowNumber} className="border-b align-top last:border-0">
                            {/* Row number */}
                            <td className="font-medium">
                                # {row.rowNumber}
                            </td>

                            {/* Reason */}
                            <td className="text-red-600 font-medium">
                                <div className="flex items-center gap-1">
                                    <AlertTriangle size={14} />
                                    {row.reason}
                                </div>
                            </td>

                            {/* Message */}
                            <td>
                                <div className="flex items-start gap-1 text-gray-700">
                                    <Info size={14} className="mt-0.5 shrink-0" />
                                    <span>{row.message}</span>
                                </div>
                            </td>

                            {/* Raw data */}
                            <td>
                                <div className="flex items-start gap-2">
                                    <FileJson
                                        size={14}
                                        className="mt-1 text-gray-500 shrink-0"
                                    />
                                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto w-full">
                                        {JSON.stringify(row.rawData, null, 2)}
                                    </pre>
                                </div>
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
