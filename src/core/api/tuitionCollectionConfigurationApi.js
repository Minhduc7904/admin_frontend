import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const tuitionCollectionConfigurationApi = {
  get() {
    return axiosClient.get(API_ENDPOINTS.TUITION_COLLECTION_CONFIGURATION.GET);
  },

  update(data) {
    return axiosClient.put(API_ENDPOINTS.TUITION_COLLECTION_CONFIGURATION.UPDATE, data);
  },
};
