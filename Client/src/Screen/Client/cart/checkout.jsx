import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import {
  Radio,
  Input,
  notification,
  Divider,
  List,
  Typography,
  Select,
} from "antd";
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
    window.scrollTo(0, 0);
  }, []);

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
      <Container
        className="py-5 text-center"
        style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
      >
        <h2>Giỏ hàng trống</h2>
        <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <Button
          variant={isDarkMode ? "outline-light" : "primary"}
          onClick={() => navigate("/")}
        >
          Quay lại mua sắm
        </Button>
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
        notification.error({
          message: "Lỗi",
          description: "Vui lòng nhập địa chỉ giao hàng",
        });
        return;
      }

      if (!formData.phone) {
        notification.error({
          message: "Lỗi",
          description: "Vui lòng nhập số điện thoại",
        });
        return;
      }

      if (cartItems.length === 0) {
        notification.error({ message: "Lỗi", description: "Giỏ hàng trống!" });
        return;
      }

      if (formData.paymentMethod === "Wallet" && !formData.bankCode) {
        notification.error({
          message: "Lỗi",
          description: "Vui lòng chọn ngân hàng thanh toán",
        });
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
      console.log("API Response:", createOrderResponse);

      if (formData.paymentMethod === "Wallet") {
        const vnpayData = {
          amount: totalAmount,
          bankCode: formData.bankCode,
          language: "vn",
        };

        const vnPayResponse = await create_VnPay(vnpayData);
        console.log("VnPay Response:", vnPayResponse);

        if (vnPayResponse && vnPayResponse.url) {
          window.location.href = vnPayResponse.url;
          return;
        }
      }

      dispatch(clearCart({ userId }));
      navigate("/");
      notification.success({
        message: "Thành công",
        description: "Đặt hàng thành công!",
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  const themeStyles = {
    cardBg: isDarkMode ? "#1c2526" : "#fff",
    cardBorder: isDarkMode ? "1px solid #444" : "1px solid #e8e8e8",
    textColor: isDarkMode ? "#e6edf3" : "#1c1e21",
    inputBg: isDarkMode ? "#2b2e34" : "#fff",
    inputBorder: isDarkMode ? "1px solid #444" : "1px solid #ced4da",
    buttonBg: isDarkMode ? "#1677ff" : "#1677ff",
    buttonHoverBg: isDarkMode ? "#0958d9" : "#0958d9",
    headerBg: isDarkMode ? "#1890ff" : "#1890ff",
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
          color: themeStyles.textColor,
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <h2
          className="mb-4 text-center"
          style={{
            color: themeStyles.textColor,
            marginTop: "80px",
          }}
        >
          Thanh toán đơn hàng
        </h2>

        <Container fluid className="px-lg-5">
          <Row justify="space-around">
            <Col md={6}>
              <Card
                style={{
                  backgroundColor: themeStyles.cardBg,
                  border: themeStyles.cardBorder,
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Header
                  style={{
                    backgroundColor: themeStyles.headerBg,
                    color: "#fff",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <ShoppingOutlined /> Thông tin giỏ hàng
                </Card.Header>
                <Card.Body>
                  <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={(item) => (
                      <List.Item style={{ alignItems: "center" }}>
                        <Row
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: "100%",
                            minHeight: "100px",
                            marginLeft: "0px",
                          }}
                        >
                          <Col xs={6} md={4}>
                            <div
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                                padding: "5px",
                                backgroundColor: isDarkMode ? "#fff" : "#fff",
                                borderRadius: "10px",
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
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
                          <Col
                            flex="auto"
                            style={{
                              overflow: "hidden",
                              color: themeStyles.textColor,
                            }}
                          >
                            <Text strong>{item.name}</Text>
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
                                <Text style={{ color: themeStyles.textColor }}>
                                  {formatPrice(item.price)} x {item.quantity} =
                                  <strong>
                                    {" "}
                                    {formatPrice(item.price * item.quantity)}
                                  </strong>
                                </Text>
                              </>
                            ) : (
                              <Text style={{ color: themeStyles.textColor }}>
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
                  <Divider
                    style={{ backgroundColor: isDarkMode ? "#444" : "#e8e8e8" }}
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    {totalOriginalPrice > totalAmount ? (
                      <>
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
                      <Text strong style={{ color: themeStyles.textColor }}>
                        Tổng cộng: {formatPrice(totalAmount)}
                      </Text>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card
                style={{
                  backgroundColor: themeStyles.cardBg,
                  border: themeStyles.cardBorder,
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Header
                  style={{
                    backgroundColor: themeStyles.headerBg,
                    color: "#fff",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <CreditCardOutlined /> Thông tin thanh toán
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: themeStyles.textColor }}>
                        <UserOutlined /> Họ và tên
                      </Form.Label>
                      <Input
                        value={profile?.name || "Chưa có thông tin"}
                        disabled
                        style={{
                          backgroundColor: themeStyles.inputBg,
                          border: themeStyles.inputBorder,
                          color: themeStyles.textColor,
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
                          backgroundColor: themeStyles.inputBg,
                          border: themeStyles.inputBorder,
                          color: themeStyles.textColor,
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: themeStyles.textColor }}>
                        <CreditCardOutlined /> Phương thức thanh toán
                      </Form.Label>
                      <div>
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
                            value="Wallet"
                            style={{ color: themeStyles.textColor }}
                          >
                            Ví điện tử (VN Pay)
                          </Radio>
                          <Radio
                            value="Bank Transfer"
                            style={{ color: themeStyles.textColor }}
                          >
                            Chuyển khoản ngân hàng
                          </Radio>
                        </Radio.Group>
                      </div>
                    </Form.Group>

                    {formData.paymentMethod === "Wallet" && (
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: themeStyles.textColor }}>
                          <BankOutlined /> Chọn ngân hàng thanh toán
                        </Form.Label>
                        <Select
                          style={{
                            width: "100%",
                            backgroundColor: themeStyles.inputBg,
                            color: themeStyles.textColor,
                          }}
                          placeholder="Chọn ngân hàng"
                          onChange={handleBankChange}
                          value={formData.bankCode}
                          dropdownStyle={{
                            backgroundColor: themeStyles.inputBg,
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

                    <Form.Group className="mb-5">
                      <Form.Label style={{ color: themeStyles.textColor }}>
                        <HomeOutlined /> Địa chỉ giao hàng
                      </Form.Label>
                      <Input
                        placeholder="Nhập địa chỉ giao hàng"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        style={{
                          backgroundColor: themeStyles.inputBg,
                          border: themeStyles.inputBorder,
                          color: themeStyles.textColor,
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-5">
                      <Form.Label style={{ color: themeStyles.textColor }}>
                        <PhoneOutlined /> Số điện thoại
                      </Form.Label>
                      <Input
                        placeholder="Nhập số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          backgroundColor: themeStyles.inputBg,
                          border: themeStyles.inputBorder,
                          color: themeStyles.textColor,
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-5">
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
                          backgroundColor: themeStyles.inputBg,
                          border: themeStyles.inputBorder,
                          color: themeStyles.textColor,
                        }}
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        variant={isDarkMode ? "outline-light" : "primary"}
                        size="lg"
                        disabled={loading}
                        style={{
                          backgroundColor: themeStyles.buttonBg,
                          borderColor: themeStyles.buttonBg,
                          color: "#fff",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor =
                            themeStyles.buttonHoverBg;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = themeStyles.buttonBg;
                        }}
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
