import { useContext } from "react";
import { LinkContext } from "../context/LinkContext";

// Пользовательский хук для быстрого доступа к контексту ссылок
export const useLinks = () => {
  const context = useContext(LinkContext);
  console.log("🔗 useLinks - Context:", context);
  console.log("🔗 useLinks - links in context:", context?.links);
  console.log("🔗 useLinks - isLoading:", context?.isLoading);

  // Проверка на случай, если хук используется вне провайдера
  if (!context) {
    throw new Error("useLinks должен использоваться внутри LinkProvider");
  }

  return context;
};
