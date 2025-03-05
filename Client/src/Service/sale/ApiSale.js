import axios from "../../utils/CustomizeApi";

export const getAllProductBySale = async () => {
    const response = await axios.get(`sale/getAllProductsWithSale`, { withCredentials: true });
    return response.data;
};
