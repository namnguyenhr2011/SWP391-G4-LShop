import { getAllCategory } from "../../Service/Client/ApiProduct";
import { useState, useEffect } from "react";
import { Card, List, Typography, Spin } from "antd";
import { Container, Row, Col } from "react-bootstrap";

const { Title, Text } = Typography;

const ProductManagerScreen = () => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getAllCategory();
                console.log(response);
                if (response && response.categories) {
                    setCategory(response.categories);
                } else {
                    console.error("Invalid response structure", response);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, []);

    return (
        <Container>
            <Title level={2} className="my-4 text-center">Products Manager Screen</Title>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row>
                    {category.map((item) => (
                        <Col key={item._id} md={6} lg={4} className="mb-4">
                            <Card
                                hoverable
                                cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: "cover" }} />}
                            >
                                <Title level={4}>{item.name}</Title>
                                <Text type="secondary">{item.description}</Text>
                                <Title level={5} className="mt-3">Sub Categories</Title>
                                {item.subCategories?.length > 0 ? (
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={item.subCategories}
                                        renderItem={(subItem) => (
                                            <List.Item key={subItem.id}>
                                                <img
                                                    src={subItem.image}
                                                    alt={subItem.name}
                                                    style={{ width: 40, height: 40, marginRight: 10, borderRadius: 5 }}
                                                />
                                                <div>
                                                    <Text strong>{subItem.name}</Text>
                                                    <br />
                                                    <Text type="secondary">{subItem.description}</Text>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Text type="danger">No subcategories available.</Text>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ProductManagerScreen;
