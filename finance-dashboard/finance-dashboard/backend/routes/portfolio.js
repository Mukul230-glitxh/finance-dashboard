const router = require('express').Router();
const { getPortfolio, addHolding, deleteHolding } = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

router.get('/', auth, getPortfolio);
router.post('/add', auth, addHolding);
router.delete('/:id', auth, deleteHolding);

module.exports = router;
