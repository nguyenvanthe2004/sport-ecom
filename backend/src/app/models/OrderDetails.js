const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetailsSchema = new Schema({ 
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    variantId: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    createAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model('OrderDetails', OrderDetailsSchema);