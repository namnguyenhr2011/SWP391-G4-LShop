import { toast } from "react-toastify";
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from "../../../Store/reducer/cartReducer";
import { Layout, List, Button, Typography, Row, Col, Card, Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ShoppingOutlined, ArrowLeftOutlined, CreditCardOutlined, FireOutlined } from "@ant-design/icons";
import Header from "../../layout/Header";
import AppFooter from "../../layout/Footer";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const { Content } = Layout;
const { Title, Text } = Typography;


const Cart = () => {
    const { t } = useTranslation("cart");
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const navigate = useNavigate();
    const { _id: userId } = useSelector((state) => state.user?.user) || {};
    const cartItems = useSelector((state) => state.cart.items[userId] || []);
    const dispatch = useDispatch();

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalOriginalPrice = cartItems.reduce((total, item) =>
        total + (item.originalPrice || item.price) * item.quantity, 0
    );

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error({
                message: t("Error"),
                description: t("Your cart is empty!"),
            });
            return;
        }

        const orderData = {
            products: cartItems.map((item) => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
            })),
            totalAmount: totalPrice,
        };

        navigate("/cart/checkout", { state: orderData });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
    };

    return (
        <>
            <Header />

            <Layout style={{
                minHeight: "90vh",
                width: "100%",
                backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}>
                <Container>
                    <Content style={{ marginTop: "100px" }}>
                        <Row align="middle" style={{ marginBottom: "50px" }}>
                            <Col span={12}>
                                <Link to="/">
                                    <Button
                                        icon={<ArrowLeftOutlined />}
                                        size="large"
                                        style={{
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        {t("Continue shopping")}
                                    </Button>
                                </Link>
                            </Col>
                            <Col span={12} style={{ textAlign: "right" }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    <ShoppingOutlined /> {t("Your Cart")}
                                </Title>
                            </Col>
                        </Row>

                        {cartItems.length === 0 ? (
                            <Card style={{ padding: "40px", borderRadius: "20px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
                                <Text strong style={{ display: "block", fontSize: "18px", marginBottom: "20px" }}>
                                    {t("Your cart is empty! 🛍️")}
                                </Text>
                                <Link to="/">
                                    <Button type="primary" size="large" icon={<ShoppingOutlined />}>
                                        {t("Start shopping now")}
                                    </Button>
                                </Link>
                            </Card>
                        ) : (
                            <Card style={{ padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={cartItems}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Row gutter={16} style={{ width: "100%", alignItems: "center" }}>
                                                <Col xs={6} md={4}>
                                                    <div style={{ position: 'relative' }}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            style={{ width: "100%", borderRadius: "8px" }}
                                                        />
                                                        {item.isSale && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '10px',
                                                                right: '10px',
                                                                background: 'rgba(255, 77, 79, 0.9)',
                                                                color: 'white',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                <FireOutlined /> {t("Discount")}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col xs={12} md={12}>
                                                    <Text strong>{item.name}</Text>
                                                    <br />
                                                    {item.isSale ? (
                                                        <>
                                                            <Text delete style={{ color: "#999", marginRight: "10px" }}>
                                                                {formatPrice(item.originalPrice)}
                                                            </Text>
                                                            <Text strong style={{ color: "#ff4d4f" }}>
                                                                {formatPrice(item.price)}
                                                            </Text>
                                                            <br />
                                                            <Text type="success">
                                                                {t("Discount")}: {formatPrice(item.originalPrice - item.price)}
                                                                ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%)
                                                            </Text>
                                                            <br />
                                                            <Text>
                                                                {formatPrice(item.price)} x {item.quantity} =
                                                                <strong> {formatPrice(item.price * item.quantity)}</strong>
                                                            </Text>
                                                        </>
                                                    ) : (
                                                        <Text>
                                                            {formatPrice(item.price)} x {item.quantity} =
                                                            <strong> {formatPrice(item.price * item.quantity)}</strong>
                                                        </Text>
                                                    )}
                                                </Col>

                                                <Col xs={6} md={4} style={{ textAlign: "right" }}>
                                                    <Button size="small" onClick={() => dispatch(decreaseQuantity({ userId, productId: item.productId }))} disabled={item.quantity === 1}>➖</Button>
                                                    <Text style={{ margin: "0 10px" }}>{item.quantity}</Text>
                                                    <Button size="small" onClick={() => dispatch(increaseQuantity({ userId, productId: item.productId }))}>➕</Button>
                                                </Col>

                                                <Col xs={6} md={4} style={{ textAlign: "right" }}>
                                                    <Button danger onClick={() => dispatch(removeFromCart({ userId, productId: item.productId }))}>❌ {t("Remove")}</Button>
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    )}
                                />
                                <Divider />

                                <Row>
                                    <Col span={12}>
                                        <Button
                                            danger
                                            onClick={() => dispatch(clearCart({ userId }))}
                                            style={{ borderRadius: "6px" }}
                                        >
                                            🗑 {t("Clear All")}
                                        </Button>
                                    </Col>
                                    <Col span={12} style={{ textAlign: "right" }}>
                                        {totalOriginalPrice > totalPrice ? (
                                            <>
                                                <Text delete style={{ color: "#999", marginRight: "10px" }}>
                                                    {t("Original total")}: {formatPrice(totalOriginalPrice)}
                                                </Text>
                                                <Title level={4} style={{ color: "#ff4d4f", margin: 0 }}>
                                                    {t("Total")}: {formatPrice(totalPrice)}
                                                </Title>
                                                <Text type="success">
                                                    {t("You saved")}: {formatPrice(totalOriginalPrice - totalPrice)}
                                                    {` (${Math.round(((totalOriginalPrice - totalPrice) / totalOriginalPrice) * 100)}%)`}
                                                </Text>
                                            </>
                                        ) : (
                                            <Title level={4}>
                                                {t("Total")}: {formatPrice(totalPrice)}
                                            </Title>
                                        )}
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: "20px" }}>
                                    <Col span={12}></Col>

                                    <Col span={12} style={{ textAlign: "right" }}>
                                        <Link to="/cart/checkout">
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<CreditCardOutlined />}
                                                style={{
                                                    borderRadius: "8px",
                                                    background: "#52c41a",
                                                    boxShadow: "0 4px 10px rgba(82, 196, 26, 0.3)"
                                                }}
                                                onClick={handleCheckout}
                                            >
                                                {t("Checkout")}
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    </Content>
                </Container>
            </Layout>
            <AppFooter />
        </>
    );
};

export default Cart;