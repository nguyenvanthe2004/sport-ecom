const express = require('express');
const router = express.Router();
const OrderController = require('../app/controller/OrderController');

router.get('/getAll', OrderController.getAllOrders);

module.exports = router;
