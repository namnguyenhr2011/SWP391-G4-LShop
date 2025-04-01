const mongoose = require('mongoose');

const userDiscountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    discountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount',
        required: true,
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('UserDiscount', userDiscountSchema);