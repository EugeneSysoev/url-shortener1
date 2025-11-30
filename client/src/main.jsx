import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Импортируем Провайдеры из их отдельных файлов:
// 1. AuthProvider
import { AuthProvider } from './context/AuthProvider'; // Удалено расширение .jsx
// 2. LinkProvider
import { LinkProvider } from './context/LinkProvider'; // Удалено расширение .jsx

// Устанавливаем корневой элемент
const rootElement = document.getElementById('root');

// Запускаем приложение
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Оборачиваем App в провайдеры */}
    <AuthProvider>
      <LinkProvider>
        <App />
      </LinkProvider>
    </AuthProvider>
  </React.StrictMode>
);