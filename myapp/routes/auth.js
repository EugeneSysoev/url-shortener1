const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const decodeBase64Password = require("../middleware/passwordDecoder");
const rateLimit = require("express-rate-limit");

// Ограничение запросов для аутентификации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Слишком много попыток. Попробуйте через 15 минут.",
  },
  skipSuccessfulRequests: true,
  handler: (req, res, next, options) => {
    console.log(`🚫 Rate limit сработал для IP: ${req.ip}`);
    console.log(`🚫 Путь: ${req.path}`);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Санитизация имени пользователя
 */
const sanitizeUsername = (username) => {
  return username.trim().toLowerCase();
};

// Валидаторы для регистрации
const registerValidators = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Имя пользователя: 3-30 символов")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Только латинские буквы, цифры и _"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Пароль должен быть не менее 8 символов")
    .matches(/\d/)
    .withMessage("Пароль должен содержать хотя бы одну цифру")
    .matches(/[a-z]/)
    .withMessage("Пароль должен содержать хотя бы одну строчную букву")
    .matches(/[A-Z]/)
    .withMessage("Пароль должен содержать хотя бы одну заглавную букву")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Пароль должен содержать хотя бы один специальный символ")
    .not()
    .matches(/password|123456|qwerty|admin|test/i)
    .withMessage("Пароль слишком простой"),
];

// 1. РЕГИСТРАЦИЯ
router.post(
  "/auth/register",
  authLimiter,
  decodeBase64Password,
  ...registerValidators, // ← Spread оператор
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const sanitizedUsername = sanitizeUsername(username);
      const existingUser = await User.findOne({
        where: { username: sanitizedUsername },
      });

      if (existingUser) {
        console.log(
          `🔐 Регистрация отклонена: имя ${sanitizedUsername} уже занято`
        );
        return res.status(409).json({
          message: "Пользователь с таким именем уже существует.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username: sanitizedUsername,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log(
        `✅ Новый пользователь: ${sanitizedUsername}, ID: ${newUser.id}`
      );

      return res.status(201).json({
        message: "Регистрация прошла успешно.",
        token,
        userId: newUser.id,
      });
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      return res.status(500).json({
        message: "Внутренняя ошибка сервера.",
      });
    }
  }
);

// 2. ВХОД (без сложной валидации, только базовые проверки)
router.post(
  "/auth/login",
  authLimiter,
  decodeBase64Password,
  async (req, res) => {
    const { username, password } = req.body;

    // Базовая валидация
    if (!username || !password) {
      return res.status(400).json({
        message: "Требуется имя пользователя и пароль.",
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        message: "Имя пользователя: 3-30 символов.",
      });
    }

    try {
      const sanitizedUsername = sanitizeUsername(username);
      const user = await User.findOne({
        where: { username: sanitizedUsername },
      });

      if (!user) {
        console.log(
          `🔐 Вход отклонен: пользователь ${sanitizedUsername} не найден`
        );
        return res.status(401).json({
          message: "Неверное имя пользователя или пароль.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log(
          `🔐 Вход отклонен: неверный пароль для ${sanitizedUsername}`
        );
        return res.status(401).json({
          message: "Неверное имя пользователя или пароль.",
        });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log(`✅ Успешный вход: ${sanitizedUsername}, ID: ${user.id}`);

      return res.status(200).json({
        message: "Вход выполнен успешно.",
        token,
        userId: user.id,
      });
    } catch (error) {
      console.error("Ошибка входа:", error);
      return res.status(500).json({
        message: "Внутренняя ошибка сервера.",
      });
    }
  }
);

module.exports = router;
