import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../../Service/Client/ApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button, Container, Row, Col, Card, InputGroup } from "react-bootstrap";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    const validatePassword = (password) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { userName, email, password, confirmPassword, phone, address } = formData;

        if (!userName || !email || !password || !confirmPassword || !phone || !address) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!validatePhone(phone)) {
            toast.error("Phone number must be exactly 10 digits.");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must be at least 8 characters, including 1 letter, 1 number, and 1 special character.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await userRegister(userName, email, password, phone, address);
            if (res.code === 409 || res.code === 509) {
                toast.error(res.message);
                return;
            }
            if (res.code === 201) {
                toast.success(res.message);
                navigate(`/verify?email=${encodeURIComponent(email)}`);
            }
        } catch (error) {
            toast.error(error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <ToastContainer position="top-right" autoClose={3000} />
            <Row className="w-100">
                <Col md={6} lg={5} className="mx-auto">
                    <Card className="shadow-lg p-4 border-0">
                        <Card.Body>
                            <h3 className="text-center text-primary mb-4">Sign Up</h3>
                            <Form onSubmit={handleRegister}>
                                <Form.Group className="mb-3">
                                    <Form.Label>userName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userName"
                                        placeholder="Enter your userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        placeholder="Enter your address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                {/* Password Field */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                        </Button>
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        Password must be at least 8 characters, including 1 letter, 1 number, and 1 special character.
                                    </Form.Text>
                                </Form.Group>

                                {/* Confirm Password Field */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
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
                                    Sign Up
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    className="w-100 mt-3"
                                    onClick={() => navigate("/login")}
                                >
                                    Already have an account? Sign In
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
