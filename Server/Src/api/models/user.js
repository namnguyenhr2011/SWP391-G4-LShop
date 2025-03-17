const mongoose = require('mongoose');
const randomString = require('../../helper/generateRandom');

const userSchema = new mongoose.Schema({
    email: String,
    userName: String,
    password: String,
    phone: String,
    address: String,
    avatar: {
        type: String,
        default: "https://example.com/default-avatar.png" // Thay bằng URL thật của ảnh mặc định
    },
    token: {
        default: randomString.generateString(20),
        type: String
    },
    status: {
        type: String,
        default: "Inactive"
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'productManager', 'sale'],
        default: 'user'
    },
    deletedAt: Date
}, { timestamps: true });

const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;
