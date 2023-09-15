import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { environment } from '../../environments/environment';

// Crear una instancia de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: environment.baseURL, // Reemplaza con la URL de tu API
});

// Función para establecer el token en las solicitudes
export const setAuthTokenHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Interceptores para manejar tokens y actualizaciones
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refresh_token = sessionStorage.getItem('refresh_token');
      const response = await apiClient.get('refresh_token', {
        params: { refresh_token },
      });
      const newToken = response.data.access_token;
      setAuthTokenHeader(newToken);
      // solicitud original con el nuevo token
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);

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
