import axios from "../../utils/CustomizeApi";

export const getAllOrder = async () => {
    const response = await axios.get('order/getAllOrder', { withCredentials: true });
    return response.data;
};

export const createOrder = async (data) => {
    const response = await axios.post('order/createOrder', data, { withCredentials: true });
    return response.data;
};


export const updateOrder = async (id, data) => {
    const response = await axios.put(`order/updateOrder/${id}`, data, { withCredentials: true });
    return response.data;
};

export const updatePayment = async (id, data) => {
    const response = await axios.put(`order/updatePaymentStatus/${id}`, data, { withCredentials: true });
    return response.data;
};

export const create_VnPay = async (data) => {
    const response = await axios.post('payment/create_payment_url', data, { withCredentials: true });
    return response.data;
};

export const createTransaction = async (data) => {
    const response = await axios.post('payment/createTransaction', data, { withCredentials: true });
    return response.data;
};

export const getTransactionsByUserID = async () => {
    const response = await axios.get('payment/getTranByUID', { withCredentials: true });
    return response.data;
};

export const getTransactionById = async (id) => {
    const response = await axios.get(`payment/getTranByID/${id}`, { withCredentials: true });
    return response.data;
};

export const refund_VnPay = async (data) => {
    const response = await axios.post('payment/refund', data, { withCredentials: true });
    return response.data;
};

export const query_VnPay = async (data) => {
    const response = await axios.post('payment/query', data, { withCredentials: true });
    return response.data;
};

export const vnpay_ipn = async () => {
    const response = await axios.get('payment/vnpay_ipn', { withCredentials: true });
    return response.data;
};

export const updateOrderStatus = async (orderID) => {
    const response = await axios.put(`order/transaction/${orderID}`, { withCredentials: true });
    return response.data;
}
export const getOrders = async () => {
    try {
        const response = await axios.get(`order/getOrders`)
        return response;
    } catch (error) {
        console.error("❌ Error fetching orders:", error.response?.data || error.message);
        return [];
    }
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (id) => {
    try {
        const response = await axios.get(`order/getOrdersDetails/${id}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching order details:", error.response?.data || error.message);
        return null;
    }
};

export const cancelOrder = async (id) => {
    try {
        const response = await axios.put(`order/userCancelOrder/${id}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error canceling order:", error.response?.data || error.message);
        return null;
    }
};
