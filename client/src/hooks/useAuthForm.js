import { useState } from "react";

// Кастомный хук для управления состоянием формы аутентификации
export const useAuthForm = (initialUsername = "", initialPassword = "") => {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Функция для сброса формы к начальному состоянию
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setMessage("");
    setIsLoading(false);
  };

  return {
    // Состояния
    username,
    password,
    message,
    isLoading,
    
    // Сеттеры
    setUsername,
    setPassword,
    setMessage,
    setIsLoading,
    
    // Методы
    resetForm,
  };
};