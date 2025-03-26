import { useState } from "react";
import { forgotPassword as userForgot } from "../../service/client/ApiServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Card, Form, Input, Button, Typography } from "antd";
import Header from "../layout/Header";
import AppFooter from "../layout/Footer";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const Forgot = () => {
    const { t } = useTranslation("forgot");
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendEmail = async () => {
        if (!email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        setLoading(true);

        try {
            const res = await userForgot(email);

            if (!res || typeof res !== "object" || !("code" in res) || !("message" in res)) {
                throw new Error("Invalid response format from server");
            }

            if (res.code === 402) {
                toast.error(res.message);
            } else if (res.code === 200) {
                toast.success(res.message);
                navigate(`/otp/${email}`);
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            toast.error(error.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card
                    className={`shadow-lg p-4 ${isDarkMode ? 'bg-dark text-white' : 'bg-white'}`}
                    style={{
                        width: '100%',
                        maxWidth: '450px',  // Limit the width
                        borderRadius: '12px',  // Rounded corners
                        padding: '20px',  // Padding inside card
                    }}
                >
                    <Title level={3} className="text-center text-primary mb-4">
                        {t("Reset Your Password")}
                    </Title>
                    <Text className="d-block text-center mb-4">
                        {t("Enter your email, and we'll send you an OTP to reset your password.")}
                    </Text>

                    <Form layout="vertical" onFinish={handleSendEmail}>
                        <Form.Item
                            label={t("Email Address")}
                            name="email"
                            rules={[
                                { required: true, message: t("Please enter your email!") },
                                { type: "email", message: t("Please enter a valid email!") },
                            ]}
                        >
                            <Input
                                placeholder={t("Enter your email")}
                                size="large"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    borderRadius: '8px',
                                    padding: '12px',
                                    fontSize: '16px',
                                }}
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            block
                            size="large"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                borderRadius: '8px',
                                fontSize: '16px',
                                padding: '12px',
                            }}
                        >
                            {t("Send OTP To Email")}
                        </Button>
                    </Form>
                </Card>
            </Container>
            <AppFooter />
        </>
    );
};

export default Forgot;
