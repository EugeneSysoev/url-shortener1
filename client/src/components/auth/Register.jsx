import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../api/apiClient";
import Button from "../ui/Button";
import Input from "../ui/Input";

// Упрощенная форма регистрации: только логин и пароль.
function Register({ onToggle }) {
  const { login } = useAuth(); // Получаем функцию login из контекста
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      // 1. Регистрируем пользователя
      const response = await apiClient.post("/auth/register", {
        username,
        password,
      });

      // 2. Если успех, сервер обычно возвращает токен сразу.
      // Если нет, можно вызвать /login автоматически.
      // Предположим, сервер возвращает токен:
      if (response.data.token) {
        login(response.data.token, response.data.userId);
        setMessage("Успешно! Вход...");
      } else {
        setMessage("Регистрация успешна! Теперь войдите.");
        setTimeout(() => onToggle(false), 1500); // Перекидываем на логин
      }
    } catch (error) {
      console.error("Register error:", error);
      const errorMsg =
        error.response?.data?.message || "Ошибка регистрации. Имя занято?";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Регистрация</h2>
        <p className="text-sm text-gray-500">Быстро и легко.</p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-center text-sm font-medium ${
            message.includes("Ошибка")
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {message}
        </div>
      )}

      <Input
        type="text"
        placeholder="Придумайте логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Придумайте пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <p className="text-xs text-gray-500 text-center px-4">
        Нажимая "Регистрация", вы соглашаетесь с нашими Правилами (которых нет). 😂
      </p>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        variant="secondary" 
      >
        Зарегистрироваться
      </Button>

      {/* Кнопка "Назад ко входу" */}
      <div className="text-center mt-2">
        <button
          type="button"
          onClick={() => onToggle(false)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Уже есть аккаунт?
        </button>
      </div>
    </form>
  );
}

export default Register;
