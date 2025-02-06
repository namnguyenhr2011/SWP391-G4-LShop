const mongoose = require('mongoose');
const randomString = require('../../helper/generateRandom')
const userSchema = new mongoose.Schema({
    email: String,
    userName: String,
    password: String,
    phone: String,
    address:String, 
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
        enum: ['admin', 'user', 'productManager', 'shipManager','saleManager'],  
        default: 'user'           
    },
    deletedAt: Date
},
    {
        timestamps: true
    })

const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;