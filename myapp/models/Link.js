const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Link = sequelize.define("Link", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  shortId: {
    // Короткий код (Base62)
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  longUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Link;
