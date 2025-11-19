// myapp/routes/v1/api.js

const express = require('express');
const router = express.Router();
const { encodeBase62 } = require('../../utils/base62');

// Временное хранилище данных (должно быть заменено на БД)
const urlDatabase = new Map();
let globalIdCounter = 1000n;

// ----------------------------------------------------------------------
// 1. POST /make_link_short (Для создания короткой ссылки)
// ----------------------------------------------------------------------
router.post('/make_link_short', (req, res) => {
    const longUrl = req.body.longUrl;
    
    if (!longUrl) {
        return res.status(400).json({ status: 'error', message: 'Отсутствует longUrl' });
    }

    const newId = globalIdCounter;
    globalIdCounter = globalIdCounter + 1n;

    const shortId = encodeBase62(newId);
    urlDatabase.set(shortId, longUrl);

    // Формируем полную короткую ссылку для ответа
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

    res.status(200).json({
        status: 'success',
        shortUrl: shortUrl,
        shortId: shortId
    });
});

// ----------------------------------------------------------------------
// 2. ФУНКЦИЯ-ХЕНДЛЕР для GET /:shortId (Логика перенаправления)
// Эта функция будет подключена отдельно в app.js
// ----------------------------------------------------------------------
const redirectHandler = (req, res) => {
    const shortId = req.params.shortId;
    const longUrl = urlDatabase.get(shortId);

    if (longUrl) {
        // Код 301 - Постоянное перенаправление
        res.redirect(301, longUrl); 
    } else {
        // Если ссылка не найдена, отправляем ошибку 404
        res.status(404).json({ status: 'error', message: 'Ссылка не найдена' });
    }
};

// Экспортируем роутер для API и функцию-обработчик для перенаправления
module.exports = {
    apiRouter: router,
    redirectHandler: redirectHandler
};