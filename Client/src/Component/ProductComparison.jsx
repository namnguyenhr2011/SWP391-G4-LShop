import React from "react";
import { Card, Button, Typography, Spin } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToCompare } from "../Store/reducer/cartReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Container } from "react-bootstrap"; 

const { Title, Text } = Typography;

const ProductCard = ({ products, loading, isDarkMode }) => {
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

  const handleAddToCompare = (product, e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error(t("loginToBuy")); 
      return;
    }

    dispatch(
      addToCompare({
        userId,
        productId: product._id,
      })
    );

    toast.success(t("addedToCompare")); 
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
    <Container>
      <Row className="justify-content-center" xs={1} sm={2} md={3} lg={4}>
        {products.map((product) => (
          <Col key={product._id} className="mb-4">
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                {product.price.toLocaleString()} {t("currency")}
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
                  onClick={(e) => handleAddToCart(product, e)}
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
                  {t("addToCart")}
                </Button>

                <Button
                  type="default"
                  onClick={(e) => handleAddToCompare(product, e)}
                  style={{
                    backgroundColor: "#f4f4f4",
                    borderColor: "#d9d9d9",
                    color: "#555",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ddd";
                    e.currentTarget.style.borderColor = "#bbb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f4f4f4";
                    e.currentTarget.style.borderColor = "#d9d9d9";
                  }}
                >
                  {t("compare")}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
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
};

export default ProductCard;
