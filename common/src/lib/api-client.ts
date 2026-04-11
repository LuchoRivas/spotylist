import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create();

export const initApiClient = (baseURL: string) => {
  apiClient.defaults.baseURL = baseURL;
};

export const setAuthTokenHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const get = async (url: string, config?: AxiosRequestConfig) => {
  const response = await apiClient.get(url, config);
  return response.data;
};

export const post = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig
) => {
  const response = await apiClient.post(url, data, config);
  return response.data;
};

export const put = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig
) => {
  const response = await apiClient.put(url, data, config);
  return response.data;
};

export default apiClient;
