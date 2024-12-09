const express = require('express');
const router = express.Router();
const binanceController = require('../controllers/binanceControllers');


router.post('/binanceLogin', binanceController.binanceLogin);


module.exports = router;