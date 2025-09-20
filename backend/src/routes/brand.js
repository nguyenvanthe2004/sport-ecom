const express = require('express');
const router = express.Router();
const BrandController = require('../app/controller/BrandController');

router.get('/getAll', BrandController.getAllBrands);

module.exports = router;
