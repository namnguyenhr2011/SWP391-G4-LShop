import { useState, useEffect } from "react";
import { getAllCategory, getTopVotedProducts, getTopPurchasedProducts } from "../../Service/Client/ApiProduct";
import { Card, List, Typography, Spin, Input } from "antd";
import { Container, Row, Col } from "react-bootstrap";

const { Title, Text } = Typography;
const { Search } = Input;

const ProductManagerScreen = () => {
    const [category, setCategory] = useState([]);
    const [topVoted, setTopVoted] = useState([]);
    const [topPurchased, setTopPurchased] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [categoryRes, topVotedRes, topPurchasedRes] = await Promise.all([
                getAllCategory(),
                getTopVotedProducts(),
                getTopPurchasedProducts(),
            ]);

            if (categoryRes?.categories) {
                setCategory(categoryRes.categories);
            }
            if (topVotedRes?.products) {
                setTopVoted(topVotedRes.products);
            }
            if (topPurchasedRes?.products) {
                setTopPurchased(topPurchasedRes.products);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    // Lọc sản phẩm theo tên
    const filteredCategories = category.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Container>
            <Title level={2} className="my-4 text-center">Dashboard - Quản lý sản phẩm</Title>

            {/* Thanh tìm kiếm */}
            <Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                enterButton="Tìm kiếm"
                size="large"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 20 }}
            />

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {/* Sản phẩm được vote cao nhất */}
                    <Title level={3} className="mt-4">🔥 Sản phẩm được vote cao nhất</Title>
                    <Row>
                        {topVoted.map((product) => (
                            <Col key={product._id} md={6} lg={4} className="mb-4">
                                <Card hoverable cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: "cover" }} />}>
                                    <Title level={4}>{product.name}</Title>
                                    <Text strong>Rating: {product.rating} ⭐</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Sản phẩm được mua nhiều nhất */}
                    <Title level={3} className="mt-4">🏆 Sản phẩm bán chạy nhất</Title>
                    <Row>
                        {topPurchased.map((product) => (
                            <Col key={product._id} md={6} lg={4} className="mb-4">
                                <Card hoverable cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: "cover" }} />}>
                                    <Title level={4}>{product.name}</Title>
                                    <Text strong>Đã bán: {product.sold} sản phẩm</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Danh sách danh mục sản phẩm */}
                    <Title level={3} className="mt-4">📦 Danh mục sản phẩm</Title>
                    <Row>
                        {filteredCategories.map((cat) => (
                            <Col key={cat._id} md={6} lg={4} className="mb-4">
                                <Card hoverable cover={<img alt={cat.name} src={cat.image} style={{ height: 200, objectFit: "cover" }} />}>
                                    <Title level={4}>{cat.name}</Title>
                                    <Text type="secondary">{cat.description}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default ProductManagerScreen;
