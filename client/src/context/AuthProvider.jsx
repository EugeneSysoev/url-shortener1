import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

// Провайдер контекста аутентификации
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Проверка состояния аутентификации при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        setIsAuthenticated(true);
      }
      setIsAuthReady(true);
    };
    checkAuth();
  }, [token]);

  // Функция для входа пользователя
  const login = useCallback((newToken, newUserId) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);
    setIsAuthenticated(true);
  }, []);

  // Функция для выхода пользователя
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
  }, []);

  // Показать экран загрузки, пока не будет готово состояние аутентификации
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-gray-700">Загрузка...</span>
        </div>
      </div>
    );
  }

  // Значения и функции, предоставляемые через контекст аутентификации
  const value = {
    token,
    userId,
    isAuthenticated,
    isAuthReady,
    login,
    logout,
    db: null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
