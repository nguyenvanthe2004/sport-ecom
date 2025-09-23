const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

class CartController {
    async getAllCarts(req, res) {
        try {
            const carts = await Cart.find().populate('userId', 'fullname').populate('productId', 'name price');
            res.status(200).json(carts);
        }

        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}   
module.exports = new CartController();