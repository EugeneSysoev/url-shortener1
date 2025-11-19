import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3000/api/v1/make_link_short';

export const useShortener = () => {
    // Состояния: длинный URL, короткий URL, ошибка, состояние загрузки
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Обработчик отправки формы
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setShortUrl('');
        setIsLoading(true);

        if (!longUrl) {
            setError('Пожалуйста, введите URL для сокращения.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ longUrl: longUrl }),
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setShortUrl(data.shortUrl);
            } else {
                setError(data.message || 'Ошибка сокращения ссылки на сервере.');
            }
        } catch (err) { 
            console.error('API connection error:', err); 
            setError('Не удалось подключиться к API сервера. Проверьте, запущен ли Express.');
        } finally {
            setIsLoading(false);
        }
    }, [longUrl]); // Зависимость от longUrl

    // Обработчик кнопки копирования
    const handleCopy = useCallback(() => {
        if (shortUrl) {
            navigator.clipboard.writeText(shortUrl);
            alert('Ссылка скопирована!');
        }
    }, [shortUrl]);

    return {
        longUrl,
        shortUrl,
        error,
        isLoading,
        setLongUrl, // Функция для обновления поля ввода
        handleSubmit,
        handleCopy,
    };
};