import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../Service/Client/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { doLogin } from "../../Store/reducer/userReducer";
import { Form, Button, Container, Row, Col, Card, InputGroup } from "react-bootstrap";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
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
                dispatch(doLogin({ _id: res.id, token: res.token }));
                if (res.role == "user") {
                    navigate("/");
                }
                if (res.role == "productManager") {
                    navigate("/Productdashboard")
                }
                if (res.role == "admin") {
                    navigate("/admin")
                }
                if (res.role == "sale") {
                    navigate("/sale")
                }
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <ToastContainer position="top-right" autoClose={3000} />
            <Row className="w-100">
                <Col md={6} lg={5} className="mx-auto">
                    <Card className="shadow-lg p-4 border-0">
                        <Card.Body>
                            <h3 className="text-center text-primary mb-4">Sign In</h3>
                            <Form onSubmit={handleLogin}>
                                {/* Email Field */}
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                        </Button>
                                    </InputGroup>
                                    <Link to="/forgot" className="text-decoration-none text-primary mt-2 d-block">
                                        Forgot Password?
                                    </Link>
                                </Form.Group>


                                <Button type="submit" variant="primary" className="w-100">
                                    Sign In
                                </Button>


                                <Button
                                    variant="outline-secondary"
                                    className="w-100 mt-3"
                                    onClick={() => navigate('/register')}
                                >
                                    Sign Up
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
