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



  export const getAssignedOrders = async () => {
    try {
      const response = await axios.get("/sale/getAssignedOrders", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể lấy danh sách đơn hàng");
    }
  };
  
  export const acceptOrder = async (orderId) => {
    try {
      const response = await axios.post(
        "/sale/acceptOrder",
        { orderId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể chấp nhận đơn hàng");
    }
  };

  export const completeOrder = async (orderId) => {
    const response = await axios.post("/sale/completeOrder", { orderId });
    return response.data;
  };
  
  export const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        "/sale/cancelOrder",
        { orderId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể hủy đơn hàng");
    }
  };