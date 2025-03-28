import React, { useState } from "react";
import { Form, Button, Container, Card, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { changePasswordApi } from "../../Service/Client/ApiServices";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import AppFooter from "../layout/Footer";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường đã được điền đủ chưa
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Kiểm tra độ dài password >= 8 ký tự
    if (newPassword.length < 8 || confirmPassword.length < 8) {
      toast.error("Please fill at least 8 characters in new password!");
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    try {
      await changePasswordApi(currentPassword, newPassword, confirmPassword);
      toast.success("Password updated successfully!");
    } catch (error) {
      if (
        error.message === "Current password is wrong" ||
        error.message === "Old password is incorrect!"
      ) {
        toast.error("Current password is wrong");
      } else {
        toast.error(error.message || "Failed to update password!");
      }
    }
  };

  return (
    <>
      <Header />
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <ToastContainer position="top-right" autoClose={3000} />
        <Card className="shadow-lg p-4 border-0" style={{ width: "500px" }}>
          <Card.Body>
            <h3 className="text-center text-primary mb-4">Change Password</h3>
            <Form onSubmit={handleChangePassword}>
              
              {/* Current Password */}
              <Form.Group className="mb-3" controlId="currentPassword">
                <Form.Label>Current Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <Button
                  variant="outline-secondary"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </Button>
              </InputGroup>
            </Form.Group>

            {/* New Password */}
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" >
              Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    <AppFooter />
  </>
);
};

export default ChangePassword;