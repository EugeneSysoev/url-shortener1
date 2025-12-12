import { createContext } from "react";
import { User } from "../types";

// Тип для контекста аутентификации
interface AuthContextType {
  user: User | null;
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (token: string, userId: number) => void;
  logout: () => void;
}

// Указываем дефолтные значения для удобства использования контекста.
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  userId: null,
  isAuthenticated: false,
  isAuthReady: false,
  login: () => {
    console.warn("Login function is not yet initialized.");
  },
  logout: () => {
    console.warn("Logout function is not yet initialized.");
  },
});
