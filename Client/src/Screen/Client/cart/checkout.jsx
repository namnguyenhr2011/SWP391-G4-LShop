import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Radio, Input, Divider, List, Typography, Select } from "antd";
import {
  ShoppingOutlined,
  CreditCardOutlined,
  HomeOutlined,
  PhoneOutlined,
  CommentOutlined,
  UserOutlined,
  MailOutlined,
  BankOutlined,
  FireOutlined,
} from "@ant-design/icons";
import Header from "../../layout/Header";
import AppFooter from "../../layout/Footer";
import { userProfile } from "../../../Service/Client/ApiServices";
import { createOrder, create_VnPay } from "../../../Service/Client/ApiOrder";
import { clearCart } from "../../../Store/reducer/cartReducer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";




const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const token = useSelector((state) => state.user?.user?.token) || "";
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        const userData = await userProfile(token);
        setProfile(userData.user);

        setFormData((prev) => ({
          ...prev,
          address: userData?.user?.address || "",
          phone: userData?.user?.phone || "",
        }));
      } catch (error) {
        toast.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchUserProfile();
  }, [token]);

  const { _id: userId } = useSelector((state) => state.user?.user) || {};
  const cartItems = useSelector((state) => state.cart.items[userId] || []);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalOriginalPrice = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };
  const [formData, setFormData] = useState({
    paymentMethod: "",
    address: "",
    phone: "",
    note: "",
    bankCode: "NCB",
  });

  const bankOptions = [
    { value: "NCB", label: "NCB - Ngân hàng Quốc Dân" },
    { value: "VISA", label: "VISA (No 3DS)" },
    { value: "VISA_3DS", label: "VISA (3DS)" },
    { value: "MASTERCARD", label: "MasterCard (No 3DS)" },
    { value: "JCB", label: "JCB (No 3DS)" },
    { value: "NAPAS", label: "Nhóm Bank qua NAPAS" },
    { value: "EXIMBANK", label: "EXIMBANK" },
    { value: "VPBANK", label: "VPBank" },
    { value: "MBBANK", label: "MBBank" },
    { value: "VIETCOMBANK", label: "Vietcombank" },
    { value: "AGRIBANK", label: "Agribank" },
    { value: "BIDV", label: "BIDV" },
    { value: "TECHCOMBANK", label: "Techcombank" },
  ];

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Giỏ hàng trống</h2>
        <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <Button onClick={navigate("/")} />
      </Container>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (e) => {
    setFormData({
      ...formData,
      paymentMethod: e.target.value,
    });
  };

  const handleBankChange = (value) => {
    setFormData({
      ...formData,
      bankCode: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.address) {
        toast.error("Vui lòng nhập địa chỉ giao hàng");
        return;
      }

      if (!formData.phone) {
        toast.error("Vui lòng nhập số điện thoại");
        return;
      }

      if (cartItems.length === 0) {
        toast.error("Giỏ hàng trống!");
        return;
      }

      if (formData.paymentMethod === "Bank Transfer" && !formData.bankCode) {
        toast.error("Vui lòng chọn ngân hàng thanh toán");
        return;
      }

      const finalOrderData = {
        products: cartItems.map((item) => ({
          productId: item.productId || "",
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        totalAmount: cartItems.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
          0
        ),
        paymentMethod: formData.paymentMethod || "COD",
        paymentStatus: "Pending",
        address: formData.address,
        phone: formData.phone,
        note: formData.note || "",
      };

      const createOrderResponse = await createOrder(finalOrderData);
      const orderId = createOrderResponse.order._id;

      if (formData.paymentMethod === "Bank Transfer") {
        const vnpayData = {
          amount: totalAmount,
          bankCode: formData.bankCode,
          language: "vn",
          orderId: orderId,
        };

        const vnPayResponse = await create_VnPay(vnpayData);

        dispatch(clearCart({ userId }));
        navigate("/");
        toast.success("Đặt hàng thành công!");
        if (vnPayResponse && vnPayResponse.url) {
          localStorage.setItem("pendingOrderId", orderId);
          window.location.href = vnPayResponse.url;
          return;
        }
      }
      toast.success("Đặt hàng thành công!")
      dispatch(clearCart({ userId }));
      navigate("/");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container
        fluid
        className="py-5"
        style={{
          minHeight: "100vh",
          backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
          color: isDarkMode ? "#e6edf3" : "#1c1e21",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>
          Thanh toán đơn hàng
        </h2>

        <Container fluid className="px-lg-5">
          <Row justify="space-around">
            <Col md={6}>
              <Card className="mb-3" style={{ backgroundColor: isDarkMode ? "#1c1e21" : "#ffffff" }}>
                <Card.Header className="bg-primary text-white">
                  <ShoppingOutlined /> Thông tin giỏ hàng
                </Card.Header>
                <Card.Body style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                  <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={(item) => (
                      <List.Item>
                        <Row
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: "100%",
                          }}
                        >
                          <Col xs={6} md={4}>
                            <div
                              style={{ position: "relative", width: "80px" }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  width: "100%",
                                  borderRadius: "8px",
                                  display: "block",
                                }}
                              />
                              {item.isSale && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    background: "rgba(255, 77, 79, 0.9)",
                                    color: "white",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <FireOutlined /> Giảm giá
                                </div>
                              )}
                            </div>
                          </Col>

                          {/* Thông tin sản phẩm */}
                          <Col flex="auto" style={{ overflow: "hidden" }}>
                            <Text strong style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                              {item.name}
                            </Text>
                            <br />
                            {item.isSale ? (
                              <>
                                <Text
                                  delete
                                  style={{ color: "#999", marginRight: "10px" }}
                                >
                                  {formatPrice(item.originalPrice)}
                                </Text>
                                <Text strong style={{ color: "#ff4d4f" }}>
                                  {formatPrice(item.price)}
                                </Text>
                                <br />
                                <Text type="success">
                                  Giảm:{" "}
                                  {formatPrice(item.originalPrice - item.price)}{" "}
                                  (
                                  {Math.round(
                                    ((item.originalPrice - item.price) /
                                      item.originalPrice) *
                                    100
                                  )}
                                  %)
                                </Text>
                                <br />
                                <Text style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                                  {formatPrice(item.price)} x {item.quantity} =
                                  <strong>
                                    {" "}
                                    {formatPrice(item.price * item.quantity)}
                                  </strong>
                                </Text>
                              </>
                            ) : (
                              <Text style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                                {formatPrice(item.price)} x {item.quantity} =
                                <strong>
                                  {" "}
                                  {formatPrice(item.price * item.quantity)}
                                </strong>
                              </Text>
                            )}
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <div className="d-flex justify-content-between">
                    {totalOriginalPrice > totalAmount ? (
                      <>
                        <Text
                          delete
                          style={{ color: "#999", marginRight: "10px" }}
                        >
                          Tổng gốc: {formatPrice(totalOriginalPrice)}
                        </Text>
                        <Text strong style={{ color: "#ff4d4f" }}>
                          Tổng cộng: {formatPrice(totalAmount)}
                        </Text>
                        <Text type="success">
                          Bạn đã tiết kiệm:{" "}
                          {formatPrice(totalOriginalPrice - totalAmount)}
                          {` (${Math.round(
                            ((totalOriginalPrice - totalAmount) /
                              totalOriginalPrice) *
                            100
                          )}%)`}
                        </Text>
                      </>
                    ) : (
                      <h5 style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                        Tổng cộng: {formatPrice(totalAmount)}
                      </h5>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card style={{ backgroundColor: isDarkMode ? "#1c1e21" : "#ffffff" }}>
                <Card.Header className="bg-primary text-white">
                  <CreditCardOutlined /> Thông tin thanh toán
                </Card.Header>
                <Card.Body style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                        <UserOutlined /> Họ và tên
                      </Form.Label>
                      <Input
                        value={profile?.userName || "Chưa có thông tin"}
                        disabled
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                        <MailOutlined /> Email
                      </Form.Label>
                      <Input
                        value={profile?.email || "Chưa có email"}
                        disabled
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                        <CreditCardOutlined /> Phương thức thanh toán
                      </Form.Label>
                      <div>
                        <Radio.Group
                          onChange={handlePaymentMethodChange}
                          value={formData.paymentMethod}
                        >
                          <Radio value="COD">
                            Thanh toán khi nhận hàng (COD)
                          </Radio>
                          <Radio value="Bank Transfer">
                            Ví điện tử (VN Pay)
                          </Radio>
                        </Radio.Group>
                      </div>
                    </Form.Group>

                    {formData.paymentMethod === "Bank Transfer" && (
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                          <BankOutlined /> Chọn ngân hàng thanh toán
                        </Form.Label>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Chọn ngân hàng"
                          onChange={handleBankChange}
                          value={formData.bankCode}
                        >
                          {bankOptions.map((bank) => (
                            <Option key={bank.value} value={bank.value}>
                              {bank.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                        <HomeOutlined /> Địa chỉ giao hàng
                      </Form.Label>
                      <Input
                        placeholder="Nhập địa chỉ giao hàng"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                        <PhoneOutlined /> Số điện thoại
                      </Form.Label>
                      <Input
                        placeholder="Nhập số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                        <CommentOutlined /> Ghi chú đơn hàng
                      </Form.Label>
                      <TextArea
                        rows={4}
                        placeholder="Nhập ghi chú (nếu có)"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? "Đang xử lý..." : "Đặt hàng"}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
      <AppFooter />
    </>
  );


};

export default CheckoutPage;