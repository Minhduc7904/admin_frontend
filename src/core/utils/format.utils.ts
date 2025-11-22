// Formatting utility functions

export const formatDate = (date: string | Date, locale = 'vi-VN'): string => {
  return new Date(date).toLocaleDateString(locale);
};

export const formatDateTime = (date: string | Date, locale = 'vi-VN'): string => {
  return new Date(date).toLocaleString(locale);
};

export const formatCurrency = (amount: number, currency = 'VND', locale = 'vi-VN'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number, locale = 'vi-VN'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
