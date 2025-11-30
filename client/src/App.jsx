import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Shortener from "./components/Shortener/Shortener";
import UserLinks from "./components/links/UserLinks";
import Button from "./components/ui/Button";

// Главный компонент приложения
function App() {
  const { isAuthenticated, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  // ==========================================
  // 1. ЭКРАН ДЛЯ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
  // ==========================================
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* ТОП-БАР БЕЗ ВЕРХНЕГО ОТСТУПА */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {/* ЛОГОТИП */}
                <img
                  src="/logo.png"
                  alt="URL Сократитель"
                  className="h-14 w-22"
                />
                <h1 className="text-3xl font-bold text-gray-800">
                  Сервис сокращения URL
                </h1>
              </div>
              <Button
                variant="light"
                onClick={logout}
                className="py-2 px-4 text-sm"
              >
                Выйти
              </Button>
            </div>
          </div>
        </header>

        {/* ОСНОВНОЙ КОНТЕНТ С ОТСТУПОМ ДЛЯ ФОРМЫ */}
        <div className="max-w-6xl mx-auto p-6">
          <main className="pt-8">
            {/* Форма создания короткой ссылки */}
            <Shortener />

            {/* Таблица ссылок пользователя */}
            <UserLinks />
          </main>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. ЭКРАН ВХОДА / РЕГИСТРАЦИИ
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center md:items-start justify-center md:gap-16 px-4">
        {/* ЛЕВАЯ КОЛОНКА (Лого и Текст) */}
        <div className="text-center md:text-left mb-10 md:mb-0 md:mt-10 max-w-lg">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                       <h1 className="text-4xl md:text-5xl font-extrabold text-[#1877F2] drop-shadow-sm">
              URL Сократитель
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-black leading-tight">
            Сокращайте ссылки и делитесь ими с друзьями и миром.
          </p>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Форма) */}
        <div className="w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
            {isRegistering ? (
              <Register onToggle={setIsRegistering} />
            ) : (
              <Login onToggle={setIsRegistering} />
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            <span className="font-medium text-black">
              Технологии проекта: ⚛️ React + 🎨 Tailwind CSS + ⚡Vite
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
