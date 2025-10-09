const express = require('express');
const router = express.Router();
const BrandController = require('../app/controller/BrandController');

router.get('/getAll', BrandController.getAllBrands);
router.post('/create', BrandController.createBrand);
router.put('/update/:brandId', BrandController.updateBrand);
router.delete('/delete/:brandId', BrandController.deleteBrand);

module.exports = router;
