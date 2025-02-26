import { Layout, List, Button, Typography, Row, Col, Card, Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from "../../../Store/reducer/cartReducer";
import { Container } from "react-bootstrap";

const { Content } = Layout;
const { Title, Text } = Typography;

const Cart = () => {
    const { _id: userId } = useSelector((state) => state.user?.user) || {};
    const cartItems = useSelector((state) => state.cart.items[userId] || []);
    const dispatch = useDispatch();


    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Layout style={{ minHeight: "100vh", padding: "50px", backgroundColor: "#f8f9fa" }}>
            <Container>
                <Content>
                    <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>🛒 Giỏ Hàng Của Bạn</Title>

                    {cartItems.length === 0 ? (
                        <Text strong style={{ display: "block", textAlign: "center", fontSize: "18px" }}>
                            Giỏ hàng của bạn đang trống! 🛍️
                        </Text>
                    ) : (
                        <Card style={{ padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={cartItems}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Row gutter={16} style={{ width: "100%", alignItems: "center" }}>
                                            {/* Hình ảnh sản phẩm */}
                                            <Col xs={6} md={4}>
                                                <img src={item.image} alt={item.name} style={{ width: "100%", borderRadius: "8px" }} />
                                            </Col>

                                            {/* Thông tin sản phẩm */}
                                            <Col xs={12} md={12}>
                                                <Text strong>{item.name}</Text>
                                                <br />
                                                <Text>${item.price} x {item.quantity} = <strong>${item.price * item.quantity}</strong></Text>
                                            </Col>

                                            {/* Nút tăng giảm số lượng */}
                                            <Col xs={6} md={4} style={{ textAlign: "right" }}>
                                                <Button size="small" onClick={() => dispatch(increaseQuantity({ userId, productId: item.productId }))}>➕</Button>
                                                <Text style={{ margin: "0 10px" }}>{item.quantity}</Text>
                                                <Button size="small" onClick={() => dispatch(decreaseQuantity({ userId, productId: item.productId }))} disabled={item.quantity === 1}>➖</Button>
                                            </Col>

                                            {/* Nút xóa */}
                                            <Col xs={6} md={4} style={{ textAlign: "right" }}>
                                                <Button danger onClick={() => dispatch(removeFromCart({ userId, productId: item.productId }))}>❌ Xóa</Button>
                                            </Col>
                                        </Row>
                                    </List.Item>
                                )}
                            />
                            <Divider />
                            <Title level={4} style={{ textAlign: "right" }}>Tổng Tiền: ${totalPrice}</Title>
                            <Button type="primary" danger block onClick={() => dispatch(clearCart({ userId }))}>
                                🗑 Xóa Tất Cả
                            </Button>
                        </Card>
                    )}
                </Content>
            </Container>
        </Layout>
    );
};

export default Cart;
