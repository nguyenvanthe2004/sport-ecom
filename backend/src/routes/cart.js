const express = require('express');
const router = express.Router();
const CartController = require('../app/controller/CartController');

router.get('/getAll', CartController.getAllCarts);

module.exports = router;