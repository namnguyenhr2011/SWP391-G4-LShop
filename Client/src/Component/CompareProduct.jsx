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
    cardBackground: isDarkMode
      ? "linear-gradient(145deg, #2b2e34, #1f2227)"
      : "linear-gradient(145deg, #ffffff, #f7f9fc)",
    cardBorder: isDarkMode ? "none" : "1px solid #e8ecef",
    cardShadow: isDarkMode
      ? "0 8px 24px rgba(0, 0, 0, 0.5)"
      : "0 8px 24px rgba(0, 0, 0, 0.08)",
    textColor: isDarkMode ? "#e6edf3" : "#2d3436",
    priceColor: isDarkMode ? "#ff7675" : "#e74c3c",
    buttonPrimaryBg: isDarkMode ? "#0984e3" : "#1890ff",
    buttonPrimaryHoverBg: isDarkMode ? "#4dabf7" : "#40c4ff",
    buttonSecondaryBg: isDarkMode ? "#2d3436" : "#dfe6e9",
    buttonSecondaryHoverBg: isDarkMode ? "#636e72" : "#b2bec3",
    imageBg: isDarkMode ? "#1b1e23" : "#f1f3f5",
  };

  return (
    <Row gutter={[16, 16]} justify="center" style={{ padding: "20px 0" }}>
      {products.map((product) => (
        <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <div
                style={{
                  background: themeStyles.imageBg,
                  padding: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "240px",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              >
                <img
                  alt={product.name}
                  src={product.image}
                  style={{
                    maxHeight: "200px",
                    maxWidth: "100%",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
            }
            style={{
              borderRadius: "12px",
              background: themeStyles.cardBackground,
              border: themeStyles.cardBorder,
              boxShadow: themeStyles.cardShadow,
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
            bodyStyle={{
              padding: "20px",
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