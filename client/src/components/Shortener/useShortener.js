import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient.js";
import { useLinks } from "../../hooks/useLinks";

// Пользовательский хук для сокращения URL
export const useShortener = () => {
  const { fetchLinks } = useLinks();
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик отправки формы сокращения URL
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setShortUrl("");
      setIsLoading(true);

      // Получаем URL из формы или из состояния
      const formData = new FormData(e.target);
      const urlToSubmit = formData.get("url") || longUrl;

      console.log("🔐 useShortener - START", { urlToSubmit });

      // ПРОВЕРКА НА ПУСТОЙ URL
      if (!urlToSubmit) {
        setError("Пожалуйста, введите URL для сокращения.");
        setIsLoading(false);
        return;
      }

      // ОЧИСТКА ПОЛЯ ВВОДА
      console.log("🔐 useShortener - Clearing input field");
      setLongUrl("");

      // ВЫПОЛНЕНИЕ ЗАПРОСА НА СОКРАЩЕНИЕ
      try {
        console.log("🔐 useShortener - Making API request");
        const response = await apiClient.post("/make_link_short", {
          longUrl: urlToSubmit,
        });

        console.log("🔐 useShortener - API Response:", response.data);

        // ПРОВЕРЯЕМ НАЛИЧИЕ shortUrl В ОТВЕТЕ
        if (response.data.shortUrl) {
          const newShortUrl = response.data.shortUrl;
          setShortUrl(newShortUrl);
          console.log("🔐 useShortener - Short URL set:", newShortUrl);

          // ОБНОВЛЕНИЕ ТАБЛИЦЫ
          console.log("🔄 useShortener - Calling fetchLinks");
          await fetchLinks();
          console.log("🔄 useShortener - fetchLinks completed");
        } else {
          console.error("🔐 useShortener - No shortUrl in response");
          setError("Ошибка: сервер не вернул короткую ссылку");
        }
      } catch (err) {
        console.error("🔐 useShortener - ERROR:", err);
        setError(
          err.response?.data?.message ||
            "Не удалось сократить ссылку. Возможно, ваш токен истёк или URL недействителен."
        );
      } finally {
        console.log("🔐 useShortener - FINISH");
        setIsLoading(false);
      }
    },
    [fetchLinks] // Зависимость от fetchLinks
  );

  // Обработчик копирования короткой ссылки в буфер обмена
  const handleCopy = useCallback(() => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      console.log("Ссылка скопирована: " + shortUrl);
    }
  }, [shortUrl]);

  return {
    longUrl,
    shortUrl,
    error,
    isLoading,
    setLongUrl,
    handleSubmit,
    handleCopy,
  };
};
