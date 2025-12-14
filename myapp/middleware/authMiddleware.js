const jwt = require("jsonwebtoken");

/**
 * Middleware для проверки валидности JWT токена
 * и добавления данных пользователя (userId) в объект запроса (req).
 */
const authenticateToken = (req, res, next) => {
  // 1. Получаем токен из заголовка Authorization
  // Заголовок выглядит как: Authorization: Bearer <TOKEN>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Извлекаем токен после "Bearer" // 2. Проверка наличия токена

  if (token == null) {
    // 401 Unauthorized - токен отсутствует
    return res
      .status(401)
      .json({ message: "Доступ запрещен. Требуется токен." });
  } // 3. Верификация токена // Используем секретный ключ из .env

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // 4. Проверка на ошибку или истечение срока действия
    if (err) {
      // 403 Forbidden - токен невалиден или истёк
      return res
        .status(403)
        .json({ message: "Токен недействителен или истёк." });
    } // 5. Токен валиден: сохраняем данные пользователя в req.user

    // !!! ИЗМЕНЕНИЕ ДЛЯ НАДЕЖНОСТИ: Убеждаемся, что req.user содержит поле userId.
    // Если в payload токена ID назван 'id' или 'user_id', мы переназначаем его на 'userId'.
    const finalUserId = user.userId; // Просто используем userId

    if (!finalUserId) {
      console.error("JWT payload не содержит поля userId. Payload:", user);
      return res.status(403).json({
        message: "Не удалось идентифицировать пользователя из токена.",
      });
    }

    req.user = {
      ...user,
      userId: finalUserId,
    };

    // Логирование для отладки
    console.log(
      `[AuthMiddleware] Пользователь успешно идентифицирован: ${finalUserId}`
    ); // 6. Передаем управление следующему Middleware или роуту

    next();
  });
};

module.exports = authenticateToken;
