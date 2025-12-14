import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthForm } from "../../hooks/useAuthForm";
import apiClient from "../../api/apiClient";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { encodeToBase64 } from "../../utils/encoder"; // Убрали isBase64

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

  const [showPassword, setShowPassword] = useState(false);
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Валидация имени пользователя
  useEffect(() => {
    if (username.length === 0) {
      setUsernameValid(true);
      return;
    }

    const isValid =
      /^[a-zA-Z0-9_]+$/.test(username) &&
      username.length >= 3 &&
      username.length <= 30;
    setUsernameValid(isValid);
  }, [username]);

  // Валидация и оценка сложности пароля
  useEffect(() => {
    if (password.length === 0) {
      setPasswordValid(true);
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Длина
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Сложность
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1; // Убрали лишний escape
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    // Проверка на слабые пароли
    const weakPasswords = ["password", "123456", "qwerty", "admin", "test"];
    const isWeak = weakPasswords.includes(password.toLowerCase());

    setPasswordValid(!isWeak && password.length >= 8);
    setPasswordStrength(isWeak ? 0 : strength);
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Проверка валидации перед отправкой
    if (!usernameValid) {
      setMessage("Имя пользователя не соответствует требованиям");
      return;
    }

    if (!passwordValid) {
      setMessage("Пароль не соответствует требованиям безопасности");
      return;
    }

    setIsLoading(true);

    try {
      const encodedPassword = encodeToBase64(password);

      console.log("🔐 Регистрация с закодированным паролем:", {
        username,
        passwordLength: password.length,
        encodedPassword,
      });

      const response = await apiClient.post("/auth/register", {
        username,
        password: encodedPassword,
      });

      if (response.data.token) {
        login(response.data.token, response.data.userId);
        setMessage("✅ Регистрация успешна! Выполняется вход...");
      } else {
        setMessage("✅ Регистрация успешна! Теперь войдите.");
        setTimeout(() => onToggle(false), 1500);
      }
    } catch (error) {
      console.error("Register error:", error);

      let errorMsg = "Ошибка регистрации. Проверьте данные.";

      if (error.response?.status === 429) {
        errorMsg = "Слишком много попыток. Подождите 15 минут.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Обработка ошибок валидации с сервера
        const validationErrors = error.response.data.errors
          .map((err) => err.msg)
          .join(", ");
        errorMsg = `Ошибки: ${validationErrors}`;
      }

      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для отображения индикатора сложности пароля
  const getPasswordStrengthText = () => {
    if (password.length === 0) return "Введите пароль";
    if (passwordStrength <= 2) return "Слабый";
    if (passwordStrength <= 4) return "Средний";
    return "Сильный";
  };

  const getPasswordStrengthColor = () => {
    if (password.length === 0) return "bg-gray-200";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Регистрация</h2>
        <p className="text-sm text-gray-500">
          Создайте новый аккаунт для сокращения ссылок
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-center text-sm font-medium ${
            message.includes("✅") ||
            message.includes("успешн") ||
            message.includes("Успешн")
              ? "bg-green-100 text-green-600 border border-green-200"
              : "bg-red-100 text-red-600 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="reg-username"
          className="block text-sm font-medium text-gray-700"
        >
          Имя пользователя *
        </label>
        <Input
          id="reg-username"
          type="text"
          placeholder="Придумайте логин (3-30 символов)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={
            !usernameValid && username.length > 0
              ? "border-red-300 focus:border-red-500"
              : ""
          }
        />
        <div className="text-xs space-y-1">
          <p className={`${usernameValid ? "text-gray-500" : "text-red-500"}`}>
            {username.length > 0 && !usernameValid
              ? "❌ Только латинские буквы, цифры и символ _ (3-30 символов)"
              : "✅ Только латинские буквы, цифры и символ _ (3-30 символов)"}
          </p>
          <p className="text-gray-500">Пример: user_123, john_doe, admin</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label
            htmlFor="reg-password"
            className="block text-sm font-medium text-gray-700"
          >
            Пароль *
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showPassword ? "Скрыть" : "Показать"}
          </button>
        </div>
        <Input
          id="reg-password"
          type={showPassword ? "text" : "password"}
          placeholder="Придумайте надежный пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={
            !passwordValid && password.length > 0
              ? "border-red-300 focus:border-red-500"
              : ""
          }
        />

        {/* Индикатор сложности пароля */}
        {password.length > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-700">Сложность пароля:</span>
              <span
                className={`font-medium ${
                  passwordStrength <= 2
                    ? "text-red-600"
                    : passwordStrength <= 4
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                style={{
                  width: `${Math.min(100, (passwordStrength / 6) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="text-xs space-y-1 mt-2">
          <p
            className={`${
              password.length >= 8 ? "text-green-600" : "text-gray-500"
            }`}
          >
            {password.length >= 8 ? "✅" : "○"} Минимум 8 символов
          </p>
          <p
            className={`${
              /[a-z]/.test(password) ? "text-green-600" : "text-gray-500"
            }`}
          >
            {/[a-z]/.test(password) ? "✅" : "○"} Строчная буква (a-z)
          </p>
          <p
            className={`${
              /[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"
            }`}
          >
            {/[A-Z]/.test(password) ? "✅" : "○"} Заглавная буква (A-Z)
          </p>
          <p
            className={`${
              /\d/.test(password) ? "text-green-600" : "text-gray-500"
            }`}
          >
            {/\d/.test(password) ? "✅" : "○"} Хотя бы одна цифра (0-9)
          </p>
          <p
            className={`${
              /[!@#$%^&*(),.?":{}|<>]/.test(password)
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✅" : "○"} Спецсимвол
            (!@#$% и т.д.)
          </p>
          <p
            className={`${
              !/password|123456|qwerty|admin|test/i.test(password)
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {!/password|123456|qwerty|admin|test/i.test(password) ? "✅" : "❌"}{" "}
            Не простой пароль
          </p>
          <p className="text-gray-500 mt-1">
            Пример надежного пароля: MyP@ssw0rd!2025
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center px-4">
        Нажимая "Зарегистрироваться", вы соглашаетесь с политикой
        конфиденциальности.
      </p>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        variant="secondary"
        className="mt-2"
        disabled={!usernameValid || !passwordValid}
      >
        {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
      </Button>

      <div className="text-center mt-2">
        <button
          type="button"
          onClick={() => onToggle(false)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Уже есть аккаунт? Войти
        </button>
      </div>
    </form>
  );
}

export default Register;
