import { Row, Col, Card, Typography, Spin, Button, Badge } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/reducer/cartReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const SaleProductCard = ({ products, loading, isDarkMode }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user?._id);
  const navigate = useNavigate();
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

  const handleAddToCart = (product) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để mua hàng.");
      return;
    }

    dispatch(
      addToCart({
        userId,
        item: {
          productId: product._id,
          name: product.name,
          price: product.sale?.salePrice || product.price,
          image: product.image,
          quantity: 1,
          originalPrice: product.price,
          isSale: product.sale?.isSale || false,
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
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => price.toLocaleString() + " VND";

  return (
    <Row gutter={[24, 24]} justify="center">
      {products.map((product) => (
        <Col key={product._id} xs={24} sm={12} md={6}>
          <Badge.Ribbon
            text={`Chỉ còn ${formatPrice(product.sale?.discount || 0)}`}
            color="red"
            style={{ display: product.sale?.isSale ? "block" : "none" }}
          >
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
              }}
              bodyStyle={{
                padding: "16px",
                textAlign: "center",
                color: themeStyles.textColor,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => handleProductClick(product._id)}
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

              {product.sale?.isSale ? (
                <div>
                  <Text
                    delete
                    style={{
                      fontSize: "14px",
                      color: isDarkMode ? "#999" : "#666",
                      display: "block",
                    }}
                  >
                    {formatPrice(product.price)}
                  </Text>
                  <Text
                    strong
                    style={{
                      fontSize: "16px",
                      color: themeStyles.priceColor,
                    }}
                  >
                    {formatPrice(product.sale.salePrice)}
                  </Text>
                </div>
              ) : (
                <Text
                  strong
                  style={{
                    fontSize: "16px",
                    color: themeStyles.priceColor,
                  }}
                >
                  {formatPrice(product.price)}
                </Text>
              )}

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => handleAddToCart(product)}
                  style={{
                    width: "100%",
                    height: "36px",
                    borderRadius: "18px",
                    backgroundColor: isDarkMode ? "#ff6b6b" : "#ff4d4f",
                    border: "none",
                    color: "#fff",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#ff8787"
                      : "#ff7875";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#ff6b6b"
                      : "#ff4d4f";
                  }}
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </Card>
          </Badge.Ribbon>
        </Col>
      ))}
    </Row>
  );
};

SaleProductCard.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      sale: PropTypes.shape({
        isSale: PropTypes.bool,
        discount: PropTypes.number,
        salePrice: PropTypes.number,
      }),
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default SaleProductCard;
