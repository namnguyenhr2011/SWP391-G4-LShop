import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { resetPassword as userResetPassword } from "../../Service/Client/ApiServices";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const ResetPassword = () => {
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
            toast.error("Invalid or expired token. Please verify OTP again.");
            navigate("/verify");
        }
    }, [navigate]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (!newPassword || !confirmPassword) {
                toast.error("Please enter both password fields.");
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
            toast.error("An error occurred. Please try again.");
            console.log(error)
        }
    };

    return (
        <div className="container my-5">
            <div className="mt-3">
                <h1>Reset Your Password</h1>
            </div>
            <Form onSubmit={handleResetPassword} className="mt-3">
                <ToastContainer position="top-right" autoClose={3000} />
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
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
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm your password"
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
                    Reset Password
                </Button>
            </Form>
        </div>
    );
};

export default ResetPassword;
