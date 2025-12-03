const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");

// 1. РЕГИСТРАЦИЯ
router.post(
  "/auth/register",
  // Валидация
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Имя пользователя должно быть не менее 3 символов."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Пароль должен быть не менее 6 символов."),
  ],
  async (req, res) => {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Проверка существования пользователя
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(409).json({
          message: "Пользователь с таким именем уже существует.",
        });
      }

      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создание пользователя
      const newUser = await User.create({
        username,
        password: hashedPassword,
      });

      // Генерация JWT
      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
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

// 2. ВХОД
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Поиск пользователя
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        message: "Неверное имя пользователя или пароль.",
      });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Неверное имя пользователя или пароль.",
      });
    }

    // Генерация JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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
});

module.exports = router;
