import axios from "../../utils/CustomizeApi";

<<<<<<< HEAD

=======
>>>>>>> duc
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

<<<<<<< HEAD

export const create_VnPay = async (data) => {
    const response = await axios.post('payment/create_payment_url', data, { withCredentials: true });
    return response.data;
};
=======
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
>>>>>>> duc
