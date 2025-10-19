const express = require('express');
const router = express.Router();
const CartController = require('../app/controller/CartController');
const { verifyUser } = require('../config/middleware/authJWT');

router.get('/myCart',verifyUser, CartController.getMyCart);
router.post('/add',verifyUser, CartController.addToCart);
router.put('/update/:cartItemId',verifyUser, CartController.updateCartItem);
router.delete('/remove/:cartItemId',verifyUser, CartController.removeCartItem);
router.delete('/clear', verifyUser, CartController.clearCart);

module.exports = router;