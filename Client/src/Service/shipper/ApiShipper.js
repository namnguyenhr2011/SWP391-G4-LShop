import axios from "../../utils/CustomizeApi";

export const acceptOrder = async (orderId) => {
    try {
        const response = await axios.post(
            "/shipper/acceptOrder",
            { orderId },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Không thể chấp nhận đơn hàng");
    }
};

export const completeOrder = async (orderId) => {
    const response = await axios.post("/shipper/completeOrder", { orderId });
    return response.data;
};

export const cancelOrder = async (orderId) => {
    try {
        const response = await axios.post(
            "/shipper/cancelOrder",
            { orderId },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Không thể hủy đơn hàng");
    }
};