const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    fullname: { type: String, required: true },
    address: { type: String },
    phone: { type: Number },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model('User', UserSchema);