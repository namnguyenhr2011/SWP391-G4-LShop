import axios from "../../utils/CustomizeApi";

export const getAllProductBySale = async () => {
    const response = await axios.get(`sale/getAllProductsWithSale`, { withCredentials: true });
    return response.data;
};

export const addSalePrice = async (productId, data) => {
    const response = await axios.post(
        `sale/addSalePrice`,
        { ...data, productId }, // Gửi dữ liệu đầy đủ
        { withCredentials: true }
    );
    return response.data;
};

export const updateSalePrice = async (saleId, data) => {
    const response = await axios.put(
        `sale/updateSalePrice/${saleId}`,
        data, // Gửi object thay vì từng tham số riêng lẻ
        { withCredentials: true }
    );
    return response.data;
};
