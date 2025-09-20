const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Category', CategorySchema);