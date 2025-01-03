const express = require('express');
const router = express.Router();
const binanceController = require('../controllers/binanceControllers');

const userController = require('../controllers/userController')

router.post('/binanceLogin', binanceController.binanceLogin);

router.post('/consult_user', userController.consult_user);


module.exports = router;