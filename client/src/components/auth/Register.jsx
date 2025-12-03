import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthForm } from "../../hooks/useAuthForm";
import apiClient from "../../api/apiClient";
import Button from "../ui/Button";
import Input from "../ui/Input";

// Компонент регистрации
function Register({ onToggle }) {
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

  // ОБРАБОТЧИК РЕГИСТРАЦИИ
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // ПОПЫТКА РЕГИСТРАЦИИ
    try {
      const response = await apiClient.post("/auth/register", {
        username,
        password,
      });

      // Если токен получен - сразу логиним
      if (response.data.token) {
        login(response.data.token, response.data.userId);
        setMessage("Успешно! Вход...");
      } else {
        // Иначе переходим на форму логина
        setMessage("Регистрация успешна! Теперь войдите.");
        setTimeout(() => onToggle(false), 1500);
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
      {/* Заголовок формы */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Регистрация</h2>
        <p className="text-sm text-gray-500">Быстро и легко.</p>
      </div>

      {/* Сообщение об успехе/ошибке */}
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

      {/* Поле для логина */}
      <Input
        type="text"
        placeholder="Придумайте логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      {/* Поле для пароля */}
      <Input
        type="password"
        placeholder="Придумайте пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Юмористическое уведомление */}
      <p className="text-xs text-gray-500 text-center px-4">
        Нажимая "Регистрация", вы соглашаетесь с нашими Правилами (которых нет).
        😂
      </p>

      {/* Кнопка регистрации */}
      <Button type="submit" fullWidth isLoading={isLoading} variant="secondary">
        Зарегистрироваться
      </Button>

      {/* Ссылка на форму входа */}
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
