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