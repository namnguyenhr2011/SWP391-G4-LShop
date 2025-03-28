import axios from "../../utils/CustomizeApi";

export const userRegister = async (userName, email, password, phone, address) => {
    try {
        const response = await axios.post('user/register', {
            userName,
            email,
            password,
            phone,
            address,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

export const userLogin = async (email, password) => {
    try {
        const response = await axios.post('/user/login', { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

export const userProfile = async () => {
    try {
        const response = await axios.get('/user/user-profile', { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch profile");
    }
};

export const editProfile = async (userName, phone, address) => {
    try {
        const response = await axios.put('/user/edit-profile', { userName, phone, address });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to edit profile");
    }
};




export const verifyEmail = async (otp, email) => {
    try {
        const response = await axios.post('/user/verify', { otp, email }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Email verification failed");
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post('/user/forgotPassword', { email }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Forgot password request failed");
    }
};

export const otp = async (otp, email) => {
    try {
        const response = await axios.post('/user/otp', { otp, email }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "OTP verification failed");
    }
};
//reset password
export const resetPassword = async (password, confirmPassword, token) => {
    try {
        const response = await axios.post('/user/resetPassword', { password, confirmPassword, token }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Password reset failed");
    }
};
//change password
export const changePasswordApi = async (oldPassword, newPassword, confirmPassword) => {
    try {
        const response = await axios.put(
            '/user/change-password',
            { oldPassword, newPassword, confirmPassword },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Change password failed");
    }
};
//upload avatar
export const uploadAvatar = async (avatar) => {
    try {
        const res = await axios.put(`/user/update-avatar`, { avatar });
        return res;
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
};
