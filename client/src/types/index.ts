// Типы для приложения
export interface User {
  id: number;
  username: string;
  token?: string;
}

export interface Link {
  id: number;
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  message: string;
}

export interface LinksResponse {
  links: Link[];
  count: number;
  message: string;
}

// Типы для пропсов компонентов
export interface LoginProps {
  onToggle: (isRegistering: boolean) => void;
}

export interface RegisterProps {
  onToggle: (isRegistering: boolean) => void;
}

// Типы для хуков
export interface UseAuthFormReturn {
  username: string;
  password: string;
  message: string;
  isLoading: boolean;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

// types/index.ts
export interface Link {
  id: number;
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  createdAt: string;
}

// Тип для контекста ссылок
export interface LinkContextType {
  links: Link[];
  isLoading: boolean;
  error: string | null;
  createLink: (longUrl: string) => Promise<string | null>;
  deleteLink: (linkId: number) => Promise<void>;
  fetchLinks: () => Promise<void>;
}

export interface LoginProps {
  onToggle: (isRegistering: boolean) => void;
}

export interface RegisterProps {
  onToggle: (isRegistering: boolean) => void;
}

