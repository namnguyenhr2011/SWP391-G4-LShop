import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Radio, Input, Divider, List, Typography, Select, Tag } from "antd";

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
import { clearCart } from "../../../store/reducer/cartReducer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getDiscountByUser, unassignDiscount } from "../../../Service/Admin/DiscountServices";



const { TextArea } = Input;
const { Text, Title } = Typography;
const { Option } = Select;

const CheckoutPage = () => {
  const { t } = useTranslation("checkout");
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const token = useSelector((state) => state.user?.user?.token) || "";
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Track selected discount
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const response = await getDiscountByUser();
        const now = new Date();
        const allDiscounts = response.flatMap((user) => user.discountId || []);
        const activeDiscounts = allDiscounts.filter((d) => {
          const start = new Date(d.startAt);
          const end = new Date(d.endAt);
          return d.isActive && now >= start && now <= end;
        });
        setDiscounts(activeDiscounts);
      } catch (error) {
        toast.error("Lỗi khi lấy mã giảm giá:" + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, [t]);

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

  // Calculate discounted price
  const discountAmount = selectedDiscount
    ? (totalAmount * selectedDiscount.discountValue) / 100
    : 0;
  const finalAmount = totalAmount - discountAmount;

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
        <Button onClick={() => navigate("/")} />
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

  const handleDiscountChange = (value) => {
    const discount = discounts.find((d) => d._id === value);
    setSelectedDiscount(discount || null);
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
        totalAmount: finalAmount,
        paymentMethod: formData.paymentMethod || "COD",
        paymentStatus: "Pending",
        address: formData.address,
        phone: formData.phone,
        note: formData.note || "",
      };

      const createOrderResponse = await createOrder(finalOrderData);
      const orderId = createOrderResponse.order._id;


      if (selectedDiscount) {
        await unassignDiscount(selectedDiscount._id);
      }

      if (formData.paymentMethod === "Bank Transfer") {
        const vnpayData = {
          amount: finalAmount,
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

      toast.success("Đặt hàng thành công!");
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
        <h2
          className="mb-4 text-center"
          style={{
            color: isDarkMode ? "#ffffff" : "#000000",
            marginTop: "50px",
          }}
        >
          {t("Order Checkout")}
        </h2>

        <Container fluid className="px-lg-5">
          <Row justify="space-around">
            <Col md={6}>
              <Card
                className="mb-3"
                style={{ backgroundColor: isDarkMode ? "#1c1e21" : "#ffffff" }}
              >
                <Card.Header className="bg-primary text-white">
                  <ShoppingOutlined /> {t("Cart Information")}
                </Card.Header>
                <Card.Body
                  style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                >
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
                              style={{
                                position: "relative",
                                width: "80px",
                                height: "80px",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px",
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  maxWidth: "90%",
                                  maxHeight: "100%",
                                  borderRadius: "8px",
                                  objectFit: "contain",
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
                                  <FireOutlined /> {t("Discount")}
                                </div>
                              )}
                            </div>
                          </Col>

                          <Col flex="auto" style={{ overflow: "hidden" }}>
                            <Text
                              strong
                              style={{
                                color: isDarkMode ? "#e6edf3" : "#000000",
                              }}
                            >
                              {item.name}
                            </Text>
                            <br />
                            {item.isSale ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                  }}
                                >
                                  <Text
                                    delete
                                    style={{
                                      fontSize: "14px",
                                      color: isDarkMode ? "#8b949e" : "#6b7280",
                                    }}
                                  >
                                    {formatPrice(item.originalPrice)}
                                  </Text>
                                  <Text
                                    strong
                                    style={{
                                      fontSize: "16px",
                                      color: "#ff4d4f",
                                    }}
                                  >
                                    {formatPrice(item.price)}
                                  </Text>
                                </div>
                                <Text
                                  style={{
                                    fontSize: "14px",
                                    color: isDarkMode ? "#2ecc71" : "#16a34a",
                                  }}
                                >
                                  {t("Saved")}: {formatPrice(item.originalPrice - item.price)} (
                                  {Math.round(
                                    ((item.originalPrice - item.price) / item.originalPrice) * 100
                                  )}
                                  %)
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "15px",
                                    color: isDarkMode ? "#e6edf3" : "#1c2526",
                                  }}
                                >
                                  {t("Quantity")}: {item.quantity} × {formatPrice(item.price)} ={" "}
                                  <Text
                                    strong
                                    style={{
                                      color: isDarkMode ? "#ffffff" : "#000000",
                                    }}
                                  >
                                    {formatPrice(item.price * item.quantity)}
                                  </Text>
                                </Text>
                              </div>
                            ) : (
                              <Text
                                style={{
                                  fontSize: "15px",
                                  color: isDarkMode ? "#e6edf3" : "#1c2526",
                                }}
                              >
                                {t("Quantity")}: {item.quantity} × {formatPrice(item.price)} ={" "}
                                <Text
                                  strong
                                  style={{
                                    color: isDarkMode ? "#ffffff" : "#000000",
                                  }}
                                >
                                  {formatPrice(item.price * item.quantity)}
                                </Text>
                              </Text>
                            )}
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <Card className="mb-3 shadow-sm rounded-4 p-3">
                    <Container fluid>
                      <Row>
                        <Col xs={12} md={8}>
                          {totalOriginalPrice > totalAmount && (
                            <Text
                              delete
                              style={{ color: "#999", fontSize: "16px" }}
                            >
                              {t("Original total")}: {formatPrice(totalOriginalPrice)}
                            </Text>
                          )}

                          {selectedDiscount && (
                            <>
                              <Text style={{ display: "block", fontSize: "16px", marginTop: 8 }}>
                                <Tag color="green">{t("Discount Applied")}</Tag>: {selectedDiscount.discountValue}% (-{formatPrice(discountAmount)})
                              </Text>
                              <Text strong style={{ fontSize: "18px", color: "#ff4d4f", display: "block", marginTop: 8 }}>
                                {t("Final Total")}: {formatPrice(finalAmount)}
                              </Text>
                            </>
                          )}

                          {!selectedDiscount && totalOriginalPrice > totalAmount && (
                            <Text strong style={{ fontSize: "18px", color: "#ff4d4f", display: "block", marginTop: 8 }}>
                              {t("Total")}: {formatPrice(totalAmount)}
                            </Text>
                          )}

                          {(totalOriginalPrice > finalAmount || selectedDiscount) && (
                            <Text type="success" style={{ display: "block", marginTop: 8 }}>
                              {t("You saved")}:{" "}
                              {formatPrice(
                                totalOriginalPrice -
                                finalAmount +
                                (selectedDiscount ? discountAmount : 0)
                              )}{" "}
                              ({Math.round(
                                ((totalOriginalPrice -
                                  finalAmount +
                                  (selectedDiscount ? discountAmount : 0)) /
                                  totalOriginalPrice) *
                                100
                              )}%)
                            </Text>
                          )}
                        </Col>

                        <Col xs={12} md={4} className="d-flex align-items-center justify-content-md-end justify-content-start mt-3 mt-md-0">
                          <Title level={5} style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}>
                            {t("Total")}: {formatPrice(totalAmount)}
                          </Title>
                        </Col>
                      </Row>
                    </Container>
                  </Card>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card
                style={{ backgroundColor: isDarkMode ? "#1c1e21" : "#ffffff" }}
              >
                <Card.Header className="bg-primary text-white">
                  <CreditCardOutlined /> {t("Payment Information")}
                </Card.Header>
                <Card.Body
                  style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                >
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      >
                        <UserOutlined /> {t("Full Name")}
                      </Form.Label>
                      <Input
                        value={profile?.userName || "Chưa có thông tin"}
                        disabled
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      >
                        <MailOutlined /> {t("Email")}
                      </Form.Label>
                      <Input
                        value={profile?.email || "Chưa có email"}
                        disabled
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      >
                        <FireOutlined /> {t("Select Discount")}
                      </Form.Label>
                      <Select
                        style={{ width: "100%" }}
                        placeholder={t("Choose a discount")}
                        onChange={handleDiscountChange}
                        value={selectedDiscount?._id || undefined}
                        allowClear
                      >
                        {discounts.map((discount) => (
                          <Option key={discount._id} value={discount._id}>
                            {discount.discountValue}% -{" "}
                            {new Date(discount.startAt).toLocaleDateString()} to{" "}
                            {new Date(discount.endAt).toLocaleDateString()}
                          </Option>
                        ))}
                      </Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      >
                        <CreditCardOutlined /> {t("Payment Method")}
                      </Form.Label>
                      <div>
                        <Radio.Group
                          onChange={handlePaymentMethodChange}
                          value={formData.paymentMethod}
                        >
                          <Radio value="COD">
                            {t("Cash on delivery (COD)")}
                          </Radio>
                          <Radio value="Bank Transfer">
                            {t("Bank Transfer")}
                          </Radio>
                        </Radio.Group>
                      </div>
                    </Form.Group>

                    {formData.paymentMethod === "Bank Transfer" && (
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                        >
                          <BankOutlined /> {t("Select bank")}
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
                      <Form.Label
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      >
                        <HomeOutlined /> {t("Shipping Address")}
                      </Form.Label>
                      <Input
                        placeholder={t("Enter shipping address")}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      >
                        <PhoneOutlined /> {t("Phone Number")}
                      </Form.Label>
                      <Input
                        placeholder={t("Enter phone number")}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ color: isDarkMode ? "#e6edf3" : "#000000" }}
                      >
                        <CommentOutlined /> {t("Order Note")}
                      </Form.Label>
                      <TextArea
                        rows={4}
                        placeholder={t("Enter notes (optional)")}
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
                        {loading ? t("Processing...") : t("Place Order")}
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