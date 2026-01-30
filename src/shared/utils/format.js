/**
 * Format number as Vietnamese currency
 * @param {number} value - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatMoney = (value) => {
    if (value == null || isNaN(value)) return '0 ₫'
    return value.toLocaleString('vi-VN') + ' ₫'
}

/**
 * Format number with thousand separators
 * @param {number} value - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
    if (value == null || isNaN(value)) return '0'
    return value.toLocaleString('vi-VN')
}

/**
 * Format percentage
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value, decimals = 0) => {
    if (value == null || isNaN(value)) return '0%'
    return value.toFixed(decimals) + '%'
}
