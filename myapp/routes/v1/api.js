const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const authenticateToken = require("../../middleware/authMiddleware");
const { Link } = require("../../models/index");

// -----------------------------------------------------------------
// 1. РОУТ ДЛЯ СОЗДАНИЯ КОРОТКОЙ ССЫЛКИ
// -----------------------------------------------------------------
router.post("/make_link_short", authenticateToken, async (req, res) => {
  const { longUrl } = req.body;

  console.log("🔗 Backend - Creating short link:", {
    longUrl,
    userId: req.user.userId,
  });

  if (!longUrl) {
    return res.status(400).json({ message: "Требуется длинный URL." });
  }

  try {
    // Получаем userId из токена, который был добавлен в req.user
    const userIdToSave = req.user.userId;

    // !!! ЛОГ 1: Логирование ID, используемого для сохранения
    console.log(
      `[Backend Log] Создание ссылки. Используется userId: ${userIdToSave}`
    ); // 1. Генерируем короткий ID

    const shortId = nanoid(7);

    // 2. СОХРАНЯЕМ В БД И СВЯЗЫВАЕМ С ПОЛЬЗОВАТЕЛЕМ
    const newLink = await Link.create({
      shortId,
      longUrl,
      userId: userIdToSave, // Используем проверенный ID
    });

    console.log("🔗 Backend - Link created:", newLink.id);

    // 3. Возвращаем результат
    const fullShortUrl = `${req.protocol}://${req.get("host")}/${shortId}`;

    return res.json({
      status: "success",
      shortUrl: fullShortUrl,
      message: "Ссылка успешно создана и сохранена.",
    });
  } catch (error) {
    // Это может быть ошибка БД или ошибка генерации nanoid
    console.error("Ошибка при создании ссылки:", error);
    return res
      .status(500)
      .json({ message: "Ошибка сервера при сохранении ссылки." });
  }
});

// -----------------------------------------------------------------
// 2. РОУТ ДЛЯ ПОЛУЧЕНИЯ ВСЕХ ССЫЛОК ПОЛЬЗОВАТЕЛЯ (/user_links)
// -----------------------------------------------------------------
router.get("/user_links", authenticateToken, async (req, res) => {
  // Получаем userId из токена, который был добавлен в req.user нашим Middleware
  const userId = req.user.userId;

  // !!! ЛОГ 2: Логирование ID, используемого для загрузки
  console.log(
    `[Backend Log] Попытка загрузки ссылок. Используется userId: ${userId}`
  );

  try {
    // Ищем в таблице Link все записи, где userId совпадает
    const links = await Link.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });

    // !!! ЛОГ 3: Проверяем, сколько ссылок найдено
    console.log(`[Backend Log] Найдено ссылок в БД: ${links.length}`); // Форматируем результат, добавляя полный URL для удобства фронтенда

    const formattedLinks = links.map((link) => ({
      id: link.id,
      shortCode: link.shortId,
      longUrl: link.longUrl,
      shortUrl: `${req.protocol}://${req.get("host")}/${link.shortId}`,
      createdAt: link.createdAt,
    })); // Возвращаем список ссылок

    return res.json({
      links: formattedLinks,
      message: `Найдено ${links.length} ссылок для пользователя.`,
    });
  } catch (error) {
    console.error("Ошибка при получении списка ссылок:", error);
    return res
      .status(500)
      .json({ message: "Ошибка сервера при получении списка ссылок." });
  }
});

// -----------------------------------------------------------------
// 3. РОУТ ДЛЯ ПЕРЕНАПРАВЛЕНИЯ (/shortId)
// -----------------------------------------------------------------
const redirectHandler = async (req, res) => {
  const { shortId } = req.params;

  try {
    // ИЩЕМ ССЫЛКУ В БД
    const link = await Link.findOne({ where: { shortId } });

    if (!link) {
      // Если ссылка не найдена, переходим к следующему роуту (который отдаст React)
      return res.redirect("/");
    } // ПЕРЕНАПРАВЛЕНИЕ

    return res.redirect(link.longUrl);
  } catch (error) {
    console.error("Ошибка при поиске ссылки:", error);
    return res.status(500).send("Ошибка сервера при перенаправлении.");
  }
};

module.exports = {
  apiRouter: router,
  redirectHandler: redirectHandler,
};
