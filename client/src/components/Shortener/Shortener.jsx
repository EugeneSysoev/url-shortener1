import React from "react";
import { useShortener } from "./useShortener";

function Shortener() {
  const {
    longUrl,
    shortUrl,
    error,
    isLoading,
    setLongUrl,
    handleSubmit,
    handleCopy,
  } = useShortener();

  return (
    // Основной контейнер:
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Сократитель URL
      </h1>

      {/* Форма ввода */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Введите длинный URL здесь..."
          required
          // Инпут:
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          // Кнопка:
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition duration-150"
          disabled={isLoading}
        >
          {isLoading ? "Сокращение..." : "Сократить"}
        </button>
      </form>

      {/* Вывод ошибок */}
      {error && (
        // Ошибка:
        <p className="text-red-700 p-3 bg-red-100 border-l-4 border-red-500 rounded-md mb-4">
          {error}
        </p>
      )}

      {/* Вывод результата и кнопки копирования */}
      {shortUrl && (
        // Результат:
        <div className="flex items-center justify-between p-4 bg-green-100 border border-green-300 rounded-lg">
          <span className="text-lg font-medium text-green-800 wrap-break-words pr-4">
            {shortUrl}
          </span>
          <button
            onClick={handleCopy}
            // Кнопка копирования:
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-150"
          >
            Копировать 📋
          </button>
        </div>
      )}
    </div>
  );
}

export default Shortener;