const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");

// ------------------------------------------
// 1. РОУТ РЕГИСТРАЦИИ (/api/v1/register)
// ------------------------------------------
router.post(
  "/auth/register",
  // Middleware для валидации
  [
    body("username")
      .isLength({ min: 3 })
      .trim()
      .escape()
      .withMessage("Имя пользователя должно быть не менее 3 символов."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Пароль должен быть не менее 6 символов."),
  ],
  async (req, res) => {
    // Проверяем результаты валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // 1. Проверяем, существует ли пользователь
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "Пользователь с таким именем уже существует." });
      }

      // 2. Хешируем пароль (10 - это saltRounds, чем выше, тем медленнее и безопаснее)
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Создаем нового пользователя в БД
      const newUser = await User.create({
        username,
        password: hashedPassword, // Сохраняем хеш
      });

      // 4. Генерируем JWT для немедленного входа
      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        process.env.JWT_SECRET, // Наш секретный ключ из .env
        { expiresIn: "1h" } // Токен действует 1 час
      );

      // Отправляем токен клиенту
      return res.status(201).json({
        message: "Регистрация прошла успешно.",
        token,
        userId: newUser.id,
      });
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      return res.status(500).json({ message: "Внутренняя ошибка сервера." });
    }
  }
);

// ------------------------------------------
// 2. РОУТ ВХОДА (/api/v1/login)
// ------------------------------------------
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Находим пользователя по имени
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль." });
    }

    // 2. Сравниваем введенный пароль с хешем в БД
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль." });
    }

    // 3. Если пароли совпали, генерируем новый JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Отправляем токен
    return res.status(200).json({
      message: "Вход выполнен успешно.",
      token,
      userId: user.id,
    });
  } catch (error) {
    console.error("Ошибка входа:", error);
    return res.status(500).json({ message: "Внутренняя ошибка сервера." });
  }
});

module.exports = router;
