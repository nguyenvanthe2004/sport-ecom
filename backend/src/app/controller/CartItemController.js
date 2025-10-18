const CartItem = require('../models/CartItem');

class CartItemController {
  async getAllCartItems(req, res) {
    try {
      const items = await CartItem.find()
        .populate('variantId', 'name price color size') // populate variant
        .sort({ createAt: -1 });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CartItemController();
