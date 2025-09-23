const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentsSchema = new Schema({ 
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payment_method: { type: String, required: true },
    createAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model('Payment', PaymentsSchema);