import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../Service/Client/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { doLogin } from "../../store/reducer/userReducer";
import { Form, Button, Container, Row, Col, Card, InputGroup } from "react-bootstrap";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useSpring, animated } from "react-spring";
import { useTranslation } from "react-i18next";
import { Image } from "antd";

import { useSelector } from "react-redux";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const { t } = useTranslation('signin');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error(t("Please fill in all fields"));
            return;
        }

        try {
            const res = await userLogin(email.trim(), password.trim());

            if (!res || typeof res !== "object" || !("code" in res) || !("message" in res)) {
                throw new Error("Invalid response format from server");
            }

            if (res.code === 402) {
                toast.error(res.message);
                return;
            }

            if (res.code === 200) {
                toast.success(res.message);
                dispatch(doLogin({ _id: res.id, token: res.token, role: res.role }));
                switch (res.role) {
                    case "productManager":
                        navigate("/Productdashboard");
                        break;
                    case "admin":
                        navigate("/admin");
                        break;
                    case "sale":
                        navigate("/sale");
                        break;
                    case "shipper":
                        navigate("/shipper");
                        break;
                    default:
                        navigate("/");
                        break;
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || t("An error occurred. Please try again."));
        }
    };

    const cardProps = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 1000 },
    });

    return (
        <Container
            fluid
            className={`d-flex justify-content-center align-items-center ${isDarkMode ? 'bg-dark' : 'bg-light'} position-relative`}
            style={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
            <ToastContainer position="top-right" autoClose={3000} />

            <Row className="w-100 m-0 flex-grow-1 justify-content-center align-items-center" style={{ height: "90vh", width: "90vw" }}>

                {/* Login Form Section */}
                <Col xs={12} md={6} lg={5} className="p-6 d-flex justify-content-center align-items-center">
                    <animated.div style={cardProps}>
                        <Card
                            className={`shadow-lg p-4 border-0 rounded-lg ${isDarkMode ? 'bg-dark text-white' : 'bg-white'}`}
                        >
                            <Card.Body>
                                {/* Logo Section */}
                                <Form.Group className="mb-5 text-center">
                                    <Image
                                        src="/L.png"
                                        alt="Logo"
                                        width={120}
                                        className="mb-3"
                                    />
                                </Form.Group>

                                <h3 className={`text-center ${isDarkMode ? 'text-light' : 'text-primary'} mb-4`}>
                                    {t("Sign In")}
                                </h3>
                                <Form onSubmit={handleLogin}>
                                    {/* Email Field */}
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label className={`fw-bold ${isDarkMode ? 'text-light' : ''}`}>
                                            {t("Email Address")}
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder={t("Enter your email")}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-control-lg"
                                            required
                                        />
                                    </Form.Group>

                                    {/* Password Field */}
                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Label className={`fw-bold ${isDarkMode ? 'text-light' : ''}`}>
                                            {t("Password")}
                                        </Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder={t("Enter your password")}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="form-control-lg"
                                                required
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="px-3"
                                            >
                                                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                            </Button>
                                        </InputGroup>
                                        <Link
                                            to="/forgot"
                                            className={`text-decoration-none ${isDarkMode ? 'text-light' : 'text-primary'} mt-2 d-block`}
                                        >
                                            {t("Forgot Password?")}
                                        </Link>
                                    </Form.Group>

                                    {/* Login Button */}
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-100 py-2 mt-3 text-uppercase"
                                    >
                                        {t("Sign In")}
                                    </Button>

                                    {/* Sign Up Button */}
                                    <Button
                                        variant="outline-secondary"
                                        className="w-100 mt-3 py-2 text-uppercase"
                                        onClick={() => navigate("/register")}
                                    >
                                        {t("Don't have an account? Sign Up")}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </animated.div>
                </Col>
            </Row>
        </Container>
    );

};

export default Login;
