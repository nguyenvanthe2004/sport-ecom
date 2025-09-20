const Order = require('../models/Orders');

class OrderController {
    async getAllOrders(req, res) {
        try {
            const orders = await Order.find().populate('userId', 'fullname').populate('productId', 'name price');
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new OrderController();