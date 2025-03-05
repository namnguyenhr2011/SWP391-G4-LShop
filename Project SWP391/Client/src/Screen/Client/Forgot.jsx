import { useState } from "react";
import { forgotPassword as userForgot } from "../../Service/Client/ApiServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Card, Form, Input, Button, Typography } from "antd";

const { Title, Text } = Typography;

const Forgot = () => {
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
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="shadow-lg p-4" style={{ width: 400, borderRadius: "12px" }}>
                <Title level={3} className="text-center text-primary">
                    Reset Your Password
                </Title>
                <Text className="d-block text-center mb-3">
                    Enter your email, and we&apos;ll send you an OTP to reset your password.
                </Text>
                <Form layout="vertical" onFinish={handleSendEmail}>
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter your email!" },
                            { type: "email", message: "Please enter a valid email!" }
                        ]}
                    >
                        <Input
                            placeholder="Enter your email"
                            size="large"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        block
                        size="large"
                        htmlType="submit"
                        loading={loading}
                    >
                        Send OTP To Email
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default Forgot;
