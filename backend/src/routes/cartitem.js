const express = require('express');
const router = express.Router();
const CartItemController = require('../app/controller/CartItemController');

router.get('/getAll', CartItemController.getAllCartItems);

module.exports = router;