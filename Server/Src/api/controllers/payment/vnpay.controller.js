let $ = require('jquery');
const request = require('request');
const moment = require('moment');
const Transaction = require("../../models/transaction");
const Order = require("../../models/order");
const User = require("../../models/user");
const { updateOrderAndTransactionStatus, updateOrderAndTransactionStatusLogic } = require('./transaction.controller');

module.exports.createPaymentUrl = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let config = require('../../../config/default.json');

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;
    let orderId = moment(date).format('DDHHmmss');

    // Ensure orderId is a valid ObjectId by converting it to a string of 24 characters
    orderId = orderId.padStart(24, '0');

    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is missing or invalid!' });
    }

    const user = await User.findOne({ token: token });
    if (!user) {
        return res.status(401).json({ message: 'User not found!' });
    }
    const transaction = new Transaction({
        userId: user._id,
        orderId: orderId,
        amount: amount,
        paymentMethod: 'Bank Transfer',
        status: 'Pending',
        description: 'Thanh toan cho ma GD:' + orderId
    });
    await transaction.save();


    res.json({ url: vnpUrl });
    console.log({ orderID: orderId, url: vnpUrl })
}

module.exports.returnUrl = async (req, res) => {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        // Xóa hash để tạo hash mới và so sánh
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let config = require('../../../config/default.json');
        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let frontendUrl = config.frontend_url || 'http://localhost:5173';

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        // Lấy responseCode từ query params
        let responseCode = vnp_Params['vnp_ResponseCode'];
        let orderId = vnp_Params['vnp_TxnRef']; // Mã đơn hàng
        let amount = vnp_Params['vnp_Amount']; // Số tiền thanh toán
        let transactionId = vnp_Params['vnp_TransactionNo']; // Mã giao dịch VNPay

        console.log(`Received returnUrl callback with orderId: ${orderId}`);

        // Kiểm tra hash để xác thực dữ liệu
        if (secureHash === signed) {
            const paymentStatus = responseCode === '00' ? 'Completed' : 'Failed';
            await updateOrderAndTransactionStatusLogic(orderId, paymentStatus, paymentStatus);

            // Chuyển hướng về trang kết quả với thông tin thanh toán
            const paymentResult = {
                status: responseCode === '00' ? 'success' : 'failed',
                message: responseCode === '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại',
                orderId,
                amount,
                transactionId,
                responseCode,
                ...vnp_Params
            };

            const returnUrl = `${frontendUrl}/cart/returnQR?${querystring.stringify(paymentResult)}`;
            console.log("Kết quả thanh toán:", paymentResult);

            return res.redirect(returnUrl);
        } else {
            // Xác thực thất bại
            console.log("Xác thực dữ liệu thất bại!");
            return res.redirect(`${frontendUrl}/cart/returnQR?status=error&message=Xác thực dữ liệu thất bại`);
        }
    } catch (error) {
        console.error("Lỗi xử lý callback VNPay:", error);
        const frontendUrl = require('../../../config/default.json').frontend_url || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/cart/returnQR?status=error&message=Lỗi server`);
    }
};


module.exports.refund = (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let config = require('../../../config/default.json');
    let crypto = require("crypto");

    let vnp_TmnCode = config.vnp_TmnCode
    let secretKey = config.vnp_HashSecret
    let vnp_Api = config.vnp_Api

    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    let vnp_Amount = req.body.amount * 100;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;

    let currCode = 'VND';

    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

    let vnp_TransactionNo = '0';

    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex");

    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
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
        console.log(response);
    });

}

module.exports.query = (req, res) => {
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
    let vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex"); // Fixed new Buffer to Buffer.from

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
}

module.exports.vnpay_ipn = async (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let config = require('config');
    let secretKey = config.get('vnp_HashSecret');
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    console.log(`Received vnpay_ipn callback with orderId: ${orderId}`);

    if (secureHash === signed) { //kiểm tra checksum
        const paymentStatus = rspCode === '00' ? 'Completed' : 'Failed';
        await updateOrderAndTransactionStatusLogic(orderId, paymentStatus, paymentStatus);

        if (rspCode === '00') {
            //thanh cong
            res.status(200).json({ RspCode: '00', Message: 'Success' });
        } else {
            //that bai
            res.status(200).json({ RspCode: '00', Message: 'Success' });
        }
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
