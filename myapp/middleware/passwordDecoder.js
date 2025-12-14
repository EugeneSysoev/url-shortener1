const validateBase64 = (str) => {
  if (typeof str !== "string") return false;

  // Проверка длины (base64 длина должна быть кратной 4)
  if (str.length % 4 !== 0) return false;

  // Проверка символов
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(str)) return false;

  // Проверка декодированием
  try {
    const decoded = Buffer.from(str, "base64").toString("utf8");
    return decoded.length > 0;
  } catch {
    return false;
  }
};

const decodeBase64Password = (req, res, next) => {
  if (req.body && req.body.password) {
    const { password } = req.body;

    // Проверяем формат
    if (!validateBase64(password)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_PASSWORD_FORMAT",
        message: "Неверный формат пароля. Ожидается base64.",
      });
    }

    try {
      const decoded = Buffer.from(password, "base64").toString("utf8");

      // Проверяем длину после декодирования
      if (decoded.length < 8) {
        return res.status(400).json({
          success: false,
          error: "PASSWORD_TOO_SHORT",
          message: "Пароль слишком короткий",
        });
      }

      // Проверяем что пароль не слишком длинный
      if (decoded.length > 128) {
        return res.status(400).json({
          success: false,
          error: "PASSWORD_TOO_LONG",
          message: "Пароль слишком длинный",
        });
      }

      console.log(`🔐 Пароль декодирован, длина: ${decoded.length} символов`);

      req.body.password = decoded;
      return next(); // ← ВАЖНО: return
    } catch (error) {
      console.error("❌ Ошибка декодирования:", error);
      return res.status(400).json({
        success: false,
        error: "DECODING_ERROR",
        message: "Ошибка при обработке пароля",
      });
    }
  } else {
    return next(); // ← ВАЖНО: return
  }
};

module.exports = decodeBase64Password;
