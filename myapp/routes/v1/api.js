const express = require('express');
const router = express.Router();
const { encodeBase62 } = require('../../utils/base62');

const urlDatabase = new Map();
let globalIdCounter = 1000n;

router.post('/make_link_short', (req, res) => {
    const longUrl = req.body.longUrl;
    
    if (!longUrl) {
        return res.status(400).json({ status: 'error', message: 'Отсутствует longUrl' });
    }

    const newId = globalIdCounter;
    globalIdCounter = globalIdCounter + 1n;

    const shortId = encodeBase62(newId);
    urlDatabase.set(shortId, longUrl);

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

    res.status(200).json({
        status: 'success',
        shortUrl: shortUrl,
        shortId: shortId
    });
});

router.get('/:shortId', (req, res) => {
    const shortId = req.params.shortId;
    const longUrl = urlDatabase.get(shortId);

    if (longUrl) {
        // Код 301 - Постоянное перенаправление
        res.redirect(301, longUrl); 
    } else {
        res.status(404).json({ status: 'error', message: 'Ссылка не найдена' });
    }
});

module.exports = router;