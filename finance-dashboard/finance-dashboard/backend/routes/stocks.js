const router = require('express').Router();
const { getStockPrice, getTopStocks } = require('../controllers/stockController');

router.get('/top', getTopStocks);
router.get('/:symbol', getStockPrice);

module.exports = router;
