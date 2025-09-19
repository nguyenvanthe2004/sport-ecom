const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    fullname: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createAt: { type: Date, default: Date.now },
})