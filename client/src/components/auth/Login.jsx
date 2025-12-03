import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthForm } from "../../hooks/useAuthForm";
import apiClient from "../../api/apiClient";
import Button from "../ui/Button";
import Input from "../ui/Input";

// Компонент регистрации
function Login({ onToggle }) {
  const { login } = useAuth();
  const {
    username,
    password,
    message,
    isLoading,
    setUsername,
    setPassword,
    setMessage,
    setIsLoading,
  } = useAuthForm();

  // ОБРАБОТЧИК ВХОДА
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // ПОПЫТКА ВХОДА
    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      // Успешный вход - сохраняем токен
      console.log("🔐 Login response:", response.data);
      login(response.data.token, response.data.userId);
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message || "Ошибка входа. Проверьте данные.";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // РЕНДЕР ФОРМЫ ВХОДА
  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {/* Сообщение об ошибке */}
      {message && (
        <div className="p-3 rounded-lg text-center text-sm font-medium bg-red-100 text-red-600 border border-red-200">
          {message}
        </div>
      )}

      {/* Поле для логина */}
      <Input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoFocus
      />

      {/* Поле для пароля */}
      <Input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Кнопка входа */}
      <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
        Войти
      </Button>

      <div className="my-2 border-b border-gray-200"></div>

      {/* Кнопка перехода к регистрации */}
      <div className="text-center">
        <Button
          type="button"
          onClick={() => onToggle(true)}
          variant="secondary"
          className="w-auto px-8"
          disabled={isLoading}
        >
          Создать новый аккаунт
        </Button>
      </div>
    </form>
  );
}

export default Login;
