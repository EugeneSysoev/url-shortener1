import React, { useState, useEffect, useCallback } from "react";
import { LinkContext } from "./LinkContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import apiClient from "../api/apiClient.js";

export const LinkProvider = ({ children }) => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка ссылок пользователя
  const fetchLinks = useCallback(async () => {
    if (!isAuthenticated || !isAuthReady) {
      setLinks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/user_links");
      const fetchedLinks = response.data.links || [];
      setLinks(fetchedLinks);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Ошибка загрузки ссылок.";
      setError(errorMsg);
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthReady]);

  // Создание новой ссылки
  const createLink = useCallback(
    async (longUrl) => {
      if (!isAuthenticated) {
        setError("Вы не авторизованы.");
        return null;
      }

      try {
        const response = await apiClient.post("/make_link_short", { longUrl });

        // Оптимистичное обновление - добавляем сразу
        const newLink = {
          id: response.data.linkId,
          shortCode: response.data.shortUrl?.split("/").pop(),
          longUrl,
          shortUrl: response.data.shortUrl,
          createdAt: new Date().toISOString(),
        };

        setLinks((prev) => [newLink, ...prev]);
        setError(null);

        return response.data.shortUrl;
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Ошибка при сокращении ссылки.";
        setError(errorMsg);
        return null;
      }
    },
    [isAuthenticated]
  );

  // Удаление ссылки
  const deleteLink = useCallback(
    async (linkId) => {
      if (!isAuthenticated) {
        setError("Вы не авторизованы.");
        return;
      }

      try {
        await apiClient.delete(`/links/${linkId}`);

        // Локальное удаление из состояния
        setLinks((currentLinks) =>
          currentLinks.filter((link) => link.id !== linkId)
        );
        setError(null);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Ошибка при удалении ссылки.";
        setError(errorMsg);
      }
    },
    [isAuthenticated]
  );

  // Автозагрузка при изменении авторизации
  useEffect(() => {
    if (isAuthReady) {
      fetchLinks();
    }
  }, [isAuthReady, isAuthenticated, fetchLinks]);

  const value = {
    links,
    isLoading,
    error,
    createLink,
    deleteLink,
    fetchLinks,
  };

  return <LinkContext.Provider value={value}>{children}</LinkContext.Provider>;
};
