const express = require('express');
const router = express.Router();
const ProductController = require('../app/controller/ProductController');
const upload = require('../config/middleware/multerConfig');
const { verifyUser, verifyAdmin } = require("../config/middleware/authJWT");


router.get('/getAll', ProductController.getAllProducts);
router.post('/create',verifyUser, verifyAdmin, ProductController.createProduct);
router.get('/slug/:slug', ProductController.getProductBySlug);
router.put('/update/:productId', ProductController.updateProduct);
router.delete('/delete/:productId', ProductController.deleteProduct);

module.exports = router;