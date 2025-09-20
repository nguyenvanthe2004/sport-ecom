const express = require('express');
const router = express.Router();
const PaymentController = require('../app/controller/PaymentController');

router.get('/getAll', PaymentController.getAllPayments);

module.exports = router;