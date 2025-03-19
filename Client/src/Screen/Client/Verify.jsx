import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail } from '../../service/client/ApiServices';
import { toast } from 'react-toastify';
import { Input, Button, Row, Col, Typography } from 'antd';
import { Container, Card } from 'react-bootstrap';

const { Title, Text } = Typography;

const VerifyScreen = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email") || "";

    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(6).fill(''));

    const handleVerify = async () => {
        try {
            const otpCode = otp.join('');
            if (otpCode.length !== 6) {
                toast.error("Please enter a valid 6-digit OTP.");
                return;
            }

            const response = await verifyEmail(otpCode, email);
            if (!response || response.code === 401 || response.code === 500) {
                toast.error(response?.message || "Verification failed");
            } else {
                toast.success('Verification successful');
                navigate('/login');
            }
        } catch (error) {
            toast.error('An error occurred during verification: ' + error);
        }
    };

    const handleChange = (text, index) => {
        if (text.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="p-4 shadow-lg" style={{ width: 400 }}>
                <Title level={3} className="text-center">Verify Your Email</Title>
                <Text className="d-block text-center mb-3">
                    Enter the OTP sent to <strong>{email}</strong>
                </Text>

                {/* OTP Input */}
                <Row gutter={10} justify="center" className="mb-3">
                    {otp.map((value, index) => (
                        <Col key={index}>
                            <Input
                                value={value}
                                onChange={(e) => handleChange(e.target.value, index)}
                                maxLength={1}
                                className="text-center"
                                style={{
                                    width: 50,
                                    height: 50,
                                    fontSize: 18,
                                    textAlign: "center",
                                    borderRadius: 5,
                                }}
                            />
                        </Col>
                    ))}
                </Row>

                {/* Verify Button */}
                <Button type="primary" block size="large" onClick={handleVerify}>
                    Verify
                </Button>

            </Card>
        </Container>
    );
};

export default VerifyScreen;
