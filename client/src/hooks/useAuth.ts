import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User } from "../types";

// Тип для контекста аутентификации
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (token: string, userId: number) => void;
  logout: () => void;
}

// Пользовательский хук для быстрого доступа к контексту аутентификации
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext) as AuthContextType;

  // Проверка на случай, если хук используется вне провайдера
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }

  return context;
};
