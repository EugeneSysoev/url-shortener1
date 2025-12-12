// hooks/useAuthForm.ts
import { useState } from "react";

export interface UseAuthFormReturn {
  username: string;
  password: string;
  confirmPassword: string;
  message: string;
  isLoading: boolean;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setMessage: (value: string) => void;
  setIsLoading: (value: boolean) => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return {
    username,
    password,
    confirmPassword,
    message,
    isLoading,
    setUsername,
    setPassword,
    setConfirmPassword,
    setMessage,
    setIsLoading,
  };
};
