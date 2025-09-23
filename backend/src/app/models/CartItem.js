const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    variantId: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
    quantity: { type: Number, required: true, default: 1 },
    createAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model('CartItem', CartItemSchema);