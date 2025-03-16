import { Row, Col, Card, Typography, Spin, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons"; // Thêm icon giỏ hàng
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/reducer/cartReducer";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const ProductCard = ({ products, loading, isDarkMode, onProductClick }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user._id);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin
          size="large"
          style={{
            color: isDarkMode ? "#e6edf3" : "#1c1e21",
          }}
        />
      </div>
    );
  }

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error("Vui lòng đăng nhập để mua hàng.");
      return;
    }

    dispatch(
      addToCart({
        userId: userId,
        item: {
          productId: product._id,
          name: product.name,
          price: product.price ? Number(product.price) : 0,
          image: product.image,
          quantity: 1,
        },
      })
    );
    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const themeStyles = {
    cardBackground: isDarkMode ? "#2b2e34" : "#ffffff",
    cardBorder: isDarkMode ? "1px solid #444" : "1px solid #e8e8e8",
    cardShadow: isDarkMode
      ? "0 6px 20px rgba(0, 0, 0, 0.4)"
      : "0 6px 20px rgba(0, 0, 0, 0.1)",
    textColor: isDarkMode ? "#e6edf3" : "#2c3e50",
    priceColor: isDarkMode ? "#ff6b6b" : "#ff4d4f",
    originalPriceColor: isDarkMode ? "#a0aec0" : "#95a5a6",
    buttonBg: isDarkMode
      ? "linear-gradient(90deg, #4a90e2 0%, #63b3ed 100%)"
      : "linear-gradient(90deg, #3498db 0%, #2980b9 100%)",
    buttonHoverBg: isDarkMode
      ? "linear-gradient(90deg, #63b3ed 0%, #4a90e2 100%)"
      : "linear-gradient(90deg, #2980b9 0%, #3498db 100%)",
    imageBg: isDarkMode ? "#21252b" : "#f5f5f5",
  };

  return (
    <Row gutter={[24, 24]} justify="center">
      {products.map((product) => (
        <Col
          key={product._id}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            hoverable
            cover={
              <div
                style={{
                  padding: "20px",
                  background: themeStyles.imageBg,
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              >
                <img
                  alt={product.name}
                  src={product.image}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
            }
            style={{
              width: "100%",
              maxWidth: "300px",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: themeStyles.cardBackground,
              border: themeStyles.cardBorder,
              boxShadow: themeStyles.cardShadow,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            bodyStyle={{
              padding: "20px",
              textAlign: "center",
              color: themeStyles.textColor,
            }}
            onClick={() => onProductClick(product._id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = isDarkMode
                ? "0 8px 25px rgba(0, 0, 0, 0.5)"
                : "0 8px 25px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = themeStyles.cardShadow;
            }}
          >
            <Title
              level={5}
              style={{
                marginBottom: "12px",
                color: themeStyles.textColor,
                fontWeight: "600",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.name}
            </Title>
            <div style={{ marginBottom: "16px" }}>
              <Text
                strong
                style={{
                  fontSize: "18px",
                  color: themeStyles.priceColor,
                }}
              >
                {product.price.toLocaleString()} VNĐ
              </Text>
              {product.originalPrice && (
                <Text
                  style={{
                    fontSize: "14px",
                    color: themeStyles.originalPriceColor,
                    textDecoration: "line-through",
                    marginLeft: "8px",
                  }}
                >
                  {product.originalPrice.toLocaleString()} VNĐ
                </Text>
              )}
            </div>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={(e) => handleAddToCart(product, e)}
              style={{
                width: "100%",
                borderRadius: "8px",
                background: themeStyles.buttonBg,
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                color: "#fff",
                fontWeight: "500",
                transition: "all 0.3s ease",
                padding: "6px 0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = themeStyles.buttonHoverBg;
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = themeStyles.buttonBg;
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Thêm vào giỏ
            </Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

ProductCard.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      originalPrice: PropTypes.number, // Thêm propTypes cho originalPrice
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onProductClick: PropTypes.func.isRequired,
};

export default ProductCard;