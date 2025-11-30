// Загрузка переменных окружения из .env файла
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors"); //  ДОБАВИЛ CORS

// --- ИМПОРТ РОУТОВ ---
const { apiRouter: apiRouterV1, redirectHandler } = require("./routes/v1/api");
const authRouter = require("./routes/auth");
const { syncDatabase } = require("./models/index");
// -------------------------

const app = express();

// --- СИНХРОНИЗАЦИЯ БАЗЫ ДАННЫХ ---
syncDatabase();
// -----------------------------

//  CORS MIDDLEWARE (ДОБАВЬ ПЕРВЫМ)
app.use(
  cors({
    origin: "http://localhost:5173", // URL твоего фронтенда
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Просмотр настроек
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//  1. РОУТЫ API V1
app.use("/api/v1", apiRouterV1);
app.use("/api/v1", authRouter);

//  РОУТ ДЛЯ ПЕРЕНАПРАВЛЕНИЯ ПО КОРОТКОЙ ССЫЛКЕ
//  Этот роут должен быть после всех остальных роутов API
app.get("/:shortId", redirectHandler);

// --- ИНТЕГРАЦИЯ REACT КЛИЕНТА ---

// 2. Статические файлы React-приложения
const clientBuildPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientBuildPath));

// 3. Обработка всех остальных маршрутов - отправка index.html
app.use((req, res, next) => {
  // Если запрос не был обработан ранее ни одним API-роутом
  // и не был перехвачен redirectHandler, отдаем index.html.
  if (req.method === "GET") {
    // Применяем только к GET-запросам
    return res.sendFile(path.join(clientBuildPath, "index.html"));
  }
  // Для других методов (POST, PUT и т.д.) пропускаем к 404
  next();
});

// --- КОНЕЦ ИНТЕГРАЦИИ REACT КЛИЕНТА ---

//  Перехват 404 и передача обработчику ошибок
app.use(function (req, res, next) {
  next(createError(404));
});

// Обработчик ошибок
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Отобразить страницу ошибки
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
