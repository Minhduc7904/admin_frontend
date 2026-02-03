import {
    ArrowUp,
    ArrowDown,
    ChevronsUpDown,
} from 'lucide-react';

import { SkeletonTable } from '../loading/Loading';
import { EmptyTable } from '../empty';

/* ===================== SORT HELPERS ===================== */
const getNextSortDirection = (current) => {
    if (!current) return 'asc';
    return current === 'asc' ? 'desc' : 'asc';
};

export const Table = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = 'Không có dữ liệu',
    emptySubMessage,
    emptyIcon = 'database',
    emptyActionLabel,
    onEmptyAction,
    rowClassName,
    onRowClick,
    onRowMouseEnter,
    onRowMouseLeave,
    lastRowRef,
    onDragStart,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                {/* ===================== HEADER ===================== */}
                <thead>
                    <tr className="border-b border-border">
                        {columns.map((column, index) => {
                            const isSortable = typeof column.onSort === 'function';
                            const sortDirection = column.sortDirection;

                            const alignClass =
                                column.align === 'center'
                                    ? 'text-center'
                                    : column.align === 'right'
                                        ? 'text-right'
                                        : 'text-left';

                            return (
                                <th
                                    key={column.key || index}
                                    style={{ width: column.width }}
                                    className={`
                                        px-4 py-2 text-xs font-semibold uppercase tracking-wider
                                        text-foreground-light
                                        ${alignClass}
                                        ${isSortable ? 'cursor-pointer select-none hover:text-foreground' : ''}
                                        ${column.headerClassName || ''}
                                    `}
                                    onClick={() => {
                                        if (!isSortable) return;
                                        const nextDirection = getNextSortDirection(sortDirection);
                                        column.onSort(nextDirection);
                                    }}
                                >
                                    <div
                                        className={`flex items-center gap-1 ${column.align === 'right'
                                            ? 'justify-end'
                                            : column.align === 'center'
                                                ? 'justify-center'
                                                : 'justify-start'
                                            }`}
                                    >
                                        <span>{column.label}</span>

                                        {isSortable && (
                                            <span className="text-foreground-light">
                                                {sortDirection === 'asc' && <ArrowUp size={14} />}
                                                {sortDirection === 'desc' && <ArrowDown size={14} />}
                                                {!sortDirection && <ChevronsUpDown size={14} />}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                {/* ===================== BODY ===================== */}
                <tbody className="divide-y divide-border w-full">
                    {/* ===== LOADING ===== */}
                    {loading && (
                        <SkeletonTable
                            rows={5}
                            columns={columns.length}
                        />
                    )}


                    {/* ===== EMPTY ===== */}
                    {!loading && (!data || data.length === 0) && (
                        <EmptyTable
                            title={emptyMessage}
                            description={emptySubMessage}
                            icon={emptyIcon}
                            actionLabel={emptyActionLabel}
                            onAction={onEmptyAction}
                            columns={columns.length}
                            asTbody
                        />
                    )}

                    {/* ===== DATA ===== */}
                    {!loading && data?.map((row, rowIndex) => {
                        const rowCls =
                            typeof rowClassName === 'function'
                                ? rowClassName(row, rowIndex)
                                : rowClassName;

                        const isLastRow = rowIndex === data.length - 1;

                        return (
                            <tr
                                key={row.id || rowIndex}
                                ref={isLastRow ? lastRowRef : null}
                                className={`
                                    group hover:bg-gray-50
                                    ${rowCls || ''}
                                    ${onRowClick ? 'cursor-pointer' : ''}
                                `}
                                onClick={() => onRowClick?.(row, rowIndex)}
                                onMouseEnter={() => onRowMouseEnter?.(row, rowIndex)}
                                onMouseLeave={() => onRowMouseLeave?.(row, rowIndex)}
                            >
                                {columns.map((column, colIndex) => {
                                    const cellClass =
                                        typeof column.className === 'function'
                                            ? column.className(row, rowIndex)
                                            : column.className;

                                    const alignClass =
                                        column.align === 'center'
                                            ? 'text-center'
                                            : column.align === 'right'
                                                ? 'text-right'
                                                : 'text-left';

                                    const isDragHandle = column.isDragHandle === true;

                                    return (
                                        <td
                                            key={column.key || colIndex}
                                            className={`px-4 py-2 ${alignClass} ${cellClass || ''}`}
                                            draggable={isDragHandle && !!onDragStart}
                                            onDragStart={(e) => {
                                                if (isDragHandle && onDragStart) {
                                                    e.stopPropagation();
                                                    onDragStart(row, e);
                                                }
                                            }}
                                            onClick={(e) => {
                                                if (isDragHandle) e.stopPropagation();
                                            }}
                                        >
                                            {column.render
                                                ? column.render(row, rowIndex)
                                                : row[column.key]}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
