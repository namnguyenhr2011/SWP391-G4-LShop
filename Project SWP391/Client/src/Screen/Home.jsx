import { Layout, Typography, Button, Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const Home = () => {
    const isDarkMode = useSelector((state) => state.user.darkMode);

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

            <Content style={{ padding: "60px 20px", maxWidth: "1200px", margin: "auto" }}>
                <Title
                    level={2}
                    style={{
                        textAlign: "center",
                        color: isDarkMode ? "#e6edf3" : "#1c1e21",
                        marginBottom: "40px",
                    }}
                >
                    Welcome to Our Platform
                </Title>

                <Row gutter={[24, 24]} justify="center">
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Feature 1"
                            bordered={false}
                            hoverable
                            style={{
                                backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
                                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                                borderRadius: "12px",
                                boxShadow: isDarkMode
                                    ? "0 4px 10px rgba(255, 255, 255, 0.1)"
                                    : "0 4px 10px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <Paragraph>
                                Discover amazing features with our app that enhance your productivity.
                            </Paragraph>
                            <Button type="primary" block>
                                Learn More
                            </Button>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Feature 2"
                            bordered={false}
                            hoverable
                            style={{
                                backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
                                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                                borderRadius: "12px",
                                boxShadow: isDarkMode
                                    ? "0 4px 10px rgba(255, 255, 255, 0.1)"
                                    : "0 4px 10px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <Paragraph>
                                Experience a seamless, fast, and secure way to manage your tasks.
                            </Paragraph>
                            <Button type="primary" block>
                                Explore
                            </Button>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Feature 3"
                            bordered={false}
                            hoverable
                            style={{
                                backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
                                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                                borderRadius: "12px",
                                boxShadow: isDarkMode
                                    ? "0 4px 10px rgba(255, 255, 255, 0.1)"
                                    : "0 4px 10px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <Paragraph>
                                Stay connected and collaborate with your team effortlessly.
                            </Paragraph>
                            <Button type="primary" block>
                                Get Started
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Footer />
        </Layout>
    );
};

export default Home;
