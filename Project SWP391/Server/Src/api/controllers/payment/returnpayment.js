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
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");


        // Kiểm tra hash để xác thực dữ liệu
        if (secureHash === signed) {
            // Xác thực thành công

            // Cập nhật trạng thái đơn hàng trong database
            // Ví dụ: await OrderModel.findOneAndUpdate({ orderId }, { paymentStatus: responseCode === '00' ? 'completed' : 'failed', transactionId });

            // Lấy dữ liệu đơn hàng từ database để trả về
            // const orderData = await OrderModel.findOne({ orderId });

            // Chuyển hướng về trang kết quả với thông tin thanh toán
            const paymentResult = {
                status: responseCode === '00' ? 'success' : 'failed',
                message: responseCode === '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại',
                orderId: orderId,
                amount: amount,
                transactionId: transactionId,
                responseCode: responseCode,
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
}