import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthForm } from "../../hooks/useAuthForm";
import apiClient from "../../api/apiClient";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { encodeToBase64 } from "../../utils/encoder";

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

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const encodedPassword = encodeToBase64(password);

      console.log("🔐 Отправляем закодированный пароль:", {
        username,
        passwordLength: password.length,
        encodedPassword,
      });

      const response = await apiClient.post("/auth/login", {
        username,
        password: encodedPassword,
      });

      console.log("✅ Login response:", response.data);
      login(response.data.token, response.data.userId);
    } catch (error) {
      console.error("Login error:", error);

      let errorMsg = "Ошибка входа. Проверьте данные.";

      if (error.response?.status === 429) {
        errorMsg = "Слишком много попыток. Подождите 15 минут.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
        >
          {showPassword ? "Скрыть" : "Показать"}
        </button>
      </div>

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
