import { SkeletonTable } from '../loading/Loading';

export const Table = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = 'Không có dữ liệu',
    emptySubMessage,
    rowClassName,
    onRowClick,
    lastRowRef,
}) => {
    if (loading) {
        return <SkeletonTable rows={5} columns={columns.length} />;
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-foreground-light">
                <p className="text-lg">{emptyMessage}</p>
                {emptySubMessage && <p className="text-sm mt-1">{emptySubMessage}</p>}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        {columns.map((column, index) => (
                            <th
                                key={column.key || index}
                                className={`px-4 py-2 text-xs font-semibold text-foreground-light uppercase tracking-wider ${column.align === 'center'
                                    ? 'text-center'
                                    : column.align === 'right'
                                        ? 'text-right'
                                        : 'text-left'
                                    } ${column.headerClassName || ''}`}
                                style={{ width: column.width }}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((row, rowIndex) => {
                        const rowClass =
                            typeof rowClassName === 'function'
                                ? rowClassName(row, rowIndex)
                                : rowClassName

                        const isLastRow = rowIndex === data.length - 1

                        return (
                            <tr
                                key={row.id || rowIndex}
                                ref={isLastRow ? lastRowRef : null} // 🔥 GẮN REF Ở ĐÂY
                                className={`hover:bg-gray-50 group ${rowClass || ''} ${onRowClick ? 'cursor-pointer' : ''
                                    }`}
                                onClick={() => onRowClick?.(row, rowIndex)}
                            >
                                {columns.map((column, colIndex) => {
                                    const cellClass =
                                        typeof column.className === 'function'
                                            ? column.className(row, rowIndex)
                                            : column.className

                                    return (
                                        <td
                                            key={column.key || colIndex}
                                            className={`px-4 py-2 ${column.align === 'center'
                                                    ? 'text-center'
                                                    : column.align === 'right'
                                                        ? 'text-right'
                                                        : 'text-left'
                                                } ${cellClass || ''}`}
                                        >
                                            {column.render
                                                ? column.render(row, rowIndex)
                                                : row[column.key]}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};