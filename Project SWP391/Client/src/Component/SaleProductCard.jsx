import { Row, Col, Card, Typography, Spin, Button, Badge } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/reducer/cartReducer";
import { toast } from "react-toastify";
import { ShoppingCartOutlined, FireOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

const ProductCard = ({ products, loading }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user._id);

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
          price: product.sale ? product.sale.salePrice : product.price,
          image: product.image,
          quantity: 1,
          originalPrice: product.price, 
          isSale: !!product.sale?.isSale 
        },
      })
    );
  
    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  return (
    <Row gutter={[24, 24]} justify="center">
      {products.map((product) => (
        <Col key={product._id} xs={24} sm={12} md={6}>
          <Badge.Ribbon 
            text={`Giảm ${formatPrice(product.sale?.discount || 0)}`} 
            color="red"
            style={{ display: product.sale?.isSale ? 'block' : 'none' }}
          >
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative' }}>
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                  />
                  {product.sale?.isSale && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255, 77, 79, 0.9)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      <FireOutlined /> Giảm giá
                    </div>
                  )}
                </div>
              }
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                marginBottom: "20px",
                background: "white",
                border: "none",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Title level={5} style={{ 
                marginBottom: "12px",
                fontSize: "16px",
                height: "40px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical"
              }}>
                {product.name}
              </Title>
              
              {product.sale?.isSale ? (
                <div style={{ textAlign: "center" }}>
                  <Text delete style={{ 
                    fontSize: "14px", 
                    color: "#999",
                    display: "block",
                    marginBottom: "4px"
                  }}>
                    {formatPrice(product.price)}
                  </Text>
                  <Text strong style={{ 
                    fontSize: "20px", 
                    color: "#ff4d4f",
                    display: "block",
                    marginBottom: "8px"
                  }}>
                    {formatPrice(product.sale.salePrice)}
                  </Text>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#666",
                    marginBottom: "12px",
                    background: "#f5f5f5",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block"
                  }}>
                    Giảm giá từ {new Date(product.sale.startDate).toLocaleDateString('vi-VN')} 
                    đến {new Date(product.sale.endDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ) : (
                <Text strong style={{ 
                  fontSize: "18px", 
                  color: "#ff4d4f",
                  display: "block",
                  textAlign: "center",
                  marginBottom: "12px"
                }}>
                  {formatPrice(product.price)}
                </Text>
              )}
              
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(product)}
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "20px",
                  background: "#ff4d4f",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => e.target.style.background = "#ff7875"}
                onMouseOut={(e) => e.target.style.background = "#ff4d4f"}
              >
                Thêm vào giỏ hàng
              </Button>
            </Card>
          </Badge.Ribbon>
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
      sale: PropTypes.shape({
        isSale: PropTypes.bool,
        discount: PropTypes.number,
        salePrice: PropTypes.number,
        startDate: PropTypes.string,
        endDate: PropTypes.string
      })
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ProductCard;
