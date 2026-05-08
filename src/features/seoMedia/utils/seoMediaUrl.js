import { API_BASE_URL } from '../../../core/constants';

export const resolveSeoMediaUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  try {
    const apiUrl = new URL(API_BASE_URL);
    return `${apiUrl.origin}${url.startsWith('/') ? url : `/${url}`}`;
  } catch {
    return url;
  }
};
