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

export const getProductWithSaleById = async (id) => {
    if (!id) throw new Error("Product ID is required");
    try {
      const response = await axios.get(`/sale/getProductWithSaleById/${id}`, { withCredentials: true });
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch product with sale");
    }
  };

export const getAllOrdersBySaleId = async (saleId) => {
    const response = await axios.get(`sale/${saleId}/orders`, { withCredentials: true });
    return response.data;
};

export const updateOrderStatusBySaleId = async (saleId, status) => {
    const response = await axios.put(`sale/${saleId}/orders/status`, { status }, { withCredentials: true });
    return response.data;
};