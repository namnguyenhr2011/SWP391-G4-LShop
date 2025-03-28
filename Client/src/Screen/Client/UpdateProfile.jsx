import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, Card, message, Typography } from "antd";
import { editProfile } from "../../Service/Client/ApiServices";
import Header from "../layout/Header";
import AppFooter from "../layout/Footer";
import { toast } from "react-toastify";
import UploadImage from "../../Component/UploadImage";
import { useSelector } from "react-redux";

const { Title } = Typography;

const ProfileEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const isDarkMode = useSelector((state) => state.user.darkMode);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { name, phone, address } = values;
      const res = await editProfile(name, phone, address);
      console.log(res)
      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      message.error("Profile update failed! " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lightModeStyles = `
      .ant-form-item-label > label {
        color: #1c1e21;
      }
      .ant-input:hover, .ant-input:focus {
        border-color: #40a9ff;
        box-shadow: none;
      }
    `;

    const darkModeStyles = `
      .ant-form-item-label > label {
        color: #e6edf3;
      }
      .ant-input:hover, .ant-input:focus {
        border-color: #1f6feb;
        box-shadow: none;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = isDarkMode ? darkModeStyles : lightModeStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isDarkMode]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "background-color 0.3s ease, color 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      {/* Tiêu đề */}
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: isDarkMode ? "#e6edf3" : "#1c1e21",
          margin: "20px 0",
        }}
      >
        Update Your Profile
      </Title>

      {/* Nội dung chính */}
      <div
        className="container"
        style={{
          flex: 1, // Chiếm không gian còn lại giữa header và footer
          paddingBottom: "50px", // Khoảng cách dưới để tránh dính footer
        }}
      >
        <div className="row" style={{ marginTop: "5vh" }}>
          {/* Avatar */}
          <div className="col-md-7">
            <Card
              title="Profile Picture"
              bordered={true}
              style={{
                backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
                border: isDarkMode ? "1px solid #30363d" : "1px solid #d9e1e8",
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
              }}
              headStyle={{
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                borderBottom: isDarkMode
                  ? "1px solid #30363d"
                  : "1px solid #d9e1e8",
              }}
            >
              <UploadImage />
            </Card>
          </div>

          {/* Edit Profile */}
          <div className="col-md-5">
            <Card
              title="Edit Profile"
              bordered={true}
              style={{
                backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
                border: isDarkMode ? "1px solid #30363d" : "1px solid #d9e1e8",
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
              }}
              headStyle={{
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                borderBottom: isDarkMode
                  ? "1px solid #30363d"
                  : "1px solid #d9e1e8",
              }}
            >
              <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
              >
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                  style={{ marginBottom: "16px" }}
                >
                  <Input
                    style={{
                      backgroundColor: isDarkMode ? "#0d1117" : "#ffffff",
                      color: isDarkMode ? "#e6edf3" : "#1c1e21",
                      borderColor: isDarkMode ? "#30363d" : "#d9e1e8",
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                  ]}
                  style={{ marginBottom: "16px" }}
                >
                  <Input
                    style={{
                      backgroundColor: isDarkMode ? "#0d1117" : "#ffffff",
                      color: isDarkMode ? "#e6edf3" : "#1c1e21",
                      borderColor: isDarkMode ? "#30363d" : "#d9e1e8",
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    { required: true, message: "Please enter your address" },
                  ]}
                  style={{ marginBottom: "16px" }}
                >
                  <Input
                    style={{
                      backgroundColor: isDarkMode ? "#0d1117" : "#ffffff",
                      color: isDarkMode ? "#e6edf3" : "#1c1e21",
                      borderColor: isDarkMode ? "#30363d" : "#d9e1e8",
                    }}
                  />
                </Form.Item>
                <Form.Item className="d-flex justify-content-between">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      backgroundColor: isDarkMode ? "#1f6feb" : "#1890ff",
                      borderColor: isDarkMode ? "#1f6feb" : "#1890ff",
                      color: "#ffffff",
                      marginRight: "8px",
                      boxShadow: "none",
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => navigate("/change-password")}
                    style={{
                      backgroundColor: isDarkMode ? "#1f6feb" : "#1890ff",
                      borderColor: isDarkMode ? "#1f6feb" : "#1890ff",
                      color: "#ffffff",
                      boxShadow: "none",
                    }}
                  >
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
};

export default ProfileEditor;
