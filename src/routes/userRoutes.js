const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')


router.post('/consultUser', userController.consultUser);
router.post('/login', userController.login);
router.post('/registerUser', userController.registerUser);
router.post('/updateUser', userController.updateUser);


module.exports = router;


