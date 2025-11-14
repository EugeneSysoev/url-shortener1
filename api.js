const express = require('express');
const { encodeBase62 } = require('./base62');
const app = express();
const PORT = 3000;

app.use(express.json());

const urlDatabase = new Map();
let globalIdCounter = 1000n;

app.post('/make_link_short', (req, res) => {
    const longUrl = req.body.longUrl;

    if (!longUrl) {
        return res.status(400).json({ status: 'error', message: 'Отсутствует longUrl' });
    }

    const newId = globalIdCounter;
    globalIdCounter = globalIdCounter + 1n;

    const shortId = encodeBase62(newId);
    urlDatabase.set(shortId, longUrl);

    const shortUrl = `http://localhost:${PORT}/${shortId}`;

    res.status(200).json({
        status: 'success',
        longUrl: longUrl,
        shortUrl: shortUrl,
        shortId: shortId
    });
});

app.get('/:shortId', (req, res) => {
    const shortId = req.params.shortId;
    const longUrl = urlDatabase.get(shortId);

    if (longUrl) {
        res.redirect(301, longUrl);
    } else {
        res.status(404).json({ status: 'error', message: 'Ссылка не найдена' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен, порт ${PORT}`);
});