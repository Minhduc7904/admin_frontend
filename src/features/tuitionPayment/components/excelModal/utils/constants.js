/* ===================== MONTH & YEAR OPTIONS ===================== */
export const MONTH_OPTIONS = Array.from({ length: 12 }).map((_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
}))

const CURRENT_YEAR = new Date().getFullYear()
export const YEAR_OPTIONS = Array.from({ length: 5 }).map((_, i) => {
    const year = CURRENT_YEAR - i
    return { value: year, label: `Năm ${year}` }
})

/* ===================== PAGINATION HELPER ===================== */
export const paginate = (items, page, limit) => {
    const totalItems = items.length
    const totalPages = Math.ceil(totalItems / limit)

    const start = (page - 1) * limit
    const end = start + limit

    return {
        items: items.slice(start, end),
        totalItems,
        totalPages,
    }
}
