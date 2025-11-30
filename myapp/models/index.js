const sequelize = require("../db");
const User = require("./User");
const Link = require("./Link");

// УСТАНОВКА СВЯЗИ ОДИН КО МНОГИМ:
// User имеет много Links
User.hasMany(Link, {
  foreignKey: "userId", // Внешний ключ в таблице Link
  as: "links",
});

// Link принадлежит User
Link.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Синхронизация базы данных
async function syncDatabase() {
  await sequelize.sync({ alter: true });
  console.log("Database & tables created/synced!");
}

module.exports = {
  syncDatabase,
  sequelize,
  User,
  Link,
};
