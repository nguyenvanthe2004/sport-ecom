const express = require('express');
const router = express.Router();
const ProductController = require('../app/controller/ProductController');

router.get('/getAll', ProductController.getAllProducts);

module.exports = router;