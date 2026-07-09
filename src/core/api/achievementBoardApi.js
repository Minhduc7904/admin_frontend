import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const achievementBoardApi = {
  getAll(params = {}) {
    return axiosClient.get(API_ENDPOINTS.ACHIEVEMENT_BOARDS.LIST, { params });
  },

  create(data) {
    return axiosClient.post(API_ENDPOINTS.ACHIEVEMENT_BOARDS.CREATE, data);
  },

  update(id, data) {
    return axiosClient.put(API_ENDPOINTS.ACHIEVEMENT_BOARDS.UPDATE(id), data);
  },

  delete(id) {
    return axiosClient.delete(API_ENDPOINTS.ACHIEVEMENT_BOARDS.DELETE(id));
  },

  downloadRowTemplate() {
    return axiosClient.get(API_ENDPOINTS.ACHIEVEMENT_BOARDS.ROW_TEMPLATE, {
      responseType: "blob",
    });
  },

  importRows(id, file) {
    const formData = new FormData();
    formData.append("file", file);

    return axiosClient.post(
      API_ENDPOINTS.ACHIEVEMENT_BOARDS.IMPORT_ROWS(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  updateRow(rowId, data) {
    return axiosClient.put(API_ENDPOINTS.ACHIEVEMENT_BOARDS.UPDATE_ROW(rowId), data);
  },

  deleteRow(rowId) {
    return axiosClient.delete(API_ENDPOINTS.ACHIEVEMENT_BOARDS.DELETE_ROW(rowId));
  },
};
