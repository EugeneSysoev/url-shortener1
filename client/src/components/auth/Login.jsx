import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../api/apiClient";
import Button from "../ui/Button";
import Input from "../ui/Input";

// Упрощенная форма входа: только логин и пароль.
function Login({ onToggle }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик отправки формы входа
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // 1. Выполняем запрос на вход
    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      // 2. Если успех, сохраняем токен и ID пользователя
      console.log("🔐 Login response data:", response.data);
      console.log("🔐 Login - userId в ответе:", response.data.userId);
      console.log(
        "🔐 Login - token в ответе:",
        response.data.token ? "Есть" : "Нет"
      );

      // Извлекаем userId из ответа или из токена, если не пришел напрямую
      let userIdToUse = response.data.userId;
      if (!userIdToUse && response.data.token) {
        const payload = JSON.parse(atob(response.data.token.split(".")[1]));
        userIdToUse = payload.userId;
        console.log("🔐 Login - userId из токена:", userIdToUse);
      }

      // Вызываем функцию login из контекста
      login(response.data.token, userIdToUse);
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message || "Ошибка входа. Проверьте данные.";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // JSX формы входа
  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {message && (
        <div className="p-3 rounded-lg text-center text-sm font-medium bg-red-100 text-red-600 border border-red-200">
          {message}
        </div>
      )}

      <Input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoFocus
      />
      <Input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
        Войти
      </Button>

      <div className="my-2 border-b border-gray-200"></div>

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
