// src/Component/ProductCard.jsx
import { Row, Col, Card, Typography, Spin, Button } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/reducer/cartReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const ProductCard = ({ products, loading, isDarkMode, onProductClick }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user._id);
  const navigate = useNavigate()
  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          display: "block",
          margin: "50px auto",
          color: isDarkMode ? "#e6edf3" : "#1c1e21",
        }}
      />
    );
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan sang Card
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
    cardBackground: isDarkMode ? "#2b2e34" : "#fff",
    cardBorder: isDarkMode ? "1px solid #444" : "1px solid #e8e8e8",
    cardShadow: isDarkMode
      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
      : "0 4px 10px rgba(0, 0, 0, 0.1)",
    textColor: isDarkMode ? "#e6edf3" : "#1c1e21",
    priceColor: isDarkMode ? "#ff6b6b" : "#ff4d4f",
    buttonBg: isDarkMode ? "#1a73e8" : "#1677ff",
    buttonHoverBg: isDarkMode ? "#4285f4" : "#0958d9",
    imageBg: isDarkMode ? "#21252b" : "#f5f5f5",
  };

  return (
    <Row gutter={[24, 24]} justify="center">
      {products.map((product) => (
        <Col key={product._id} xs={24} sm={12} md={6}>
          <Card
            hoverable
            cover={
              <img
                alt={product.name}
                src={product.image}
                style={{
                  height: "200px",
                  width: "100%",
                  padding: "15px",
                  objectFit: "contain",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              />
            }
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: themeStyles.cardBackground,
              border: themeStyles.cardBorder,
              boxShadow: themeStyles.cardShadow,
              transition: "transform 0.2s ease",
              cursor: "pointer", // Thêm con trỏ để báo hiệu có thể click
            }}
            bodyStyle={{
              padding: "16px",
              textAlign: "center",
              color: themeStyles.textColor,
            }}
            onClick={() => handleProductClick(product._id)} // Chuyển hướng khi click vào Card
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Title
              level={5}
              style={{
                marginBottom: "8px",
                color: themeStyles.textColor,
              }}
            >
              {product.name}
            </Title>
            <Text
              strong
              style={{
                fontSize: "16px",
                color: themeStyles.priceColor,
              }}
            >
              {product.price.toLocaleString()} VND
            </Text>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Button
                type="primary"
                onClick={(e) => handleAddToCart(product, e)} // Gọi hàm thêm vào giỏ hàng
                style={{
                  backgroundColor: themeStyles.buttonBg,
                  borderColor: themeStyles.buttonBg,
                  color: "#fff",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    themeStyles.buttonHoverBg;
                  e.currentTarget.style.borderColor = themeStyles.buttonHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeStyles.buttonBg;
                  e.currentTarget.style.borderColor = themeStyles.buttonBg;
                }}
              >
                Thêm vào giỏ
              </Button>
            </div>
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
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onProductClick: PropTypes.func.isRequired, // Thêm propTypes cho onProductClick
};

export default ProductCard;