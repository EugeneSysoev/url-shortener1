import React, { useState, useEffect, useCallback } from "react";
import { LinkContext } from "./LinkContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import apiClient from "../api/apiClient.js";

// Провайдер контекста ссылок
export const LinkProvider = ({ children }) => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ЛОГИРОВАНИЕ СОСТОЯНИЯ ПРИ РЕНДЕРЕ
  console.log("🔗 LinkProvider - Component rendered", {
    isAuthenticated,
    isAuthReady,
    linksCount: links.length,
    isLoading,
  });

  // ===================================
  // 1. ФУНКЦИЯ ЗАГРУЗКИ ССЫЛОК
  // ===================================
  const fetchLinks = useCallback(async () => {
    console.log("🔄 fetchLinks - START", {
      isAuthenticated,
      isAuthReady,
    });

    // Проверяем готовность авторизации
    if (!isAuthenticated || !isAuthReady) {
      console.log("🔗 fetchLinks - SKIP: Not authenticated or not ready");
      setLinks([]);
      setIsLoading(false);
      return;
    }

    console.log("🔗 fetchLinks - Starting API request");
    setIsLoading(true);
    setError(null);

    // Выполняем запрос к API для получения ссылок
    try {
      const response = await apiClient.get("/user_links");
      console.log("🔗 fetchLinks - API Response received:", {
        status: response.status,
        data: response.data,
      });

      // Обрабатываем полученные данные
      const fetchedLinks = response.data.links || [];
      console.log("🔗 fetchLinks - Fetched links from API:", {
        count: fetchedLinks.length,
        links: fetchedLinks,
      });

      // Сортируем ссылки по дате создания (новые первыми)
      if (Array.isArray(fetchedLinks)) {
        const sortedLinks = fetchedLinks.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log("🔗 fetchLinks - Setting new links to state:", {
          // ⭐️ УБРАЛ oldCount: links.length,
          newCount: sortedLinks.length,
          sortedLinks,
        });

        // Обновляем состояние ссылок
        setLinks(sortedLinks);
        console.log("🔗 fetchLinks - State updated successfully");
      } else {
        console.error(
          "🔗 fetchLinks - ERROR: fetchedLinks is not an array:",
          fetchedLinks
        );
        setLinks([]);
      }
      // Очищаем ошибки
    } catch (err) {
      console.error("🔗 fetchLinks - ERROR:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMsg =
        err.response?.data?.message ||
        "Ошибка загрузки ссылок. Проверьте соединение с бэкендом.";
      setError(errorMsg);
      setLinks([]);
    } finally {
      console.log("🔗 fetchLinks - FINISH: Setting isLoading to false");
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthReady]);

  // ===================================
  // 2. ЭФФЕКТ ДЛЯ АВТОЗАГРУЗКИ ПРИ ИНИЦИАЛИЗАЦИИ
  // ===================================
  useEffect(() => {
    console.log("🔗 LinkProvider - useEffect triggered", {
      isAuthReady,
      isAuthenticated,
    });

    // Запускаем загрузку ссылок, если аутентификация готова
    if (isAuthReady) {
      console.log("🔗 LinkProvider - Starting auto-fetch");
      fetchLinks();
    } else {
      console.log("🔗 LinkProvider - SKIP: Auth not ready yet");
    }
  }, [isAuthReady, isAuthenticated, fetchLinks]);

  // ===================================
  // 3. ФУНКЦИЯ СОКРАЩЕНИЯ ССЫЛКИ
  // ===================================
  const createLink = useCallback(
    async (longUrl) => {
      console.log("🔗 createLink - START", { longUrl, isAuthenticated });

      // Проверяем аутентификацию
      if (!isAuthenticated) {
        console.log("🔗 createLink - SKIP: Not authenticated");
        setError("Вы не авторизованы.");
        return null;
      }

      // Выполняем запрос к API для создания сокращенной ссылки
      try {
        console.log("🔗 createLink - Making API request to /make_link_short");
        const response = await apiClient.post("/make_link_short", {
          longUrl,
        });

        console.log("🔗 createLink - API Response:", response.data);

        // После успешного создания ОБНОВЛЯЕМ список ссылок
        console.log("🔗 createLink - Refreshing links list");
        await fetchLinks();

        // Очищаем ошибки
        setError(null);
        console.log("🔗 createLink - SUCCESS");

        return response.data.shortUrl;
      } catch (err) {
        console.error("🔗 createLink - ERROR:", {
          message: err.message,
          response: err.response?.data,
        });
        const errorMsg =
          err.response?.data?.message ||
          "Ошибка при сокращения ссылки. Проверьте формат URL.";
        setError(errorMsg);
        return null;
      }
    },
    [isAuthenticated, fetchLinks]
  );

  // ===================================
  // 4. ФУНКЦИЯ УДАЛЕНИЯ ССЫЛКИ
  // ===================================
  const deleteLink = useCallback(
    async (linkId) => {
      console.log("🔗 deleteLink - START", { linkId, isAuthenticated });

      // Проверяем аутентификацию
      if (!isAuthenticated) {
        console.log("🔗 deleteLink - SKIP: Not authenticated");
        setError("Вы не авторизованы.");
        return;
      }
      // Выполняем запрос к API для удаления ссылки
      try {
        console.log("🔗 deleteLink - Making API request to delete link");
        await apiClient.delete(`/links/${linkId}`);

        // Мгновенное обновление UI
        console.log("🔗 deleteLink - Updating local state");
        setLinks((currentLinks) => {
          const updatedLinks = currentLinks.filter(
            (link) => link.id !== linkId
          );
          console.log("🔗 deleteLink - State updated", {
            afterDelete: updatedLinks.length,
          });
          return updatedLinks;
        });
        setError(null);
        console.log("🔗 deleteLink - SUCCESS");
      } catch (err) {
        console.error("🔗 deleteLink - ERROR:", {
          message: err.message,
          response: err.response?.data,
        });
        const errorMsg =
          err.response?.data?.message || "Ошибка при удалении ссылки.";
        setError(errorMsg);
      }
    },
    [isAuthenticated]
  );

  const value = {
    links,
    isLoading,
    error,
    createLink,
    deleteLink,
    fetchLinks,
  };

  // ЛОГИРОВАНИЕ ФИНАЛЬНЫХ ЗНАЧЕНИЙ КОНТЕКСТА
  console.log("🔗 LinkProvider - Final context value:", {
    linksCount: value.links.length,
    isLoading: value.isLoading,
    error: value.error,
    hasCreateLink: !!value.createLink,
    hasFetchLinks: !!value.fetchLinks,
  });

  return <LinkContext.Provider value={value}>{children}</LinkContext.Provider>;
};
