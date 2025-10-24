const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentsSchema = new Schema({ 
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentMethod: { type: String, required: true, enum: ['Thanh toán khi nhận hàng', 'QR Code'], },
    createAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model('Payment', PaymentsSchema);