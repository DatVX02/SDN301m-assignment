// models/account.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Mã hóa mật khẩu trước khi lưu vào database
accountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Account', accountSchema);
