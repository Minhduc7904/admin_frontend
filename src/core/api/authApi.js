import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const authApi = {
  login: (credentials) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: (userData) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  logout: ({ refreshToken }) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },

  refreshToken: (refreshToken) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  getCurrentUser: () => {
    return axiosClient.get(API_ENDPOINTS.AUTH.ME);
  },
};
