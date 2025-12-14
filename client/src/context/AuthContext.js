import { createContext } from 'react';

// Указываем дефолтные значения для удобства использования контекста.
export const AuthContext = createContext({
    token: null,
    userId: null,
    isAuthenticated: false,
    isAuthReady: false,
    login: () => { console.warn("Login function is not yet initialized."); },
    logout: () => { console.warn("Logout function is not yet initialized."); },
    db: null,
});