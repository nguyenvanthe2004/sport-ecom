const Payment = require('../models/Payments');
class PaymentController {
    async getAllPayments(req, res) {
        try {
            const payments = await Payment.find().populate('userId', 'fullname').populate('productId', 'name price');
            res.status(200).json(payments);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new PaymentController();