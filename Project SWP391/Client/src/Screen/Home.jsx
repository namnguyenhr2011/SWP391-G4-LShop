import { Layout, Typography, Button, Card, Row, Col } from "antd";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Header */}
            <Header style={{ background: "#1890ff", padding: "0 20px", textAlign: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Welcome to Home Page</Title>
            </Header>

            {/* Content */}
            <Content style={{ padding: "50px" }}>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} md={8}>
                        <Card title="Feature 1" bordered={false}>
                            <Paragraph>Discover amazing features with our app.</Paragraph>
                            <Button type="primary">Learn More</Button>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card title="Feature 2" bordered={false}>
                            <Paragraph>Fast, secure, and easy to use.</Paragraph>
                            <Button type="primary">Explore</Button>
                        </Card>
                    </Col>
                </Row>
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: "center" }}>
                Home Page ©2025 Created with Ant Design
            </Footer>
        </Layout>
    );
};

export default Home;
