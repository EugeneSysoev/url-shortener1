import React from 'react';

// Переиспользуемый компонент кнопки 
const baseStyles = "font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";

/**
 * @param {string} variant - 'primary' (Синий) или 'secondary' (Зеленый)
 * @param {boolean} fullWidth - Ширина 100%
 * @param {boolean} isLoading - Состояние загрузки
 */
const Button = ({ children, variant = 'primary', fullWidth = false, isLoading = false, className = '', ...props }) => {
    
    let variantStyles;
    
    // Определение стилей в зависимости от варианта кнопки
    switch (variant) {
        case 'secondary':
            // Зеленый цвет для регистрации/дополнительных действий
            variantStyles = 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500';
            break;
        case 'danger':
            // Красный цвет для удаления
            variantStyles = 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500';
            break;
        case 'light':
            // Светлый фон для вспомогательных действий
            variantStyles = 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300';
            break;
        case 'text':
            // Прозрачный фон для переключения форм
            variantStyles = 'bg-transparent text-blue-600 hover:text-blue-800 shadow-none p-0';
            break;
        case 'primary':
        default:
            // Синий цвет для основного действия (Вход, Сократить)
            variantStyles = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
            break;
    }
    
    // Определение стилей для ширины и состояния загрузки
    const widthStyle = fullWidth ? 'w-full' : '';
    const loadingStyle = isLoading ? 'opacity-70 cursor-not-allowed' : '';

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${widthStyle} ${loadingStyle} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? 'Загрузка...' : children}
        </button>
    );
};

export default Button;