const express = require('express');
const router = express.Router();
const BrandController = require('../app/controller/BrandController');
const { verifyUser, verifyAdmin } = require('../config/middleware/authJWT');

router.get('/getAll', BrandController.getAllBrands);
router.post('/create',verifyUser, verifyAdmin, BrandController.createBrand);
router.put('/update/:brandId',verifyUser, verifyAdmin, BrandController.updateBrand);
router.delete('/delete/:brandId',verifyUser, verifyAdmin, BrandController.deleteBrand);

module.exports = router;
