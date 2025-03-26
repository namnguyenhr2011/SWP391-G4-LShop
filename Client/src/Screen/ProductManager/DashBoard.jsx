import { Card, Row, Col, Statistic, Spin, message, Typography, Layout, Rate } from "antd";
import { ShopOutlined, WarningOutlined, ShoppingCartOutlined, StockOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getAllProduct, getSoldProductsData } from "../../Service/Client/ApiProduct";
import { getFeedbackByProductId } from "../../Service/Client/ApiFeedBack";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const ProductManagerDashboard = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState(0);
    const [bestRatedProduct, setBestRatedProduct] = useState(null);
    const [soldThisMonth, setSoldThisMonth] = useState(0);
    const [remainingStock, setRemainingStock] = useState(0);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        fetchBestRatedProduct();
        fetchSalesData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const productData = await getAllProduct();
            const products = productData.products || [];
            setTotalProducts(products.length);
            setLowStockProducts(products.filter((p) => p.quantity < 10).length);
            const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
            setRemainingStock(totalStock);
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    const fetchBestRatedProduct = async () => {
        try {
            setLoading(true);
            const productResponse = await getAllProduct();

            if (!productResponse || !productResponse.products) {
                setLoading(false);
                return;
            }

            let bestProduct = null;
            let highestRating = 0;

            for (const product of productResponse.products) {
                const feedbackResponse = await getFeedbackByProductId(product._id);
                if (feedbackResponse?.feedback) {
                    const totalRating = feedbackResponse.feedback.reduce((sum, fb) => sum + fb.rating, 0);
                    const avgRating = feedbackResponse.feedback.length ? totalRating / feedbackResponse.feedback.length : 0;

                    if (avgRating > highestRating) {
                        highestRating = avgRating;
                        bestProduct = { ...product, rating: avgRating };
                    }
                }
            }

            setBestRatedProduct(bestProduct);
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu đánh giá!");
        } finally {
            setLoading(false);
        }
    };

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const salesResponse = await getSoldProductsData();
            if (!salesResponse || !salesResponse.sales) return;

            const currentMonth = new Date().getMonth() + 1;
            const salesThisMonth = salesResponse.sales.filter(sale => new Date(sale.date).getMonth() + 1 === currentMonth);
            const totalSold = salesThisMonth.reduce((sum, sale) => sum + sale.quantity, 0);
            setSoldThisMonth(totalSold);

            const formattedSalesData = salesResponse.sales.map(sale => ({
                date: new Date(sale.date).toLocaleDateString("vi-VN"),
                quantity: sale.quantity
            }));
            setSalesData(formattedSalesData);
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu bán hàng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Layout style={{ marginTop: 64 }}>
                <Sider>
                    <Sidebar />
                </Sider>

                <Layout style={{ marginLeft: 220, padding: "24px" }}>
                    <Content style={{ padding: "24px", borderRadius: "8px" }}>
                        {loading ? (
                            <Spin size="large" tip="Đang tải dữ liệu..." style={{ display: "block", textAlign: "center" }} />
                        ) : (
                            <>
                                <Row gutter={[16, 16]} justify="center">
                                    <Col xs={24} sm={12} md={6}>
                                        <Card>
                                            <Statistic title="Tổng số sản phẩm" value={totalProducts} prefix={<ShopOutlined />} />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Card>
                                            <Statistic title="Sản phẩm sắp hết hàng (< 10 cái)" value={lowStockProducts} prefix={<WarningOutlined />} />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Card>
                                            <Statistic title="Số sản phẩm đã bán trong tháng" value={soldThisMonth} prefix={<ShoppingCartOutlined />} />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Card>
                                            <Statistic title="Tổng sản phẩm còn lại trong kho" value={remainingStock} prefix={<StockOutlined />} />
                                        </Card>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                                    <Col xs={24} md={12}>
                                        <Card title="🏆 Sản phẩm có rating cao nhất">
                                            {bestRatedProduct ? (
                                                <>
                                                    <Title level={4}>{bestRatedProduct.name}</Title>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
                                                        <img
                                                            alt={bestRatedProduct.name}
                                                            src={bestRatedProduct.image}
                                                            style={{
                                                                width: "100%",
                                                                maxWidth: "300px",
                                                                height: "auto",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                                                            }}
                                                        />
                                                    </div>
                                                    <Rate allowHalf value={bestRatedProduct.rating} disabled />
                                                    <Text strong style={{ display: "block", marginTop: 10 }}>
                                                        {bestRatedProduct.rating.toFixed(1)} / 5 ⭐
                                                    </Text>
                                                </>
                                            ) : (
                                                <Text>Không có sản phẩm nào được đánh giá</Text>
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                                    <Col xs={24}>
                                        <Card title="📈 Biểu đồ số sản phẩm đã bán">
                                            {salesData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart data={salesData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Line type="monotone" dataKey="quantity" stroke="#1890ff" strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <Text>Không có dữ liệu bán hàng</Text>
                                            )}
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ProductManagerDashboard;
