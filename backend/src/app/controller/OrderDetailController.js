const OrderDetail = require('../models/OrderDetails');

class OrderDetailController {
    async getAllOrderDetails(req, res) {
        try {
            const orderDetails = await OrderDetail.find().populate('orderId', 'userId').populate('productId', 'name price');
            res.status(200).json(orderDetails);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new OrderDetailController();