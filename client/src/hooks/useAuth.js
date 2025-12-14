import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 

// Пользовательский хук для быстрого доступа к контексту аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Проверка на случай, если хук используется вне провайдера
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }

  return context;
};
