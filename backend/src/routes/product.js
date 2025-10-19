const express = require('express');
const router = express.Router();
const ProductController = require('../app/controller/ProductController');
const upload = require('../config/middleware/multerConfig');
const { verifyUser, verifyAdmin } = require("../config/middleware/authJWT");


router.get('/getAll', ProductController.getAllProducts);
router.post('/create',verifyUser, verifyAdmin, ProductController.createProduct);

module.exports = router;