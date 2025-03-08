const Transaction = require("../../models/transaction");
const Order = require("../../models/order");
const moment = require("moment");
const crypto = require("crypto");
const request = require("request");
const config = require("../../../config/default.json");
const User = require("../../models/user");

// Tạo giao dịch mới
module.exports.createTransaction = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ code: 401, message: 'Token is missing or invalid!' });
        }

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }
        const { orderId, amount, paymentMethod, paymentStatus, description } = req.body;
        const transaction = new Transaction({ userId: user._id, orderId, amount, paymentMethod, paymentStatus, description });
        await transaction.save();
        res.status(200).json({ code: 200, transaction });
    } catch (error) {
        res.status(400).json({ code: 400, error: error.message });
    }
};

// Lấy danh sách giao dịch
module.exports.getTransactionsByUserID = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }
        const userId = user._id;
        const transactions = await Transaction.find({ userId })
            .populate("userId")
            .populate({ path: "orderId", model: "Order" })
            .exec();

        res.status(200).json({ code: 200, transactions });
    } catch (error) {
        res.status(500).json({ code: 500, error: error.message });
    }
};

// Lấy giao dịch theo ID và truy vấn VNPay
module.exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
        if (!transaction) return res.status(404).json({ message: "Giao dịch không tồn tại" });
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let moment = require('moment'); // Added missing moment require

        let config = require('../../../config/default.json');
        let crypto = require("crypto");
        let request = require('request'); // Added missing request require

        let vnp_TmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnp_Api = config.vnp_Api;

        let vnp_TxnRef = req.body.orderId;
        // Use current date formatted as YYYYMMDD instead of requiring transDate
        let vnp_TransactionDate = moment(date).format('YYYYMMDD');

        let vnp_RequestId = moment(date).format('HHmmss');
        let vnp_Version = '2.1.0';
        let vnp_Command = 'querydr';
        let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

        let vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

        let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

        let hmac = crypto.createHmac("sha512", secretKey);
        let vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex"); 

        let dataObj = {
            'vnp_RequestId': vnp_RequestId,
            'vnp_Version': vnp_Version,
            'vnp_Command': vnp_Command,
            'vnp_TmnCode': vnp_TmnCode,
            'vnp_TxnRef': vnp_TxnRef,
            'vnp_OrderInfo': vnp_OrderInfo,
            'vnp_TransactionDate': vnp_TransactionDate,
            'vnp_CreateDate': vnp_CreateDate,
            'vnp_IpAddr': vnp_IpAddr,
            'vnp_SecureHash': vnp_SecureHash
        };

        request({
            url: vnp_Api,
            method: "POST",
            json: true,
            body: dataObj
        }, function (error, response, body) {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Response:', body);
            return res.status(200).json(body);
        });
    } catch (error) {
        res.status(500).json({ code: 500, error: error.message });
    }
};

// Function to update order and transaction status
const updateOrderAndTransactionStatus = async (orderId, orderStatus, transactionStatus) => {
    console.log(`Updating order and transaction status for orderId: ${orderId}`);
    
    const order = await Order.findByIdAndUpdate(orderId, { status: orderStatus }, { new: true });
    if (!order) {
        console.error(`Order not found for orderId: ${orderId}`);
        throw new Error('Order not found!');
    }

    const transaction = await Transaction.findOneAndUpdate({ orderId }, { status: transactionStatus }, { new: true });
    if (!transaction) {
        console.error(`Transaction not found for orderId: ${orderId}`);
        throw new Error('Transaction not found!');
    }

    return { order, transaction };
};

// Cập nhật trạng thái đơn hàng và giao dịch
module.exports.updateOrderAndTransactionStatus = async (req, res) => {
    try {
        const { orderId, orderStatus, transactionStatus } = req.body;
        console.log(`Received request to update order and transaction status for orderId: ${orderId}`);
        if (!orderId) {
            throw new Error('Order ID is missing in the request');
        }
        const result = await updateOrderAndTransactionStatus(orderId, orderStatus, transactionStatus);
        res.status(200).json({ code: 200, ...result });
    } catch (error) {
        console.error(`Error updating order and transaction status: ${error.message}`);
        res.status(500).json({ code: 500, error: error.message });
    }
};

// Export the function for use in other controllers
module.exports.updateOrderAndTransactionStatusLogic = updateOrderAndTransactionStatus;
