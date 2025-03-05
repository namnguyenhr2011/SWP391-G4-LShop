import { useEffect, useState } from "react";
import { Row, Col, Card, Rate, Typography, Spin, Button, message } from "antd";
import { getTop8 } from "../Service/Client/ApiProduct";

const { Title, Text } = Typography;

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getTop8();
        setProducts(response.products || []); // Đảm bảo không bị lỗi nếu response không có products
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        message.error(
          "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau!"
        ); // Thông báo lỗi cho người dùng
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Spin
        size="large"
        tip="Đang tải sản phẩm..."
        style={{ display: "block", margin: "50px auto", textAlign: "center" }}
      />
    );
  }

  if (!products.length) {
    return (
      <Text style={{ display: "block", textAlign: "center", margin: "50px 0" }}>
        Không có sản phẩm nào để hiển thị.
      </Text>
    );
  }

  return (
    <Row gutter={[24, 24]} justify="center">
      {products.map((product) => (
        <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <img
                alt={product.name}
                src={product.image}
                style={{
                  height: "200px",
                  width: "100%",
                  objectFit: "contain",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  padding: "10px",
                  backgroundColor: "#f5f5f5", // Nền nhẹ để nổi bật sản phẩm
                }}
              />
            }
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              backgroundColor: "#fff",
            }}
            bodyStyle={{ padding: "16px", textAlign: "center" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <Title
              level={5}
              ellipsis={{ rows: 1, expandable: false }}
              style={{ marginBottom: "8px", fontSize: "16px" }}
            >
              {product.name}
            </Title>
            <Text
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{
                fontSize: "12px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              {product.description || "Sản phẩm chất lượng cao"}{" "}
              {/* Giả định có description */}
            </Text>
            <Text
              strong
              style={{ fontSize: "16px", color: "#ff4d4f", display: "block" }}
            >
              ${product.price.toFixed(2)} {/* Định dạng giá */}
            </Text>
            <Button
              type="link"
              style={{ marginTop: "10px", padding: "0" }}
              onClick={() =>
                console.log(`Xem chi tiết sản phẩm: ${product._id}`)
              } // Thay bằng logic thật
            >
              Xem chi tiết
            </Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductCard;
