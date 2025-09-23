const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: { type: [{ type: Schema.Types.ObjectId, ref: 'OrderDetails' }], default: [] },
    totalPrice: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    shipping:  { type: Number, required: true, default: 0 },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
    createAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model('Order', OrderSchema);
