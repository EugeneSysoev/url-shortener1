import { createContext } from "react";

// Создаем контекст для управления ссылками
export const LinkContext = createContext({
  links: [],
  isLoading: false,
  error: null,
  createLink: async () => null,
  deleteLink: async () => {},
  fetchLinks: async () => {},
});

/**
 * @typedef {Object} LinkContextType
 * @property {Array} links - Массив ссылок.
 * @property {boolean} isLoading - Флаг состояния загрузки.
 * @property {string | null} error - Сообщение об ошибке.
 * @property {(longUrl: string) => Promise<string | null>} createLink - Функция для создания ссылки.
 * @property {(linkId: string) => Promise<void>} deleteLink - Функция для удаления ссылки.
 * @property {() => Promise<void>} fetchLinks - Функция для загрузки ссылок.
 */
