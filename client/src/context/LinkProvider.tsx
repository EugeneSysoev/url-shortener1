import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { LinkContext } from "./LinkContext";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../api/apiClient";
import { Link } from "../types";

// Тип для пропсов провайдера
interface LinkProviderProps {
  children: ReactNode;
}

export const LinkProvider: React.FC<LinkProviderProps> = ({ children }) => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка ссылок пользователя
  const fetchLinks = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !isAuthReady) {
      setLinks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/user_links");
      const fetchedLinks: Link[] = response.data.links || [];
      setLinks(fetchedLinks);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Ошибка загрузки ссылок.";
      setError(errorMsg);
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthReady]);

  // Создание новой ссылки
  const createLink = useCallback(
    async (longUrl: string): Promise<string | null> => {
      if (!isAuthenticated) {
        setError("Вы не авторизованы.");
        return null;
      }

      try {
        const response = await apiClient.post("/make_link_short", { longUrl });

        // Оптимистичное обновление - добавляем сразу
        const newLink: Link = {
          id: response.data.linkId,
          shortCode: response.data.shortUrl?.split("/").pop() || "",
          longUrl,
          shortUrl: response.data.shortUrl,
          createdAt: new Date().toISOString(),
        };

        setLinks((prev) => [newLink, ...prev]);
        setError(null);

        return response.data.shortUrl;
      } catch (err: any) {
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
    async (linkId: number): Promise<void> => {
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
      } catch (err: any) {
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
