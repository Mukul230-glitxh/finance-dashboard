const axios = require('axios');

// Mock data for demo — replace with Alpha Vantage for real prices
const mockStocks = {
  AAPL:     { price: 189.25, change: 1.23,   changePercent: 0.65,  name: 'Apple Inc.' },
  GOOGL:    { price: 141.80, change: -0.95,  changePercent: -0.67, name: 'Alphabet Inc.' },
  MSFT:     { price: 415.32, change: 3.15,   changePercent: 0.76,  name: 'Microsoft Corp.' },
  TSLA:     { price: 248.50, change: -5.20,  changePercent: -2.05, name: 'Tesla Inc.' },
  AMZN:     { price: 185.07, change: 2.40,   changePercent: 1.31,  name: 'Amazon.com Inc.' },
  RELIANCE: { price: 2485.60, change: 12.50, changePercent: 0.51,  name: 'Reliance Industries' },
  TCS:      { price: 3890.45, change: -22.30, changePercent: -0.57, name: 'Tata Consultancy' },
  INFY:     { price: 1456.80, change: 8.90,  changePercent: 0.61,  name: 'Infosys Ltd.' },
  WIPRO:    { price: 456.30, change: -3.45,  changePercent: -0.75, name: 'Wipro Ltd.' },
  HDFC:     { price: 1678.90, change: 15.20, changePercent: 0.91,  name: 'HDFC Bank Ltd.' },
};

exports.getStockPrice = async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    // If Alpha Vantage key is set, use real data
    if (process.env.ALPHA_VANTAGE_API_KEY) {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${upperSymbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
      const { data } = await axios.get(url);
      const quote = data['Global Quote'];
      if (quote && quote['05. price']) {
        return res.json({
          symbol: upperSymbol,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent']),
          name: upperSymbol
        });
      }
    }

    // Fallback to mock data
    const stock = mockStocks[upperSymbol];
    if (!stock) return res.status(404).json({ message: `Stock ${upperSymbol} not found` });
    res.json({ symbol: upperSymbol, ...stock });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTopStocks = async (req, res) => {
  try {
    const stocks = Object.entries(mockStocks).map(([symbol, data]) => ({ symbol, ...data }));
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
