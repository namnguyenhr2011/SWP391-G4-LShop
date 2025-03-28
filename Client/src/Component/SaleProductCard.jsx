import { Row, Col, Card, Typography, Spin, Button, Badge } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/reducer/cartReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const SaleProductCard = ({ products, loading, isDarkMode }) => {
  const { t } = useTranslation("saleProduct");
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

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error(t("loginToBuy"));
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
    toast.success(t("addedToCart"));
  };

  const handleProductClick = (productId) => {
    console.log("Navigating to:", `/product-sale/${productId}`);
    navigate(`/product-sale/${productId}`);
  };

  const formatPrice = (price) => `${price.toLocaleString()} ${t("vnd")}`;

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

  return (
    <Row gutter={[24, 24]} justify="center">
      {products.map((product) => (
        <Col key={product._id} xs={24} sm={12} md={6}>
          <Badge.Ribbon
            text={`${t("only")} ${formatPrice(product.sale?.salePrice || 0)}`}
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
              onClick={() => handleProductClick(product._id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Title
                level={5}
                style={{
                  marginBottom: "8px",
                  color: themeStyles.textColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  display: "block",
                }}
                title={product.name}
              >
                {product.name}
              </Title>

              <div>
                <Text
                  delete={product.sale?.isSale}
                  style={{
                    fontSize: "14px",
                    color: product.sale?.isSale
                      ? isDarkMode
                        ? "#999"
                        : "#666"
                      : themeStyles.priceColor,
                    display: "block",
                  }}
                >
                  {formatPrice(product.price)}
                </Text>
                {product.sale?.isSale && (
                  <Text
                    strong
                    style={{
                      fontSize: "16px",
                      color: themeStyles.priceColor,
                    }}
                  >
                    {formatPrice(product.sale.salePrice)}
                  </Text>
                )}
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="primary"
                  onClick={(e) => handleAddToCart(product, e)}
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
                  {t("addToCart")}
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
