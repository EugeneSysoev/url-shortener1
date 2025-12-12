import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders
} from "axios";

// Используй значения по умолчанию
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";
const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";
const API_BASE_URL = `${APP_BASE_URL}/${API_VERSION}`;

interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("authToken");
    
    if (token) {
      config.headers = config.headers || new AxiosHeaders();
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error("🔐 Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError<ApiErrorData>): Promise<AxiosError<ApiErrorData>> => {
    if (error.response?.status === 401) {
      console.error("Ошибка 401: Токен истёк или недействителен");
      localStorage.removeItem("authToken");
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;