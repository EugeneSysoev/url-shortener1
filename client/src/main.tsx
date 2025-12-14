import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { LinkProvider } from "./context/LinkProvider.tsx";

// Получаем root элемент с проверкой TypeScript
const rootElement = document.getElementById("root");

// Проверяем существование элемента перед рендером
if (!rootElement) {
  throw new Error("Root element not found");
}

// Создаем корень React и рендерим приложение
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <LinkProvider>
        <App />
      </LinkProvider>
    </AuthProvider>
  </React.StrictMode>
);
