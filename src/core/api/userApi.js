import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../constants";

export const userApi = {
    toggleActivation: (userId) => {
        return axiosClient.patch(API_ENDPOINTS.USERS.TOGGLE_ACTIVATION(userId));
    }
};