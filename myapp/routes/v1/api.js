const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const authenticateToken = require("../../middleware/authMiddleware");
const { Link } = require("../../models/index");

// 1. СОЗДАНИЕ КОРОТКОЙ ССЫЛКИ
router.post("/make_link_short", authenticateToken, async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: "Требуется длинный URL." });
  }

  try {
    const userId = req.user.userId;
    const shortId = nanoid(7);

    const newLink = await Link.create({
      shortId,
      longUrl,
      userId,
    });

    const fullShortUrl = `${req.protocol}://${req.get("host")}/${shortId}`;

    return res.status(201).json({
      success: true,
      shortUrl: fullShortUrl,
      linkId: newLink.id,
      link: {
        id: newLink.id,
        shortCode: shortId,
        longUrl: newLink.longUrl,
        shortUrl: fullShortUrl,
        createdAt: newLink.createdAt,
      },
      message: "Ссылка успешно создана и сохранена.",
    });
  } catch (error) {
    console.error("Ошибка при создании ссылки:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при сохранении ссылки.",
    });
  }
});

// 2. ПОЛУЧЕНИЕ ССЫЛОК ПОЛЬЗОВАТЕЛЯ
router.get("/user_links", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const links = await Link.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]], // Сортировка на бэкенде
    });

    const formattedLinks = links.map((link) => ({
      id: link.id,
      shortCode: link.shortId,
      longUrl: link.longUrl,
      shortUrl: `${req.protocol}://${req.get("host")}/${link.shortId}`,
      createdAt: link.createdAt,
    }));

    return res.json({
      success: true,
      links: formattedLinks,
      count: links.length,
      message: `Найдено ${links.length} ссылок для пользователя.`,
    });
  } catch (error) {
    console.error("Ошибка при получении списка ссылок:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении списка ссылок.",
    });
  }
});

// 3. УДАЛЕНИЕ ССЫЛКИ
router.delete("/links/:linkId", authenticateToken, async (req, res) => {
  const { linkId } = req.params;
  const userId = req.user.userId;

  try {
    const link = await Link.findOne({
      where: {
        id: linkId,
        userId, // Проверка владельца
      },
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Ссылка не найдена или у вас нет прав на её удаление.",
      });
    }

    await link.destroy();

    return res.json({
      success: true,
      message: "Ссылка успешно удалена.",
    });
  } catch (error) {
    console.error("Ошибка при удалении ссылки:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при удалении ссылки.",
    });
  }
});

// 4. ПЕРЕНАПРАВЛЕНИЕ ПО КОРОТКОЙ ССЫЛКЕ
const redirectHandler = async (req, res) => {
  const { shortId } = req.params;

  try {
    const link = await Link.findOne({ where: { shortId } });

    if (!link) {
      // Если ссылка не найдена - на главную React приложения
      return res.redirect("/");
    }

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