const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// --- ИЗМЕНЕНИЕ ИМПОРТА ---
// Получаем apiRouter для /api/v1 и redirectHandler для /:shortId
const { apiRouter: apiRouterV1, redirectHandler } = require('./routes/v1/api'); 
const usersRouter = require('./routes/users');
// -------------------------

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 1. ПОДКЛЮЧЕНИЕ API РОУТОВ (Должны быть в начале)
app.use('/api/v1', apiRouterV1);
app.use('/users', usersRouter);


// ---------------------------------------------------------------------
// 1.5. ГЛОБАЛЬНЫЙ РОУТ ДЛЯ ПЕРЕНАПРАВЛЕНИЯ (/shortId)
// Этот роут ОБЯЗАН быть перед отдачей статики React, чтобы короткие ссылки 
// не обрабатывались как маршруты React-клиента.
// ---------------------------------------------------------------------
app.get('/:shortId', redirectHandler); 

// --- ИНТЕГРАЦИЯ REACT КЛИЕНТА ---

// 2. Настройка для отдачи статических файлов React (из папки client/dist)
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// 3. Fallback-роут: Отправляем React-приложение для всех остальных GET-запросов (/)
app.get('*', (req, res) => {
    // Если запрос не был обработан API, users или redirectHandler, он попадает сюда.
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// --- КОНЕЦ ИНТЕГРАЦИИ REACT КЛИЕНТА ---


// catch 404 and forward to error handler (Срабатывает, если ни один роут не сработал)
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;