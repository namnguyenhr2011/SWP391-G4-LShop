import { Row, Col, Card, Typography, Spin, Button } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/reducer/cartReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const ProductCard = ({ products, loading }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user._id);
  const navigate = useNavigate();
  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  const handleAddToCart = (product) => {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
                  objectFit: "cover",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              />
            }
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
            }}
            bodyStyle={{ padding: "16px", textAlign: "center" }}
            onClick={() => handleProductClick(product._id)}
          >
            <Title level={5} style={{ marginBottom: "8px" }}>{product.name}</Title>
            <Text strong style={{ fontSize: "16px", color: "#ff4d4f" }}>
              {formatPrice(product.price)}
            </Text>
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "10px" }}>
              <Button type="primary" onClick={() => handleAddToCart(product)}>
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
};

export default ProductCard;
