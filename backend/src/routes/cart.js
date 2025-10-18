const express = require('express');
const router = express.Router();
const CartController = require('../app/controller/CartController');
const { verifyUser } = require('../config/middleware/authJWT');

router.get('/myCart', CartController.getMyCart);
router.post('/add',verifyUser, CartController.addToCart);
router.put('/update/:cartItemId', CartController.updateCartItem);
router.delete('/remove/:cartItemId',verifyUser, CartController.removeCartItem);
router.delete('/clear', CartController.clearCart);

module.exports = router;