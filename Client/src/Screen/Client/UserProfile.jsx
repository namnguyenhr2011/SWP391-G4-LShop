import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Avatar,
  Tag,
  Spin,
  Layout,
  Button,
} from "antd";
import { Container, Row, Col } from "react-bootstrap";
import { UserOutlined } from "@ant-design/icons";
import { userProfile } from "../../Service/Client/ApiServices";
import { useSelector } from "react-redux";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Content } = Layout;

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userProfile();
        console.log(response);
        setUser(response.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const columns = [
    { title: "Field", dataIndex: "field", key: "field", width: "30%" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  const userData = user
    ? [
        { key: "1", field: "Email", value: user.email },
        { key: "2", field: "User Name", value: user.userName },
        { key: "3", field: "Phone", value: user.phone },
        { key: "4", field: "Address", value: user.address },
        {
          key: "5",
          field: "Status",
          value: <Tag color={isDarkMode ? "cyan" : "green"}>{user.status}</Tag>,
        },
        {
          key: "6",
          field: "Created At",
          value: new Date(user.createdAt).toLocaleString(),
        },
      ]
    : [];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Header />
      <Content
        style={{ padding: "20px 50px", minHeight: "100vh", marginTop: "80px" }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card
                className="p-4 shadow-lg"
                style={{
                  backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
                  border: isDarkMode
                    ? "1px solid #30363d"
                    : "1px solid #d9e1e8",
                  color: isDarkMode ? "#e6edf3" : "#1c1e21",
                }}
              >
                <div className="text-center mb-4">
                  <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#87d068" }}
                    src={
                      user?.avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVva9csN-zOiY2wG9CXNuAI1VRsFunaiD3nQ&s"
                    }
                  />
                  {loading ? (
                    <Spin size="large" className="mt-3" />
                  ) : user ? (
                    <>
                      <Title
                        level={3}
                        className="mt-2"
                        style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
                      >
                        {user.userName}
                      </Title>
                      <Text
                        type="secondary"
                        style={{ color: isDarkMode ? "#8b949e" : "#6a737d" }}
                      >
                        {user.email}
                      </Text>
                    </>
                  ) : (
                    <Text
                      type="danger"
                      style={{ color: isDarkMode ? "#f85149" : "#cf222e" }}
                    >
                      User data not found!
                    </Text>
                  )}
                </div>

                {!loading && user && (
                  <Table
                    columns={columns}
                    dataSource={userData}
                    pagination={false}
                    bordered
                    style={{
                      backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
                      color: isDarkMode ? "#e6edf3" : "#1c1e21",
                    }}
                    rowClassName={() =>
                      isDarkMode ? "dark-table-row" : "light-table-row"
                    }
                  />
                )}

                <div className="text-center mt-4">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/update-profile")}
                    style={{
                      backgroundColor: isDarkMode ? "#1f6feb" : "#1890ff",
                      borderColor: isDarkMode ? "#1f6feb" : "#1890ff",
                      color: "#ffffff",
                      boxShadow: "none",
                    }}
                  >
                    Update Profile
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </Content>
      <Footer />
    </Layout>
  );
};

// Optional: Add some custom CSS for table rows in dark mode
const styles = `
  .dark-table-row {
    background-color: #161b22;
    color: #e6edf3;
  }
  .dark-table-row:hover {
    background-color: #21262d;
  }
  .light-table-row {
    background-color: #ffffff;
    color: #1c1e21;
  }
  .light-table-row:hover {
    background-color: #f5f5f5;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default UserProfile;
