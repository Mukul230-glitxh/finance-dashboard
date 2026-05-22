const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  symbol: { type: DataTypes.STRING(10), allowNull: false },
  type: { type: DataTypes.ENUM('BUY', 'SELL'), allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
}, { timestamps: true });

module.exports = Transaction;
