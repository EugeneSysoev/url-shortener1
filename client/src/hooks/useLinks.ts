import { useContext } from "react";
import { LinkContext } from "../context/LinkContext";
import { Link } from "../types";

// Тип для контекста ссылок
interface LinkContextType {
  links: Link[];
  isLoading: boolean;
  error: string | null;
  createLink: (longUrl: string) => Promise<string | null>;
  deleteLink: (linkId: number) => Promise<void>;
  fetchLinks: () => Promise<void>;
}

// Пользовательский хук для быстрого доступа к контексту ссылок
export const useLinks = (): LinkContextType => {
  const context = useContext(LinkContext) as LinkContextType;

  // Проверка на случай, если хук используется вне провайдера
  if (!context) {
    throw new Error("useLinks должен использоваться внутри LinkProvider");
  }

  return context;
};
