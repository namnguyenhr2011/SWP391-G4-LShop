import { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../../Service/Client/ApiServices";
import Header from "../layout/Header";
import AppFooter from "../layout/Footer";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await changePasswordApi(oldPassword, newPassword, confirmPassword);
            toast.success("Password changed successfully!");
            navigate("/");
        } catch (error) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Row className="w-100">
                    <Col md={6} className="mx-auto">
                        <Card className="p-4 shadow">
                            <Card.Body>
                                <h3 className="text-center text-primary mb-4">Change Password</h3>
                                <Form onSubmit={handleChangePassword}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Current Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter current password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                                        {loading ? "Updating..." : "Update Password"}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <AppFooter />
        </>
    );
};

export default ChangePassword;
