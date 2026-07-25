import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const assistantShiftApi = {
  getSeries: () => axiosClient.get(API_ENDPOINTS.ASSISTANT_SHIFTS.SERIES),
  getAvailableSeries: () => axiosClient.get(API_ENDPOINTS.ASSISTANT_SHIFTS.AVAILABLE_SERIES),
  createSeries: (data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.SERIES, data),
  updateSeries: (id, data) => axiosClient.put(API_ENDPOINTS.ASSISTANT_SHIFTS.SERIES_DETAIL(id), data),
  deleteSeries: (id) => axiosClient.delete(API_ENDPOINTS.ASSISTANT_SHIFTS.SERIES_DETAIL(id)),
  getBySeries: (seriesId, params) => axiosClient.get(
    API_ENDPOINTS.ASSISTANT_SHIFTS.SHIFTS_BY_SERIES(seriesId),
    { params },
  ),
  getAvailableBySeries: (seriesId, params) => axiosClient.get(
    API_ENDPOINTS.ASSISTANT_SHIFTS.AVAILABLE_SHIFTS_BY_SERIES(seriesId),
    { params },
  ),
  getBaseBySeries: (seriesId) => axiosClient.get(API_ENDPOINTS.ASSISTANT_SHIFTS.BASE_SHIFTS_BY_SERIES(seriesId)),
  getEligibleAssistants: () => axiosClient.get(API_ENDPOINTS.ASSISTANT_SHIFTS.ASSISTANTS),
  getById: (id) => axiosClient.get(API_ENDPOINTS.ASSISTANT_SHIFTS.DETAIL(id)),
  create: (data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.SHIFTS, data),
  createBase: (data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.BASE_SHIFTS, data),
  copyBase: (data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.COPY_BASE, data),
  update: (id, data) => axiosClient.put(API_ENDPOINTS.ASSISTANT_SHIFTS.DETAIL(id), data),
  updateBase: (id, data) => axiosClient.put(API_ENDPOINTS.ASSISTANT_SHIFTS.BASE_DETAIL(id), data),
  delete: (id) => axiosClient.delete(API_ENDPOINTS.ASSISTANT_SHIFTS.DETAIL(id)),
  deleteBase: (id) => axiosClient.delete(API_ENDPOINTS.ASSISTANT_SHIFTS.BASE_DETAIL(id)),
  createAssignment: (shiftId, data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.ASSIGNMENTS(shiftId), data),
  updateAssignment: (shiftId, adminId, data) => axiosClient.put(
    API_ENDPOINTS.ASSISTANT_SHIFTS.ASSIGNMENT(shiftId, adminId), data,
  ),
  deleteAssignment: (shiftId, adminId) => axiosClient.delete(
    API_ENDPOINTS.ASSISTANT_SHIFTS.ASSIGNMENT(shiftId, adminId),
  ),
  copyBySeries: (seriesId, data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.COPY_BY_SERIES(seriesId), data),
  lockBySeries: (seriesId, data) => axiosClient.put(API_ENDPOINTS.ASSISTANT_SHIFTS.LOCK_BY_SERIES(seriesId), data),
  unlockBySeries: (seriesId, data) => axiosClient.put(API_ENDPOINTS.ASSISTANT_SHIFTS.UNLOCK_BY_SERIES(seriesId), data),
  setSelfRegistrationWindowBySeries: (seriesId, data) => axiosClient.put(
    API_ENDPOINTS.ASSISTANT_SHIFTS.SELF_REGISTRATION_WINDOW(seriesId), data,
  ),
  register: (id) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.REGISTER(id)),
  cancelRegistration: (id) => axiosClient.delete(API_ENDPOINTS.ASSISTANT_SHIFTS.REGISTER(id)),
  requestSwap: (data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.ASSIGNMENT_ACTIONS.SWAP_REQUESTS, data),
  requestTransfer: (data) => axiosClient.post(API_ENDPOINTS.ASSISTANT_SHIFTS.ASSIGNMENT_ACTIONS.TRANSFER_REQUESTS, data),
  getMySchedule: (params) => axiosClient.get(API_ENDPOINTS.ASSISTANT_SHIFTS.MY_SCHEDULE, { params }),
  getMyMonthlyStatistics: () => axiosClient.get(API_ENDPOINTS.ASSISTANT_SHIFTS.MY_MONTHLY_STATISTICS),
  getStatistics: (params) => axiosClient.get(API_ENDPOINTS.ASSISTANT_SHIFTS.STATISTICS, { params }),
};
