import axios from "axios";

// Базовый URL для всех запросов к API
const API_BASE_URL = "http://localhost:3000/api/v1";

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
