/**
 * Утилиты для безопасной передачи данных
 * Base64 кодирование/декодирование для передачи данных
 */

/**
 * Кодирует строку в base64
 * @param str - Исходная строка
 * @returns Закодированная строка base64 или пустая строка в случае ошибки
 */
export const encodeToBase64 = (str: string): string => {
  if (typeof str !== "string") {
    console.warn("encodeToBase64: входной параметр не является строкой");
    return "";
  }

  try {
    const bytes = new TextEncoder().encode(str);
    const binaryString = String.fromCharCode(...bytes);
    return btoa(binaryString);
  } catch (error) {
    console.error("Ошибка кодирования в base64:", error);
    return "";
  }
};

/**
 * Декодирует строку из base64
 * @param encodedStr - Закодированная строка base64
 * @returns Декодированная строка или пустая строка в случае ошибки
 */
export const decodeFromBase64 = (encodedStr: string): string => {
  if (typeof encodedStr !== "string") {
    console.warn("decodeFromBase64: входной параметр не является строкой");
    return "";
  }

  // Проверка на пустую строку
  if (!encodedStr.trim()) {
    return "";
  }

  try {
    const binaryString = atob(encodedStr);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (error) {
    console.error("Ошибка декодирования из base64:", error);
    return "";
  }
};

/**
 * Проверяет, является ли строка корректным base64
 * @param str - Строка для проверки
 * @returns true если строка является корректным base64
 */
export const isBase64 = (str: string): boolean => {
  if (typeof str !== "string") {
    return false;
  }

  // Быстрая проверка на пустую строку
  if (!str.trim()) {
    return false;
  }

  try {
    atob(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Строгая проверка формата base64 строки
 * @param str - Строка для проверки
 * @returns true если строка является валидным base64
 */
export const isValidBase64 = (str: string): boolean => {
  if (typeof str !== "string") {
    return false;
  }

  // Проверка на пустую строку
  const trimmedStr = str.trim();
  if (!trimmedStr) {
    return false;
  }

  // Длина должна быть кратной 4
  if (trimmedStr.length % 4 !== 0) {
    return false;
  }

  // Допустимые символы base64 (включая padding =)
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!base64Regex.test(trimmedStr)) {
    return false;
  }

  // Проверка декодированием
  try {
    atob(trimmedStr);
    return true;
  } catch {
    return false;
  }
};

/**
 * Безопасное кодирование объекта в base64 JSON
 * @param obj - Объект для кодирования
 * @returns Закодированная строка base64 или пустая строка в случае ошибки
 */
export const encodeObjectToBase64 = <T extends object>(obj: T): string => {
  try {
    const jsonString = JSON.stringify(obj);
    return encodeToBase64(jsonString);
  } catch (error) {
    console.error("Ошибка кодирования объекта в base64:", error);
    return "";
  }
};

/**
 * Безопасное декодирование объекта из base64 JSON
 * @param encodedStr - Закодированная строка base64
 * @param defaultValue - Значение по умолчанию при ошибке декодирования
 * @returns Декодированный объект или значение по умолчанию
 */
export const decodeObjectFromBase64 = <T>(
  encodedStr: string,
  defaultValue?: T
): T | null => {
  try {
    const decodedString = decodeFromBase64(encodedStr);
    if (!decodedString) {
      return defaultValue || null;
    }

    const parsedObject = JSON.parse(decodedString) as T;
    return parsedObject;
  } catch (error) {
    console.error("Ошибка декодирования объекта из base64:", error);
    return defaultValue || null;
  }
};

/**
 * Создает безопасную base64 строку для URL
 * @param str - Исходная строка
 * @returns Base64 строка безопасная для использования в URL
 */
export const encodeToBase64URL = (str: string): string => {
  const base64 = encodeToBase64(str);
  return base64
    .replace(/\+/g, "-") // Заменяем + на -
    .replace(/\//g, "_") // Заменяем / на _
    .replace(/=/g, ""); // Удаляем padding =
};

/**
 * Декодирует base64 URL строку
 * @param base64URL - Base64 URL строка
 * @returns Декодированная строка
 */
export const decodeFromBase64URL = (base64URL: string): string => {
  // Добавляем padding если нужно и заменяем символы обратно
  let base64 = base64URL
    .replace(/-/g, "+") // Заменяем - на +
    .replace(/_/g, "/"); // Заменяем _ на /

  // Добавляем padding если необходимо
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  return decodeFromBase64(base64);
};

/**
 * Типы для модуля base64 утилит
 */
export interface Base64Utils {
  encodeToBase64: (str: string) => string;
  decodeFromBase64: (encodedStr: string) => string;
  isBase64: (str: string) => boolean;
  isValidBase64: (str: string) => boolean;
  encodeObjectToBase64: <T extends object>(obj: T) => string;
  decodeObjectFromBase64: <T>(encodedStr: string, defaultValue?: T) => T | null;
  encodeToBase64URL: (str: string) => string;
  decodeFromBase64URL: (base64URL: string) => string;
}
