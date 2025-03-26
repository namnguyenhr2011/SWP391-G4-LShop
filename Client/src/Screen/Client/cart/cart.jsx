import {
  Layout,
  List,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Divider,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../../store/reducer/cartReducer";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  ShoppingOutlined,
  ArrowLeftOutlined,
  CreditCardOutlined,
  FireOutlined,
} from "@ant-design/icons";
import Header from "../../layout/Header";
import AppFooter from "../../layout/Footer";
const { Content } = Layout;
const { Title, Text } = Typography;
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Cart = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const navigate = useNavigate();
  const { _id: userId } = useSelector((state) => state.user?.user) || {};
  const cartItems = useSelector((state) => state.cart.items[userId] || []);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalOriginalPrice = cartItems.reduce(
    (total, item) => total + (item.originalPrice || item.price) * item.quantity,
    0
  );

  // Cuộn lên đầu trang khi component được render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error({
        message: "Lỗi",
        description: "Giỏ hàng của bạn đang trống!",
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
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  // Theme styles for buttons
  const themeStyles = {
    deleteButtonBg: isDarkMode ? "#ff4d4f" : "#ff4d4f",
    deleteButtonHoverBg: isDarkMode ? "#ff7875" : "#ff7875",
    deleteButtonColor: isDarkMode ? "#fff" : "#fff",
    textColor: isDarkMode ? "#e6edf3" : "#1c1e21",
    cardBackground: isDarkMode ? "#1c2526" : "#fff",
  };

  return (
    <>
      <Header />

      <Layout
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
          color: themeStyles.textColor,
          transition: "background-color 0.3s ease, color 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container style={{ flex: "1 0 auto" }}>
          <Content style={{ marginTop: "100px", paddingBottom: "60px" }}>
            <Row align="middle" style={{ marginBottom: "50px" }}>
              <Col span={12}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    size="large"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      color: themeStyles.textColor,
                      borderColor: isDarkMode ? "#444" : "#d9d9d9",
                      backgroundColor: isDarkMode ? "#2b2e34" : "#fff",
                    }}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Title
                  level={2}
                  style={{ margin: 0, color: themeStyles.textColor }}
                >
                  <ShoppingOutlined /> Giỏ Hàng Của Bạn
                </Title>
              </Col>
            </Row>

            {cartItems.length === 0 ? (
              <Card
                style={{
                  padding: "40px",
                  borderRadius: "20px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  backgroundColor: themeStyles.cardBackground,
                  border: isDarkMode ? "1px solid #444" : "1px solid #e8e8e8",
                  minHeight: "200px", // Đảm bảo card có chiều cao tối thiểu
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text
                  strong
                  style={{
                    display: "block",
                    fontSize: "18px",
                    marginBottom: "20px",
                    color: themeStyles.textColor,
                  }}
                >
                  Giỏ hàng của bạn đang trống! 🛍️
                </Text>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingOutlined />}
                    style={{
                      backgroundColor: isDarkMode ? "#1890ff" : "#1890ff",
                      borderColor: isDarkMode ? "#1890ff" : "#1890ff",
                      color: "#fff",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      margin: "0 auto",
                    }}
                  >
                    Bắt đầu mua sắm ngay
                  </Button>
                </Link>
              </Card>
            ) : (
              <Card
                style={{
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  backgroundColor: themeStyles.cardBackground,
                  border: isDarkMode ? "1px solid #444" : "1px solid #e8e8e8",
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item style={{ alignItems: "center" }}>
                      <Row
                        gutter={16}
                        style={{
                          width: "100%",
                          alignItems: "center",
                          minHeight: "100px",
                        }}
                      >
                        <Col xs={6} md={4}>
                          <div
                            style={{
                              position: "relative",
                              width: "120px",
                              height: "120px",
                              padding: "10px",
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
                                display: "block", // Đảm bảo ảnh không bị thêm khoảng cách mặc định
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
                                <FireOutlined /> Giảm giá
                              </div>
                            )}
                          </div>
                        </Col>

                        <Col xs={12} md={12}>
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

                        <Col xs={6} md={4} style={{ textAlign: "center" }}>
                          <Button
                            size="small"
                            onClick={() =>
                              dispatch(
                                decreaseQuantity({
                                  userId,
                                  productId: item.productId,
                                })
                              )
                            }
                            disabled={item.quantity === 1}
                            style={{
                              backgroundColor: isDarkMode
                                ? "#2b2e34"
                                : "#f5f5f5",
                              borderColor: isDarkMode ? "#444" : "#d9d9d9",
                              color: themeStyles.textColor,
                            }}
                          >
                            ➖
                          </Button>
                          <Text
                            style={{
                              margin: "0 10px",
                              color: themeStyles.textColor,
                            }}
                          >
                            {item.quantity}
                          </Text>
                          <Button
                            size="small"
                            onClick={() =>
                              dispatch(
                                increaseQuantity({
                                  userId,
                                  productId: item.productId,
                                })
                              )
                            }
                            style={{
                              backgroundColor: isDarkMode
                                ? "#2b2e34"
                                : "#f5f5f5",
                              borderColor: isDarkMode ? "#444" : "#d9d9d9",
                              color: themeStyles.textColor,
                            }}
                          >
                            ➕
                          </Button>
                        </Col>

                        <Col xs={6} md={4} style={{ textAlign: "right" }}>
                          <Button
                            onClick={() =>
                              dispatch(
                                removeFromCart({
                                  userId,
                                  productId: item.productId,
                                })
                              )
                            }
                            style={{
                              backgroundColor: themeStyles.deleteButtonBg,
                              border: "none",
                              color: themeStyles.deleteButtonColor,
                              borderRadius: "6px",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                themeStyles.deleteButtonHoverBg;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                themeStyles.deleteButtonBg;
                            }}
                          >
                            ⨉ Xóa
                          </Button>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
                <Divider
                  style={{ backgroundColor: isDarkMode ? "#444" : "#e8e8e8" }}
                />

                <Row>
                  <Col span={12}>
                    <Button
                      onClick={() => dispatch(clearCart({ userId }))}
                      style={{
                        backgroundColor: themeStyles.deleteButtonBg,
                        border: "none",
                        color: themeStyles.deleteButtonColor,
                        borderRadius: "6px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          themeStyles.deleteButtonHoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          themeStyles.deleteButtonBg;
                      }}
                    >
                      🗑 Xóa Tất Cả
                    </Button>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    {totalOriginalPrice > totalPrice ? (
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
                        <Title
                          level={4}
                          style={{ color: "#ff4d4f", margin: 0 }}
                        >
                          Tổng Tiền: {formatPrice(totalPrice)}
                        </Title>
                        <Text type="success">
                          Bạn đã tiết kiệm:{" "}
                          {formatPrice(totalOriginalPrice - totalPrice)}
                          {` (${Math.round(
                            ((totalOriginalPrice - totalPrice) /
                              totalOriginalPrice) *
                              100
                          )}%)`}
                        </Text>
                      </>
                    ) : (
                      <Title level={4} style={{ color: themeStyles.textColor }}>
                        Tổng Tiền: {formatPrice(totalPrice)}
                      </Title>
                    )}
                  </Col>
                </Row>

                <Row style={{ marginTop: "30px", justifyContent: "flex-end" }}>
                  <Col>
                    <Button
                      type="primary"
                      size="large"
                      icon={<CreditCardOutlined />}
                      style={{
                        borderRadius: "8px",
                        background: "#52c41a",
                        border: "none",
                        boxShadow: "0 4px 10px rgba(82, 196, 26, 0.3)",
                      }}
                      onClick={handleCheckout}
                    >
                      Thanh toán
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}
          </Content>
        </Container>
        <AppFooter style={{ marginTop: "40px" }} />
      </Layout>
    </>
  );
};

export default Cart;
