import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { otp as userOtp } from "../../service/client/ApiServices";
import { toast, ToastContainer } from "react-toastify";
import { Card, Form, Input, Button, Typography, Row, Col } from "antd";
import Header from "../layout/Header";
import AppFooter from "../layout/Footer";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const Otp = () => {
    const { t } = useTranslation("otp");
    const isDarkMode = useSelector((state) => state.user.darkMode);

    const { email } = useParams();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`)?.focus();
        }
    };

    const handleOtp = async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            toast.error(t("Please enter the full 6-digit OTP."));
            return;
        }

        setLoading(true);
        try {
            const res = await userOtp(otpCode, email);

            if (!res || typeof res !== "object" || !("code" in res) || !("message" in res)) {
                throw new Error(t("Invalid response format from server"));
            }

            if (res.code === 400 || res.code === 401) {
                toast.error(res.message);
            } else if (res.code === 200) {
                toast.success(res.message);

                if (res.token) {
                    localStorage.setItem("resetToken", res.token);
                }

                navigate("/resetpassword");
            }
        } catch (error) {
            toast.error(error.message || t("An error occurred. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className={`d-flex justify-content-center align-items-center vh-100 ${isDarkMode ? 'bg-dark' : 'bg-light'}`} style={{ padding: '0 20px' }}>
                <ToastContainer position="top-right" autoClose={3000} />
                <Card className={`shadow-lg p-4 ${isDarkMode ? 'bg-dark text-white' : 'bg-white'}`} style={{ width: '100%', maxWidth: '450px', borderRadius: '12px' }}>
                    <Title level={3} className="text-center mb-4">{t("Input OTP")}</Title>
                    <Text className="d-block text-center mb-3">
                        {t("Enter the OTP sent to your email:")} <strong>{email}</strong>
                    </Text>

                    <Form layout="vertical" onFinish={handleOtp}>
                        <Row gutter={10} justify="center" className="mb-3">
                            {otp.map((value, index) => (
                                <Col key={index}>
                                    <Input
                                        id={`otp-input-${index}`}
                                        value={value}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        maxLength={1}
                                        className="text-center"
                                        style={{
                                            width: 40,
                                            height: 50,
                                            fontSize: 18,
                                            textAlign: "center",
                                            borderRadius: 5,
                                            border: isDarkMode ? "1px solid #ffffff" : "1px solid #1890ff",
                                        }}
                                    />
                                </Col>
                            ))}
                        </Row>

                        <Button type="primary" block size="large" htmlType="submit" loading={loading} style={{ borderRadius: '8px', fontSize: '16px', padding: '12px' }}>
                            {t("Sumbit OTP")}
                        </Button>
                    </Form>
                </Card>
            </div>
            <AppFooter />
        </>
    );
};

export default Otp;
