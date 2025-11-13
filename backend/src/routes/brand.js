const express = require('express');
const router = express.Router();
const BrandController = require('../app/controller/BrandController');
const { verifyUser, verifyAdmin } = require('../config/middleware/authJWT');

router.get('/getAll', BrandController.getAllBrands);
router.get("/brand/:id", BrandController.getBrandById);
router.post('/create',verifyUser, verifyAdmin, BrandController.createBrand);
router.put('/update/:brandId', BrandController.updateBrand);
router.delete('/delete/:brandId', BrandController.deleteBrand);

module.exports = router;
