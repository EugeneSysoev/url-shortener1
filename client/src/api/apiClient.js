import axios from "axios";

// Получение базового URL и версии API из переменных окружения
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

// Полный базовый URL для API
const API_BASE_URL = `${APP_BASE_URL}/${API_VERSION}`;

// Создание экземпляра axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Интерцептор запросов: Автоматическое добавление токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token added to request:", token.substring(0, 20) + "...");
    } else {
      console.log("🔐 No token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  Интерцептор ответов: Обработка ошибок аутентификации
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если токен истёк или недействителен (401 Unauthorized), мы можем автоматически выйти из системы.
    if (error.response && error.response.status === 401) {
      console.error("Ошибка 401: Токен истёк или недействителен. Выход.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
