import React from 'react';
import { useShortener } from './useShortener';
import styles from './Shortener.module.css';

function Shortener() {
    // Получение логики из пользовательского хука
    const { 
        longUrl, 
        shortUrl, 
        error, 
        isLoading, 
        setLongUrl, 
        handleSubmit, 
        handleCopy 
    } = useShortener();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Сократитель URL</h1>
            
            {/* Форма ввода */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="Введите длинный URL здесь..."
                    required
                    className={styles.input}
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    className={styles.button}
                    disabled={isLoading} // Кнопка отключается во время загрузки
                >
                    {isLoading ? 'Сокращение...' : 'Сократить'}
                </button>
            </form>

            {/* Вывод ошибок */}
            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            {/* Вывод результата и кнопки копирования */}
            {shortUrl && (
                <div className={styles.resultContainer}>
                    <span className={styles.shortUrl}>
                        {shortUrl}
                    </span>
                    <button 
                        onClick={handleCopy} 
                        className={styles.button} 
                        style={{ marginLeft: '10px' }}
                    >
                        Копировать 📋
                    </button>
                </div>
            )}
        </div>
    );
}

export default Shortener;