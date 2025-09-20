const express = require('express');
const router = express.Router();
const OrderDetailController = require('../app/controller/OrderDetailController');

router.get('/getAll', OrderDetailController.getAllOrderDetails);

module.exports = router;