import { Row, Col, Card, Typography, Spin, Button } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/reducer/cartReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const CompareProduct = ({ products, loading, isDarkMode, onCompare }) => {
  const { t } = useTranslation('productCart');
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user?._id);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          display: "block",
          margin: "100px auto",
          color: isDarkMode ? "#a6cdf6" : "#1890ff",
        }}
      />
    );
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

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
          price: product.price ? Number(product.price) : 0,
          image: product.image,
          quantity: 1,
        },
      })
    );
    toast.success(t("addedToCart"));
  };

  const handleCompareClick = (productId, e) => {
    e.stopPropagation(); 
    onCompare(productId);
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
              cursor: "pointer",
            }}
            bodyStyle={{
              padding: "16px",
              textAlign: "center",
              color: themeStyles.textColor,
            }}
            onClick={() => handleProductClick(product._id)}
          >
            <Title
              level={4}
              style={{
                marginBottom: "12px",
                color: themeStyles.textColor,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.name}
            </Title>
            <Text
              strong
              style={{
                fontSize: "18px",
                color: themeStyles.priceColor,
                display: "block",
                marginBottom: "16px",
              }}
            >
              {product.price.toLocaleString()} {t("currency")}
            </Text>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                type="primary"
                size="large"
                onClick={(e) => handleAddToCart(product, e)}
                style={{
                  background: themeStyles.buttonPrimaryBg,
                  borderColor: themeStyles.buttonPrimaryBg,
                  borderRadius: "8px",
                  padding: "0 24px",
                  height: "40px",
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = themeStyles.buttonPrimaryHoverBg;
                  e.currentTarget.style.borderColor = themeStyles.buttonPrimaryHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = themeStyles.buttonPrimaryBg;
                  e.currentTarget.style.borderColor = themeStyles.buttonPrimaryBg;
                }}
              >
                {t("addToCart")}
              </Button>
              <Button
                size="large"
                onClick={(e) => handleCompareClick(product._id, e)}
                style={{
                  background: themeStyles.buttonSecondaryBg,
                  borderColor: themeStyles.buttonSecondaryBg,
                  color: isDarkMode ? "#e6edf3" : "#2d3436",
                  borderRadius: "8px",
                  padding: "0 24px",
                  height: "40px",
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = themeStyles.buttonSecondaryHoverBg;
                  e.currentTarget.style.borderColor = themeStyles.buttonSecondaryHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = themeStyles.buttonSecondaryBg;
                  e.currentTarget.style.borderColor = themeStyles.buttonSecondaryBg;
                }}
              >
                {t("compare")}
              </Button>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

CompareProduct.propTypes = {
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
  onCompare: PropTypes.func.isRequired,
};

export default CompareProduct;
