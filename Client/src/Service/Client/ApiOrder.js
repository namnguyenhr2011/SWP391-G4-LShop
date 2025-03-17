import axios from '../../utils/CustomizeApi';


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


// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(API_URL, orderData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error creating order:", error.response?.data || error.message);
        return null;
    }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/update-status/${id}`, { status }, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error updating order status:", error.response?.data || error.message);
        return null;
    }
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (id, paymentStatus, paymentMethod) => {
    try {
        const response = await axios.put(`${API_URL}/update-payment/${id}`, { paymentStatus, paymentMethod }, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error updating payment status:", error.response?.data || error.message);
        return null;
    }
};

// Hủy đơn hàng
export const cancelOrder = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/cancel/${id}`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error canceling order:", error.response?.data || error.message);
        return null;
    }
};

// Lấy tất cả đơn hàng (cho Admin)
export const getAllOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching all orders:", error.response?.data || error.message);
        return [];
    }
};
