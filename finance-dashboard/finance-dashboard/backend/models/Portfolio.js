const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  symbol: { type: DataTypes.STRING(10), allowNull: false },
  companyName: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
  avgBuyPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currentPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  category: {
    type: DataTypes.ENUM('Stocks', 'Mutual Funds', 'ETF', 'Crypto'),
    defaultValue: 'Stocks'
  },
}, { timestamps: true });

module.exports = Portfolio;
