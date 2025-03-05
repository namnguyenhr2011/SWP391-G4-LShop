const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionModel = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Tham chiếu tới bảng User
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order", // Tham chiếu tới bảng Order
            required: true, // Giao dịch liên quan đến đơn hàng
        },
        amount: {
            type: Number,
            required: true, // Số tiền giao dịch
        },
        paymentMethod: {
            type: String,
            enum: ["Wallet", "COD", "Bank Transfer"],
            required: true, // Phương thức thanh toán
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed", "Cancelled"],
            default: "Pending", // Trạng thái giao dịch
        },
        transactionDate: {
            type: Date,
            default: Date.now, // Ngày giao dịch
        },
        description: {
            type: String, // Mô tả thêm về giao dịch
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionModel);
