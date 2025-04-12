import axios from "../../utils/CustomizeApi"

export const getAllDiscounts = async () => {
    const response = await axios.get(`discount/getAllDiscount`, { withCredentials: true });
    return response.data;
};

export const adminGetAllDiscounts = async () => {
    const response = await axios.get(`discount/adminGetAllDiscount`, { withCredentials: true });
    return response.data;
}

export const getDiscountById = async (discountId) => {
    const response = await axios.get(`discount/getDiscountById/${discountId}`, { withCredentials: true });
    return response.data;
}
export const createDiscount = async (data) => {
    const response = await axios.post(`discount/createDiscount`, data, { withCredentials: true });
    return response.data;
};

export const updateDiscount = async (discountId, values) => {
    const response = await axios.put(`discount/updateDiscount/${discountId}`, values, { withCredentials: true });
    return response.data;
}

export const deleteDiscount = async (id) => {
    const response = await axios.delete(`discount/deleteDiscount/${id}`, { withCredentials: true });
    return response.data;
};

export const assignDiscount = async (discountId) => {
    const response = await axios.post(`discount/assignDiscount/${discountId}`, { withCredentials: true });
    return response.data;
}

export const unassignDiscount = async (discountId) => {
    const response = await axios.delete(`discount/unassignDiscount/${discountId}`, { withCredentials: true });
    return response.data;
}

export const changeDiscountStatus = async (discountId) => {
    const response = await axios.put(`discount/discountStatus/${discountId}`, { withCredentials: true });
    return response.data;
}

export const getDiscountByUser = async () => {
    const response = await axios.get(`discount/getDiscountByUser`, { withCredentials: true });
    return response.data;
}

export const addWithdrawDiscount = async (withdrawalNumber) => {
    const response = await axios.post(`discount/addWithdrawalNumber`, { withdrawalNumber }, { withCredentials: true });
    return response;
}

export const getAllUserHaveDiscount = async () => {
    const response = await axios.get(`discount/getAllUseHaveDiscount`, { withCredentials: true });
    return response.data;
  };
  
  export const getUserDiscountActivity = async () => {
    const response = await axios.get(`discount/getUserDiscountActivity`, { withCredentials: true });
    return response.data;
  };
  
  export const getActiveDiscountsOverview = async () => {
    const response = await axios.get(`discount/getActiveDiscountsOverview`, { withCredentials: true });
    return response.data;
  };
  
  export const getDiscountUsageStats = async (data) => {
    const response = await axios.post(`discount/getDiscountUsageStats`, data, { withCredentials: true });
    return response.data;
  };
  
  export const getExpiredDiscountsReport = async (params = {}) => {
    const response = await axios.post(`discount/getExpiredDiscountsReport`, params, { withCredentials: true });
    return response.data;
  };
  
  export const getDiscountTypeDistribution = async () => {
    const response = await axios.get(`discount/getDiscountTypeDistribution`, { withCredentials: true });
    return response.data;
  };
  
  export const getRecentDiscounts = async (data) => {
    const response = await axios.post(`discount/getRecentDiscounts`, data, { withCredentials: true });
    return response.data;
  };