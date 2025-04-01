const mongoose = require("mongoose");
const randomString = require('../../helper/generateRandom')
const { Schema } = mongoose;

const discountSchema = new Schema(
    {
        code: {
            type: randomString.generateString(10),
            required: true,
            unique: true,
        },
        discountType: {
            type: String,
            enum: ["Percentage", "Fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        expirationDate: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    }, {
    timestamps: true,
}
);

module.exports = mongoose.model("Discount", discountSchema);

