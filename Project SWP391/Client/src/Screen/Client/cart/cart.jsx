import { Layout, List, Button, Typography, Row, Col, Card, Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from "../../../Store/reducer/cartReducer";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ShoppingOutlined, ArrowLeftOutlined, CreditCardOutlined } from "@ant-design/icons";
import Header from "../../layout/Header";
import AppFooter from "../../layout/Footer";
const { Content } = Layout;
const { Title, Text } = Typography;
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Cart = () => {
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const navigate = useNavigate()
    const { _id: userId } = useSelector((state) => state.user?.user) || {};
    const cartItems = useSelector((state) => state.cart.items[userId] || []);
    const dispatch = useDispatch();

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error({
                message: 'Lỗi',
                description: 'Giỏ hàng của bạn đang trống!',
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



    return (
        <>
            <Header />

            <Layout style={{

                minHeight: "100vh",
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
                                        Tiếp tục mua sắm
                                    </Button>
                                </Link>
                            </Col>
                            <Col span={12} style={{ textAlign: "right" }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    <ShoppingOutlined /> Giỏ Hàng Của Bạn
                                </Title>
                            </Col>
                        </Row>

                        {cartItems.length === 0 ? (
                            <Card style={{ padding: "40px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
                                <Text strong style={{ display: "block", fontSize: "18px", marginBottom: "20px" }}>
                                    Giỏ hàng của bạn đang trống! 🛍️
                                </Text>
                                <Link to="/">
                                    <Button type="primary" size="large" icon={<ShoppingOutlined />}>
                                        Bắt đầu mua sắm ngay
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
                                                    <img src={item.image} alt={item.name} style={{ width: "100%", borderRadius: "8px" }} />
                                                </Col>

                                                <Col xs={12} md={12}>
                                                    <Text strong>{item.name}</Text>
                                                    <br />
                                                    <Text>
                                                        {item.price.toLocaleString("vi-VN")} VND x {item.quantity} =
                                                        <strong> {(item.price * item.quantity).toLocaleString("vi-VN")} VND</strong>
                                                    </Text>

                                                </Col>

                                                <Col xs={6} md={4} style={{ textAlign: "right" }}>
                                                    <Button size="small" onClick={() => dispatch(decreaseQuantity({ userId, productId: item.productId }))} disabled={item.quantity === 1}>➖</Button>
                                                    <Text style={{ margin: "0 10px" }}>{item.quantity}</Text>
                                                    <Button size="small" onClick={() => dispatch(increaseQuantity({ userId, productId: item.productId }))}>➕</Button>
                                                </Col>

                                                <Col xs={6} md={4} style={{ textAlign: "right" }}>
                                                    <Button danger onClick={() => dispatch(removeFromCart({ userId, productId: item.productId }))}>❌ Xóa</Button>
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
                                            🗑 Xóa Tất Cả
                                        </Button>
                                    </Col>
                                    <Col span={12} style={{ textAlign: "right" }}>
                                        <Title level={4}>Tổng Tiền: {totalPrice.toLocaleString("vi-VN")} VND</Title>
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
                                                Thanh toán
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