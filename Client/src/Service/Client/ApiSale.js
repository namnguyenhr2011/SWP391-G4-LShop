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
    const response = await axios.put(`/sale/updateSalePrice/${saleId}`, saleData, { withCredentials: true });
    return response.data;
};

export const deleteSale = async (saleId) => {
    const response = await axios.delete(`/sale/deleteSale/${saleId}`, { withCredentials: true });
    return response.data;
};

export const getProductWithSaleID = async () => {
    const response = await axios.get(`/sale/productWithSaleID`, { withCredentials: true });
    return response.data;
}

export const getProductWithSaleById = async () => {
    const response = await axios.get(`/sale/getProductWithSaleById/${id}`, { withCredentials: true });
    return response.data;
}