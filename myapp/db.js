const { Sequelize } = require("sequelize");

// Инициализация Sequelize с использованием SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false, // Отключаем логирование SQL-запросов
});

module.exports = sequelize;
