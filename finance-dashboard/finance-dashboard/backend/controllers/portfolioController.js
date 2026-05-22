const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

exports.getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.findAll({ where: { userId: req.user.id } });

    const totalInvested = holdings.reduce(
      (sum, h) => sum + parseFloat(h.avgBuyPrice) * parseFloat(h.quantity), 0
    );
    const currentValue = holdings.reduce(
      (sum, h) => sum + parseFloat(h.currentPrice) * parseFloat(h.quantity), 0
    );
    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested > 0
      ? ((profitLoss / totalInvested) * 100).toFixed(2)
      : 0;

    res.json({
      holdings,
      summary: { totalInvested, currentValue, profitLoss, profitLossPercent }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addHolding = async (req, res) => {
  try {
    const { symbol, companyName, quantity, buyPrice, category } = req.body;
    const existing = await Portfolio.findOne({ where: { userId: req.user.id, symbol } });

    if (existing) {
      const totalQty = parseFloat(existing.quantity) + parseFloat(quantity);
      const newAvg = (
        (parseFloat(existing.avgBuyPrice) * parseFloat(existing.quantity)) +
        (parseFloat(buyPrice) * parseFloat(quantity))
      ) / totalQty;
      await existing.update({
        quantity: totalQty,
        avgBuyPrice: newAvg.toFixed(2),
        currentPrice: buyPrice
      });
    } else {
      await Portfolio.create({
        userId: req.user.id,
        symbol,
        companyName,
        quantity,
        avgBuyPrice: buyPrice,
        currentPrice: buyPrice,
        category: category || 'Stocks'
      });
    }

    await Transaction.create({
      userId: req.user.id,
      symbol,
      type: 'BUY',
      quantity,
      price: buyPrice,
      total: (parseFloat(buyPrice) * parseFloat(quantity)).toFixed(2)
    });

    res.status(201).json({ message: 'Holding added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteHolding = async (req, res) => {
  try {
    const deleted = await Portfolio.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Holding not found' });
    res.json({ message: 'Holding removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
