import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Radio, Input, notification, Divider, List, Typography } from 'antd';
import { ShoppingOutlined, CreditCardOutlined, HomeOutlined, PhoneOutlined, CommentOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import Header from '../../layout/Header';
import AppFooter from '../../layout/Footer';
import { userProfile } from '../../../Service/Client/ApiServices';
import { createOrder } from '../../../Service/Client/ApiOrder';


const { TextArea } = Input;
const { Text } = Typography;

const CheckoutPage = () => {
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const token = useSelector((state) => state.user?.user?.token) || "";
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) return;

            try {
                const userData = await userProfile(token);
                console.log(userData);
                setProfile(userData.user);

                setFormData((prev) => ({
                    ...prev,
                    address: userData?.user?.address || "",
                    phone: userData?.user?.phone || "",
                }));
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUserProfile();
    }, [token]);


    const { _id: userId } = useSelector((state) => state.user?.user) || {};
    const cartItems = useSelector((state) => state.cart.items[userId] || []);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [formData, setFormData] = useState({
        paymentMethod: "",
        address: "",
        phone: "",
        note: ""
    });

    if (cartItems.length === 0) {
        return (
            <Container className="py-5 text-center">
                <h2>Giỏ hàng trống</h2>
                <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
            </Container>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentMethodChange = (e) => {
        setFormData({
            ...formData,
            paymentMethod: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.address) {
            notification.error({ message: 'Lỗi', description: 'Vui lòng nhập địa chỉ giao hàng' });
            return;
        }

        if (!formData.phone) {
            notification.error({ message: 'Lỗi', description: 'Vui lòng nhập số điện thoại' });
            return;
        }

        if (cartItems.length === 0) {
            notification.error({ message: 'Lỗi', description: 'Giỏ hàng trống!' });
            return;
        }


        const finalOrderData = {
            products: cartItems.map(item => ({
                productId: item.productId || "", 
                quantity: item.quantity || 1, 
                price: item.price || 0 
            })),
            totalAmount: cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
            paymentMethod: formData.paymentMethod || "COD", 
            paymentStatus: "Pending",
            address: formData.address,
            phone: formData.phone,
            note: formData.note || "",
        };

        console.log("Final Order Data:", finalOrderData);

        try {
            const createOrderRequest = await createOrder(finalOrderData);
            console.log("API Response:", createOrderRequest);

            notification.success({
                message: 'Thành công',
                description: 'Đặt hàng thành công!',
            });
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!',
            });
        }
    }

    return (
        <>
            <Header />
            <Container className="py-5" style={{

                minHeight: "100vh",
                backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}>
                <h2 className="mb-4 text-center">Thanh toán đơn hàng</h2>

                <Row>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header className="bg-primary text-white">
                                <ShoppingOutlined /> Thông tin giỏ hàng
                            </Card.Header>
                            <Card.Body>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={cartItems}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Row gutter={16} style={{ width: "100%", alignItems: "center" }}>
                                                <Col xs={6} md={4}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={{ width: "100%", borderRadius: "8px" }}
                                                    />
                                                </Col>

                                                <Col xs={12} md={12}>
                                                    <Text strong>{item.name}</Text>
                                                    <br />
                                                    <Text>
                                                        {item.price.toLocaleString("vi-VN")} VND x {item.quantity} =
                                                        <strong> {(item.price * item.quantity).toLocaleString("vi-VN")} VND</strong>
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    )}
                                />
                                <Divider />
                                <div className="d-flex justify-content-between">
                                    <h5>Tổng cộng:</h5>
                                    <h5>{totalAmount.toLocaleString()} đ</h5>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card>
                            <Card.Header className="bg-primary text-white">
                                <CreditCardOutlined /> Thông tin thanh toán
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label><UserOutlined /> Họ và tên</Form.Label>
                                        <Input value={profile?.name || "Chưa có thông tin"} disabled />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label><MailOutlined /> Email</Form.Label>
                                        <Input value={profile?.email || "Chưa có email"} disabled />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label><CreditCardOutlined /> Phương thức thanh toán</Form.Label>
                                        <div>
                                            <Radio.Group onChange={handlePaymentMethodChange} value={formData.paymentMethod}>
                                                <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                                                <Radio value="Wallet">Ví điện tử (VN Pay)</Radio>
                                                <Radio value="Bank Transfer">Chuyển khoản ngân hàng</Radio>
                                            </Radio.Group>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label><HomeOutlined /> Địa chỉ giao hàng</Form.Label>
                                        <Input
                                            placeholder="Nhập địa chỉ giao hàng"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label><PhoneOutlined /> Số điện thoại</Form.Label>
                                        <Input
                                            placeholder="Nhập số điện thoại"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label><CommentOutlined /> Ghi chú đơn hàng</Form.Label>
                                        <TextArea
                                            rows={4}
                                            placeholder="Nhập ghi chú (nếu có)"
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        <Button type="submit" variant="primary" size="lg">
                                            Đặt hàng
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <AppFooter />
        </>
    );
};

export default CheckoutPage;
