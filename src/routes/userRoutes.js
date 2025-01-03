const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')


router.post('/consult_user', userController.consult_user);


module.exports = router;


