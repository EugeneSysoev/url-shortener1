/**
 * Утилиты для безопасной передачи данных
 * Base64 кодирование паролей перед отправкой на сервер
 */

/**
 * Кодирует строку в base64
 * @param {string} str - Исходная строка
 * @returns {string} Закодированная строка
 */
export const encodeToBase64 = (str) => {
  try {
    const bytes = new TextEncoder().encode(str);
    const binaryString = String.fromCharCode(...bytes);
    return btoa(binaryString);
  } catch (error) {
    console.error("Ошибка кодирования:", error);
    return "";
  }
};

/**
 * Декодирует строку из base64
 * @param {string} encodedStr - Закодированная строка
 * @returns {string} Декодированная строка
 */
export const decodeFromBase64 = (encodedStr) => {
  try {
    const binaryString = atob(encodedStr);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (error) {
    console.error("Ошибка декодирования:", error);
    return "";
  }
};

/**
 * Проверяет, является ли строка корректным base64
 * @param {string} str - Строка для проверки
 * @returns {boolean}
 */
export const isBase64 = (str) => {
  try {
    atob(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Строгая проверка формата base64 строки
 * @param {string} str - Строка для проверки
 * @returns {boolean}
 */
export const isValidBase64 = (str) => {
  if (typeof str !== "string") return false;

  // Длина должна быть кратной 4
  if (str.length % 4 !== 0) return false;

  // Допустимые символы base64
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!base64Regex.test(str)) return false;

  // Проверка декодированием
  try {
    atob(str);
    return true;
  } catch {
    return false;
  }
};
