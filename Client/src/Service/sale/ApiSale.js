import axios from "../../utils/CustomizeApi";

export const getAllProductBySale = async () => {
    const response = await axios.get(`sale/getAllProductsWithSale`, { withCredentials: true });
    return response.data;
};

export const addSalePrice = async (saleData) => {
    const response = await axios.post(
        `sale/addSalePrice`,
        saleData,
        { withCredentials: true }
    );
    return response.data;
};

export const updateSalePrice = async (saleId, saleData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found. Please log in again.');
    }

    const response = await axios.put(
        `/api/sale/updateSalePrice/${saleId}`, // Truyền saleId lên URL
        saleData, // Chỉ truyền các trường khác trong body
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const deleteSale = async (saleId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found. Please log in again.');
    }

    const response = await axios.delete(
        `api/sale/deleteSale/${saleId}`,
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};