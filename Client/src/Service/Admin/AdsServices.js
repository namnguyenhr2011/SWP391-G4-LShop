import axios from "../../utils/CustomizeApi";

export const getAds = async () => {
    const response = await axios.get(`ads/getAllAds`);
    return response.data;
};

export const activeAds = async () => {
    const response = await axios.get(`ads/getActiveAds`);
    return response.data;
};

export const addAds = async (data) => {
    try {
        const response = await axios.post('ads/addAds', data, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error adding ad:", error);
        throw new Error("Unable to add ad.");
    }
};


export const updateAds = async (adsId, data) => {
    try {
        const response = await axios.put(`ads/updateAds/${adsId}`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error adding update:", error);
        throw new Error("Unable to add update.");
    }
};

export const deleteAds = async (adsId) => {
    const response = await axios.delete(`ads/deleteAds/${adsId}`, { withCredentials: true });
    return response.data;
};

export const inactiveAds = async (adsId) => {
    const response = await axios.put(`ads/activeAds/${adsId}`, { withCredentials: true });
    return response.data;
};


export const adsDetail = async (adsId) => {
    try {
        const response = await axios.get(`ads/getAdsById/${adsId}`);
        return response.data;
    } catch (error) {
        console.error("Error adding update:", error);
        throw new Error("Unable to add update.");
    }
}