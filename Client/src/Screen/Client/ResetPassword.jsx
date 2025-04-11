import { useState, useEffect } from "react";
import { Typography } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { resetPassword as userResetPassword } from "../../Service/Client/ApiServices";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Header from "../layout/Header";
import AppFooter from "../layout/Footer";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const { Title, Text } = Typography;


const ResetPassword = () => {
    const { t } = useTranslation("resetpass");
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("resetToken");
        if (storedToken) {
            setToken(storedToken);
        } else {
            toast.error(t("Invalid or expired token. Please verify OTP again."));
            navigate("/verify");
        }
    }, [navigate, t]);

    const validatePassword = (password) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (!newPassword || !confirmPassword) {
                toast.error(t("Please enter both password fields."));
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error(t("Passwords do not match"));
                return;
            }
            if (!validatePassword(newPassword)) {
                toast.error(t("Password must be at least 8 characters, including 1 letter, 1 number, and 1 special character."));
                return;
            }
            if (!validatePassword(confirmPassword)) {
                toast.error(t("Password must be at least 8 characters, including 1 letter, 1 number, and 1 special character."));
                return;
            }
            const res = await userResetPassword(newPassword.trim(), confirmPassword.trim(), token);

            if (res && (res.code === 400 || res.code === 401 || res.code === 402)) {
                toast.error(res.message);
                return;
            }
            if (res && res.code === 200) {
                toast.success(res.message);
                localStorage.removeItem("resetToken");
                navigate("/login");
            }
        } catch (error) {
            toast.error(t("An error occurred. Please try again."));
            console.log(error);
        }
    };

    return (
        <>
            <Header />
            <div className={`container-fluid d-flex justify-content-center align-items-center vh-100 ${isDarkMode ? 'bg-dark text-white' : 'bg-light'}`} style={{ padding: 0 }}>
                <div className="w-100 d-flex justify-content-center align-items-center">
                    <div className={`card p-4 ${isDarkMode ? 'bg-dark text-white' : 'bg-white'}`} style={{ width: '100%', maxWidth: '450px', borderRadius: '12px' }}>
                        <Title level={3} className="text-center mb-4">{t("Reset Your Password")}</Title>
                        <Text className="d-block text-center mb-3">
                            {t("Enter your password and confirm it to reset.")}
                        </Text>

                        <Form onSubmit={handleResetPassword}>
                            <ToastContainer position="top-right" autoClose={3000} />
                            <Form.Group className="mb-3">
                                <Form.Label>{t("Password")}</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder={t("Enter your password")}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>{t("Confirm Password")}</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder={t("Confirm your password")}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Button type="submit" variant="primary" className="w-100">
                                {t("Reset Password")}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
            <AppFooter />
        </>
    );
};

export default ResetPassword;
