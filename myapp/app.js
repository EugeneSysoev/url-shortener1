require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");

// Импорт роутеров
const { apiRouter: apiRouterV1, redirectHandler } = require("./routes/v1/api");
const authRouter = require("./routes/auth");
const { syncDatabase } = require("./models/index");

const app = express();

// Синхронизация БД
syncDatabase()
  .then(() => console.log("База данных синхронизирована"))
  .catch((error) => console.error("Ошибка синхронизации БД:", error));

// CORS middleware 
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400,
};

// Настройка CORS для разных окружений
if (process.env.NODE_ENV === "development") {
  corsOptions.origin = (origin, callback) => {
    if (!origin) return callback(null, true);
    callback(null, true);
  };
  console.log("CORS: разрешены все origins (dev mode)");
} else {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [process.env.FRONTEND_URL].filter(Boolean);

  corsOptions.origin = (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} не разрешен CORS`));
    }
  };
  console.log("CORS: strict mode for production");
}

app.use(cors(corsOptions));

// Настройка view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Основные middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API роуты
app.use("/api/v1", apiRouterV1);
app.use("/api/v1", authRouter);

// Редирект по коротким ссылкам
app.get("/:shortId", redirectHandler);

// Интеграция React SPA
const clientBuildPath = path.join(__dirname, "..", "client", "dist");

if (
  fs.existsSync(clientBuildPath) &&
  fs.existsSync(path.join(clientBuildPath, "index.html"))
) {
  // Статические файлы React
  app.use(
    express.static(clientBuildPath, {
      maxAge: process.env.NODE_ENV === "production" ? "1y" : "0",
      index: false,
    })
  );

  // SPA fallback (клиентский роутинг)
  app.use((req, res, next) => {
    // Пропускаем API запросы
    if (req.path.startsWith("/api/")) return next();

    // Пропускаем статические файлы
    if (req.path.includes(".") && !req.path.endsWith("/")) return next();

    // Пропускаем короткие ссылки
    if (req.path.match(/^\/[a-zA-Z0-9_-]+$/)) return next();

    // Для остальных GET запросов - index.html
    if (req.method === "GET") {
      return res.sendFile(path.join(clientBuildPath, "index.html"));
    }

    next();
  });

  console.log("✅ React клиент подключен");
} else {
  console.warn("⚠️ React билд не найден. Только API режим");

  app.get("/", (req, res) => {
    res.json({
      message: "API сервер работает",
      api: `${process.env.APP_BASE_URL || "http://localhost:3000"}/api/v1`,
      frontend: "Не найден. Соберите React приложение.",
    });
  });
}

// 404 обработчик
app.use((req, res, next) => {
  next(createError(404, `Не найдено: ${req.method} ${req.originalUrl}`));
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(`Ошибка ${err.status || 500}:`, err.message);

  const isDevelopment = req.app.get("env") === "development";

  if (
    req.path.startsWith("/api/") ||
    req.headers.accept?.includes("application/json")
  ) {
    res.status(err.status || 500).json({
      error: {
        message: err.message,
        status: err.status || 500,
        ...(isDevelopment && { stack: err.stack }),
      },
    });
  } else {
    res.locals.message = err.message;
    res.locals.error = isDevelopment ? err : {};
    res.status(err.status || 500).render("error");
  }
});

module.exports = app;
