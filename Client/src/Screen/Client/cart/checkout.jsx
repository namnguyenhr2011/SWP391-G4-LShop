import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
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
import { userProfile } from "../../../service/client/ApiServices";
import { createOrder, create_VnPay } from "../../../service/client/ApiOrder";
import { clearCart } from "../../../store/reducer/cart-reducer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Option } = Select;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const token = useSelector((state) => state.user?.user?.token) || "";
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { _id: userId } = useSelector((state) => state.user?.user) || {};
  const cartItems = useSelector((state) => state.cart.items[userId] || []);

  // Theme styles từ Cart
  const themeStyles = {
    textColor: isDarkMode ? "#e6edf3" : "#1c1e21",
    cardBackground: isDarkMode ? "#1c2526" : "#fff",
    backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
    buttonBg: isDarkMode ? "#1890ff" : "#1890ff",
    buttonHoverBg: isDarkMode ? "#40a9ff" : "#40a9ff",
  };

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
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchUserProfile();
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, [token]);

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
    paymentMethod: "COD",
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
      <Container
        style={{
          minHeight: "100vh",
          backgroundColor: themeStyles.backgroundColor,
          color: themeStyles.textColor,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Header />
        <Title level={2} style={{ color: themeStyles.textColor }}>
          Giỏ hàng trống
        </Title>
        <Text style={{ color: themeStyles.textColor, marginBottom: "20px" }}>
          Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
        </Text>
        <Button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: themeStyles.buttonBg,
            borderColor: themeStyles.buttonBg,
            color: "#fff",
          }}
        >
          Quay lại mua sắm
        </Button>
        <AppFooter style={{ marginTop: "auto" }} />
      </Container>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
  };

  const handleBankChange = (value) => {
    setFormData({ ...formData, bankCode: value });
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
        totalAmount,
        paymentMethod: formData.paymentMethod,
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
        if (vnPayResponse && vnPayResponse.url) {
          localStorage.setItem("pendingOrderId", orderId);
          window.location.href = vnPayResponse.url;
          return;
        }
      } else {
        dispatch(clearCart({ userId }));
        navigate("/");
        toast.success("Đặt hàng thành công!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container
        fluid
        style={{
          minHeight: "100vh",
          backgroundColor: themeStyles.backgroundColor,
          color: themeStyles.textColor,
          padding: "0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container style={{ flex: "1 0 auto", padding: "20px 0" }}>
          <Title
            level={2}
            style={{
              color: themeStyles.textColor,
              textAlign: "center",
              marginTop: "80px",
              marginBottom: "40px",
            }}
          >
            <CreditCardOutlined /> Thanh Toán Đơn Hàng
          </Title>

          <Row gutter={[16, 16]}>
            {/* Giỏ hàng - Bên trái */}
            <Col xs={24} md={6}>
              <div
                style={{
                  backgroundColor: themeStyles.cardBackground,
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  border: isDarkMode ? "1px solid #444" : "1px solid #e8e8e8",
                }}
              >
                <Title level={4} style={{ color: themeStyles.textColor }}>
                  <ShoppingOutlined /> Thông Tin Giỏ Hàng
                </Title>
                <List
                  itemLayout="horizontal"
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item>
                      <Row style={{ width: "100%", alignItems: "center" }}>
                        <Col xs={3}>
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              maxWidth: "100px",
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: "100%",
                                borderRadius: "8px",
                                backgroundColor: "#fff",
                                padding: "5px",
                                objectFit: "cover",
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
                                }}
                              >
                                <FireOutlined /> Sale
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col xs={9}>
                          <Text strong style={{ color: themeStyles.textColor }}>
                            {item.name}
                          </Text>
                          <br />
                          {item.isSale ? (
                            <>
                              <Text
                                delete
                                style={{
                                  color: isDarkMode ? "#999" : "#666",
                                  marginRight: "10px",
                                }}
                              >
                                {formatPrice(item.originalPrice)}
                              </Text>
                              <Text strong style={{ color: "#ff4d4f" }}>
                                {formatPrice(item.price)}
                              </Text>
                              <br />
                              <Text type="success">
                                Giảm:{" "}
                                {formatPrice(item.originalPrice - item.price)} (
                                {Math.round(
                                  ((item.originalPrice - item.price) /
                                    item.originalPrice) *
                                    100
                                )}
                                %)
                              </Text>
                              <br />
                              <Text style={{ color: themeStyles.textColor }}>
                                {formatPrice(item.price)} x {item.quantity} ={" "}
                                <strong>
                                  {formatPrice(item.price * item.quantity)}
                                </strong>
                              </Text>
                            </>
                          ) : (
                            <Text style={{ color: themeStyles.textColor }}>
                              {formatPrice(item.price)} x {item.quantity} ={" "}
                              <strong>
                                {formatPrice(item.price * item.quantity)}
                              </strong>
                            </Text>
                          )}
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
                <Divider
                  style={{ backgroundColor: isDarkMode ? "#444" : "#e8e8e8" }}
                />
                <Row justify="space-between">
                  {totalOriginalPrice > totalAmount ? (
                    <>
                      <Col>
                        <Text
                          delete
                          style={{
                            color: isDarkMode ? "#999" : "#666",
                            marginRight: "10px",
                          }}
                        >
                          Tổng gốc: {formatPrice(totalOriginalPrice)}
                        </Text>
                        <Text strong style={{ color: "#ff4d4f" }}>
                          Tổng cộng: {formatPrice(totalAmount)}
                        </Text>
                        <br />
                        <Text type="success">
                          Tiết kiệm:{" "}
                          {formatPrice(totalOriginalPrice - totalAmount)} (
                          {Math.round(
                            ((totalOriginalPrice - totalAmount) /
                              totalOriginalPrice) *
                              100
                          )}
                          %)
                        </Text>
                      </Col>
                    </>
                  ) : (
                    <Title level={4} style={{ color: themeStyles.textColor }}>
                      Tổng cộng: {formatPrice(totalAmount)}
                    </Title>
                  )}
                </Row>
              </div>
            </Col>

            {/* Thông tin thanh toán - Bên phải */}
            <Col xs={24} md={6}>
              <div
                style={{
                  backgroundColor: themeStyles.cardBackground,
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  border: isDarkMode ? "1px solid #444" : "1px solid #e8e8e8",
                }}
              >
                <Title level={4} style={{ color: themeStyles.textColor }}>
                  <CreditCardOutlined /> Thông Tin Thanh Toán
                </Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: themeStyles.textColor }}>
                      <UserOutlined /> Họ và tên
                    </Form.Label>
                    <Input
                      value={profile?.name || "Chưa có thông tin"}
                      disabled
                      style={{
                        backgroundColor: isDarkMode ? "#2b2e34" : "#fff",
                        color: themeStyles.textColor,
                        borderColor: isDarkMode ? "#444" : "#d9d9d9",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: themeStyles.textColor }}>
                      <MailOutlined /> Email
                    </Form.Label>
                    <Input
                      value={profile?.email || "Chưa có email"}
                      disabled
                      style={{
                        backgroundColor: isDarkMode ? "#2b2e34" : "#fff",
                        color: themeStyles.textColor,
                        borderColor: isDarkMode ? "#444" : "#d9d9d9",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: themeStyles.textColor }}>
                      <CreditCardOutlined /> Phương thức thanh toán
                    </Form.Label>
                    <Radio.Group
                      onChange={handlePaymentMethodChange}
                      value={formData.paymentMethod}
                      style={{ color: themeStyles.textColor }}
                    >
                      <Radio
                        value="COD"
                        style={{ color: themeStyles.textColor }}
                      >
                        Thanh toán khi nhận hàng (COD)
                      </Radio>
                      <Radio
                        value="Bank Transfer"
                        style={{ color: themeStyles.textColor }}
                      >
                        Ví điện tử (VN Pay)
                      </Radio>
                    </Radio.Group>
                  </Form.Group>

                  {formData.paymentMethod === "Bank Transfer" && (
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: themeStyles.textColor }}>
                        <BankOutlined /> Chọn ngân hàng
                      </Form.Label>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn ngân hàng"
                        onChange={handleBankChange}
                        value={formData.bankCode}
                        dropdownStyle={{
                          backgroundColor: themeStyles.cardBackground,
                          color: themeStyles.textColor,
                        }}
                      >
                        {bankOptions.map((bank) => (
                          <Option
                            key={bank.value}
                            value={bank.value}
                            style={{ color: themeStyles.textColor }}
                          >
                            {bank.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: themeStyles.textColor }}>
                      <HomeOutlined /> Địa chỉ giao hàng
                    </Form.Label>
                    <Input
                      placeholder="Nhập địa chỉ giao hàng"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      style={{
                        backgroundColor: isDarkMode ? "#2b2e34" : "#fff",
                        color: themeStyles.textColor,
                        borderColor: isDarkMode ? "#444" : "#d9d9d9",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: themeStyles.textColor }}>
                      <PhoneOutlined /> Số điện thoại
                    </Form.Label>
                    <Input
                      placeholder="Nhập số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        backgroundColor: isDarkMode ? "#2b2e34" : "#fff",
                        color: themeStyles.textColor,
                        borderColor: isDarkMode ? "#444" : "#d9d9d9",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: themeStyles.textColor }}>
                      <CommentOutlined /> Ghi chú đơn hàng
                    </Form.Label>
                    <TextArea
                      rows={4}
                      placeholder="Nhập ghi chú (nếu có)"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      style={{
                        backgroundColor: isDarkMode ? "#2b2e34" : "#fff",
                        color: themeStyles.textColor,
                        borderColor: isDarkMode ? "#444" : "#d9d9d9",
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    style={{
                      width: "100%",
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                      color: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 10px rgba(82, 196, 26, 0.3)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#73d13d")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#52c41a")
                    }
                  >
                    {loading ? "Đang xử lý..." : "Đặt hàng"}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
        <AppFooter style={{ marginTop: "40px" }} />
      </Container>
    </>
  );
};

export default CheckoutPage;
