import { useState, useEffect } from "react";
import { Table, Card, Typography, Avatar, Tag, Spin, Layout, Button } from "antd";
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
                value: <Tag color="green">{user.status}</Tag>,
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
            <Content style={{ padding: "20px 50px", minHeight: "100vh", marginTop: "80px" }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Card className="p-4 shadow-lg">
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
                                            <Title level={3} className="mt-2">{user.userName}</Title>
                                            <Text type="secondary">{user.email}</Text>
                                        </>
                                    ) : (
                                        <Text type="danger">User data not found!</Text>
                                    )}
                                </div>

                                {!loading && user && (
                                    <Table columns={columns} dataSource={userData} pagination={false} bordered />
                                )}

                                <div className="text-center mt-4">
                                    <Button type="primary" size="large" onClick={() => navigate("/update-profile")}>Update Profile</Button>
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

export default UserProfile;

