import { toast } from "react-toastify";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../../store/reducer/cartReducer";
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
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingOutlined,
  ArrowLeftOutlined,
  CreditCardOutlined,
  FireOutlined,
} from "@ant-design/icons";
import Header from "../../layout/Header";
import AppFooter from "../../layout/Footer";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import BottomAds from "../../../Component/BottomAds"
import LeftAdsBanner from "../../../Component/LeftAds";
import RightAdsBanner from "../../../Component/RightAds";

const { Content } = Layout;
const { Title, Text } = Typography;

const Cart = () => {
  const { t } = useTranslation("cart");
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const navigate = useNavigate();
  const { _id: userId } = useSelector((state) => state.user?.user) || {};
  const cartItems = useSelector((state) => state.cart.items[userId] || []);
  const dispatch = useDispatch();

  // Cuộn lên đầu trang khi component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalOriginalPrice = cartItems.reduce(
    (total, item) => total + (item.originalPrice || item.price) * item.quantity,
    0
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
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  return (
    <>
      <Header />

      <Layout
        style={{
          minHeight: "90vh",
          width: "100%",
          backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
          color: isDarkMode ? "#e6edf3" : "#1c1e21",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Container>
          <Content style={{ margin: "100px 0px" }}>
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
                      alignItems: "center",
                      backgroundColor: isDarkMode ? "#21262d" : "#fff",
                      color: isDarkMode ? "#e6edf3" : "#1c1e21",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ textDecoration: "none" }}>
                      {t("Continue shopping")}
                    </span>
                  </Button>
                </Link>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: isDarkMode ? "#e6edf3" : "#1c1e21",
                  }}
                >
                  <ShoppingOutlined /> {t("Your Cart")}
                </Title>
              </Col>
            </Row>

            {cartItems.length === 0 ? (
              <Card
                style={{
                  padding: "40px",
                  borderRadius: "20px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  backgroundColor: isDarkMode ? "#161b22" : "#fff",
                  color: isDarkMode ? "#e6edf3" : "#1c1e21",
                  display: "flex", // Sử dụng flex để căn giữa
                  flexDirection: "column", // Xếp dọc
                  justifyContent: "center", // Căn giữa theo chiều dọc
                  alignItems: "center", // Căn giữa theo chiều ngang
                  minHeight: "300px", // Đảm bảo chiều cao đủ để căn giữa
                }}
              >
                <Text
                  strong
                  style={{
                    display: "block",
                    fontSize: "18px",
                    marginBottom: "20px",
                    color: isDarkMode ? "#e6edf3" : "#1c1e21",
                  }}
                >
                  {t("Your cart is empty! 🛍️")}
                </Text>
                <Link to="/">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingOutlined />}
                    style={{
                      backgroundColor: isDarkMode ? "#238636" : "#52c41a",
                      borderColor: isDarkMode ? "#238636" : "#52c41a",
                      boxShadow: "none",
                      border: "none",
                    }}
                  >
                    {t("Start shopping now")}
                  </Button>
                </Link>
              </Card>
            ) : (
              <Card
                style={{
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  backgroundColor: isDarkMode ? "#161b22" : "#fff",
                  color: isDarkMode ? "#e6edf3" : "#1c1e21",
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item>
                      <Row
                        gutter={16}
                        style={{ width: "100%", alignItems: "center" }}
                      >
                        <Col xs={6} md={4}>
                          <div
                            style={{
                              position: "relative",
                              padding: "8px",
                              backgroundColor: "white",
                              borderRadius: "8px",
                              height: "150px", // Cố định chiều cao
                              display: "flex", // Sử dụng flex để căn giữa ảnh
                              alignItems: "center", // Căn giữa theo chiều dọc
                              justifyContent: "center", // Căn giữa theo chiều ngang
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                maxWidth: "90%", // Đảm bảo ảnh không vượt quá 90% chiều rộng
                                maxHeight: "100%", // Đảm bảo ảnh không vượt quá chiều cao của div
                                borderRadius: "8px",
                                objectFit: "contain", // Giữ tỷ lệ ảnh, không bị méo
                              }}
                            />
                            {item.isSale && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                  background: "rgba(255, 77, 79, 0.9)",
                                  color: "white",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                <FireOutlined /> {t("Discount")}
                              </div>
                            )}
                          </div>
                        </Col>

                        <Col xs={12} md={12}>
                          <Text
                            strong
                            style={{
                              color: isDarkMode ? "#e6edf3" : "#1c1e21",
                            }}
                          >
                            {item.name}
                          </Text>
                          <br />
                          {item.isSale ? (
                            <>
                              <Text
                                delete
                                style={{
                                  color: isDarkMode ? "#8b949e" : "#999",
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
                                {t("Discount")}:{" "}
                                {formatPrice(item.originalPrice - item.price)}(
                                {Math.round(
                                  ((item.originalPrice - item.price) /
                                    item.originalPrice) *
                                  100
                                )}
                                %)
                              </Text>
                              <br />
                              <Text
                                style={{
                                  color: isDarkMode ? "#e6edf3" : "#1c1e21",
                                }}
                              >
                                {formatPrice(item.price)} x {item.quantity} =
                                <strong>
                                  {" "}
                                  {formatPrice(item.price * item.quantity)}
                                </strong>
                              </Text>
                            </>
                          ) : (
                            <Text
                              style={{
                                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                              }}
                            >
                              {formatPrice(item.price)} x {item.quantity} =
                              <strong>
                                {" "}
                                {formatPrice(item.price * item.quantity)}
                              </strong>
                            </Text>
                          )}
                        </Col>

                        <Col xs={6} md={4} style={{ textAlign: "right" }}>
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
                              backgroundColor: isDarkMode ? "#21262d" : "#fff",
                              color: isDarkMode ? "#e6edf3" : "#1c1e21",
                            }}
                          >
                            ➖
                          </Button>
                          <Text
                            style={{
                              margin: "0 10px",
                              color: isDarkMode ? "#e6edf3" : "#1c1e21",
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
                              backgroundColor: isDarkMode ? "#21262d" : "#fff",
                              color: isDarkMode ? "#e6edf3" : "#1c1e21",
                            }}
                          >
                            ➕
                          </Button>
                        </Col>

                        <Col xs={6} md={4} style={{ textAlign: "right" }}>
                          <Button
                            danger
                            onClick={() =>
                              dispatch(
                                removeFromCart({
                                  userId,
                                  productId: item.productId,
                                })
                              )
                            }
                            style={{
                              borderRadius: "6px",
                              backgroundColor: isDarkMode ? "#21262d" : "#fff",
                              color: isDarkMode ? "#ff4d4f" : undefined,
                              borderColor: isDarkMode ? "#ff4d4f" : undefined,
                              boxShadow: "none",
                            }}
                          >
                            ❌ {t("Remove")}
                          </Button>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
                <Divider
                  style={{
                    backgroundColor: isDarkMode ? "#30363d" : "#e8e8e8",
                  }}
                />

                <Row>
                  <Col span={12}>
                    <Button
                      danger
                      onClick={() => dispatch(clearCart({ userId }))}
                      style={{
                        borderRadius: "6px",
                        backgroundColor: isDarkMode ? "#21262d" : "#fff",
                        color: isDarkMode ? "#ff4d4f" : undefined,
                        borderColor: isDarkMode ? "#ff4d4f" : undefined,
                        boxShadow: "none",
                      }}
                    >
                      🗑 {t("Clear All")}
                    </Button>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    {totalOriginalPrice > totalPrice ? (
                      <>
                        <Text
                          delete
                          style={{
                            color: isDarkMode ? "#8b949e" : "#999",
                            marginRight: "10px",
                          }}
                        >
                          {t("Original total")}:{" "}
                          {formatPrice(totalOriginalPrice)}
                        </Text>
                        <Title
                          level={4}
                          style={{ color: "#ff4d4f", margin: 0 }}
                        >
                          {t("Total")}: {formatPrice(totalPrice)}
                        </Title>
                        <Text type="success">
                          {t("You saved")}:{" "}
                          {formatPrice(totalOriginalPrice - totalPrice)}
                          {` (${Math.round(
                            ((totalOriginalPrice - totalPrice) /
                              totalOriginalPrice) *
                            100
                          )}%)`}
                        </Text>
                      </>
                    ) : (
                      <Title
                        level={4}
                        style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
                      >
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
                          background: isDarkMode ? "#238636" : "#52c41a",
                          borderColor: isDarkMode ? "#238636" : "#52c41a",
                          boxShadow: "0 4px 10px rgba(82, 196, 26, 0.3)",
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
      <BottomAds />
      <LeftAdsBanner />
      <RightAdsBanner />
    </>
  );
};

export default Cart;
