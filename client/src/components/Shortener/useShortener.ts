import { useState, useCallback, FormEvent } from "react";
import apiClient from "../../api/apiClient";
import { useLinks } from "../../hooks/useLinks";

// Типы для ответа API
interface ShortenUrlResponse {
  shortUrl: string;
}

// Интерфейс состояния хука
interface UseShortenerReturn {
  longUrl: string;
  shortUrl: string;
  error: string;
  isLoading: boolean;
  setLongUrl: (url: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleCopy: () => void;
}

// Тип для ошибок API
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

/**
 * Пользовательский хук для сокращения URL
 */
export const useShortener = (): UseShortenerReturn => {
  const { fetchLinks } = useLinks();
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Обработчик отправки формы сокращения URL
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setError("");
      setShortUrl("");
      setIsLoading(true);

      // Получаем URL из формы или из состояния
      const formData = new FormData(e.currentTarget);
      const urlToSubmit = (formData.get("url") as string) || longUrl;

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
        const response = await apiClient.post<ShortenUrlResponse>(
          "/make_link_short",
          {
            longUrl: urlToSubmit,
          }
        );

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
      } catch (err: unknown) {
        console.error("🔐 useShortener - ERROR:", err);

        // Типизируем ошибку
        const apiError = err as ApiError;
        setError(
          apiError.response?.data?.message ||
            "Не удалось сократить ссылку. Возможно, ваш токен истёк или URL недействителен."
        );
      } finally {
        console.log("🔐 useShortener - FINISH");
        setIsLoading(false);
      }
    },
    [fetchLinks, longUrl] // Добавлена зависимость от longUrl
  );

  /**
   * Обработчик копирования короткой ссылки в буфер обмена
   */
  const handleCopy = useCallback((): void => {
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
