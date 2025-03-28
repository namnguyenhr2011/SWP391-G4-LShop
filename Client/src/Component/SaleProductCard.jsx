import { Row, Col, Card, Typography, Spin, Button, Badge } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/reducer/cartReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const SaleProductCard = ({ products, loading, isDarkMode }) => {
  const { t } = useTranslation('saleProduct');
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user?._id);
  const navigate = useNavigate();

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
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
    navigate(`/product-sale/${productId}`);
  };

  const formatPrice = (price) => `${price.toLocaleString()} ${t("vnd")}`;

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
              cover={<img alt={product.name} src={product.image} style={{ height: "200px", width: "100%", objectFit: "contain" }} />}
              onClick={() => handleProductClick(product._id)}
            >
              <Title level={5} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {product.name}
              </Title>
              <div>
                <Text delete={product.sale?.isSale}>
                  {formatPrice(product.price)}
                </Text>
                {product.sale?.isSale && (
                  <Text strong style={{ color: "red" }}>
                    {formatPrice(product.sale.salePrice)}
                  </Text>
                )}
              </div>
              <Button type="primary" onClick={(e) => handleAddToCart(product, e)}>
                {t("addToCart")}
              </Button>
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
        salePrice: PropTypes.number,
      }),
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default SaleProductCard;