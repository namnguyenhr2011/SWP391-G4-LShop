import { useEffect, useState } from "react";
import { getTop8 } from "../Service/Client/ApiProduct";
import { Card, Button } from "antd";
import { Row, Col } from "react-bootstrap";

const ProductCart = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getTop8();
        setProducts(response.products);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Row className="g-4">
      {products.map((product) => (
        <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
          <Card
            cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: "cover" }} />}
            hoverable
          >
            <Card.Meta title={product.name} description={`${product.price.toLocaleString()} VND`} />
            <Button type="primary" style={{ marginTop: 10, width: "100%" }}>Mua ngay</Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductCart;
