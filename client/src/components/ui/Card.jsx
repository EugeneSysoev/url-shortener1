import React from 'react';

/**
 * Компонент-контейнер для форм и блоков (белый фон, тень).
 */
const Card = ({ children, className = '', ...props }) => {
    const defaultStyles = "bg-white p-4 md:p-6 rounded-lg shadow-xl border border-gray-200";
    
    return (
        <div
            className={`${defaultStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;