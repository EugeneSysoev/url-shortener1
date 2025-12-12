import { createContext } from "react";
import { Link } from "../types";

// Тип для контекста ссылок
export interface LinkContextType {
  links: Link[];
  isLoading: boolean;
  error: string | null;
  createLink: (longUrl: string) => Promise<string | null>;
  deleteLink: (linkId: number) => Promise<void>;
  fetchLinks: () => Promise<void>;
}

// Создаем контекст для управления ссылками
export const LinkContext = createContext<LinkContextType>({
  links: [],
  isLoading: false,
  error: null,
  createLink: async () => null,
  deleteLink: async () => {},
  fetchLinks: async () => {},
});
