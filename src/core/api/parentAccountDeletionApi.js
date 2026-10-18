import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '../constants';

export const parentAccountDeletionApi = {
  async allowRegistration(phone) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PARENT_ACCOUNT_DELETIONS.ALLOW_REGISTRATION}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body.message || 'Không thể cập nhật. Vui lòng thử lại.');
      error.status = response.status;
      throw error;
    }
    return body;
  },
};
