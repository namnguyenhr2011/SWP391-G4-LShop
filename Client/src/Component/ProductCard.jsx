import { useEffect, useState } from "react";
import { Row, Col, Card, Rate, Typography, Spin } from "antd";
import { getTop8 } from "../Service/Client/ApiProduct";

const { Title, Text } = Typography;

const ProductCard = ({}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getTop8();
        setProducts(response.products);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

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
          >
            <Title level={5} style={{ marginBottom: "8px" }}>
              {product.name}
            </Title>
            <Text strong style={{ fontSize: "16px", color: "#ff4d4f" }}>
              ${product.price}
            </Text>
            <div style={{ marginTop: "8px" }}>
              <Rate disabled defaultValue={product.rating} />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductCard;
