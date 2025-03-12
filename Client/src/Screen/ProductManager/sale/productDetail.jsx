import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Typography,
  message,
  Spin,
  Rate,
  Button,
  Space,
  Tabs,
  List,
  Avatar,
  Form,
  Input,
} from "antd";
import { getProductById } from "../../../Service/Client/ApiProduct";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response?.product) {
          setProduct(response.product);
          setSelectedImage(response.product.image);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        message.error("Không thể tải thông tin sản phẩm!");
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    setFeedbacks([
      {
        id: 1,
        author: "Nguyễn Văn A",
        content: "Sản phẩm rất tốt, đáng tiền!",
        rating: 4.5,
        date: "2025-03-10",
      },
      {
        id: 2,
        author: "Trần Thị B",
        content: "Giao hàng nhanh, nhưng hộp hơi móp.",
        rating: 4,
        date: "2025-03-09",
      },
    ]);
  }, [id]);

  const handleFeedbackSubmit = (values) => {
    const newFeedback = {
      id: feedbacks.length + 1,
      author: "Bạn",
      content: values.content,
      rating: values.rating,
      date: new Date().toISOString().split("T")[0],
    };
    setFeedbacks([...feedbacks, newFeedback]);
    form.resetFields();
    message.success("Đánh giá của bạn đã được gửi!");
  };

  if (loading) {
    return (
      <Container style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Text strong>Đang tải...</Text>
        </Space>
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Text type="danger" strong>
          {error}
        </Text>
      </Container>
    );
  }

  const thumbnails = [product.image, product.image, product.image];

  return (
    <>
      <Header />
      <Container
        fluid
        style={{
          background: "#fff",
          padding: "50px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "80px",
        }}
      >
        <Container>
          <Row
            style={{
              alignItems: "center",
              padding: "20px 0",
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            {/* Cột Hình Ảnh */}
            <Col
              md={6}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                {thumbnails.map((thumb, index) => (
                  <img
                    key={index}
                    src={thumb}
                    alt={`Thumbnail ${index}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: selectedImage === thumb ? "2px solid #1890ff" : "2px solid #eee",
                    }}
                    onClick={() => setSelectedImage(thumb)}
                  />
                ))}
              </div>
            </Col>

            {/* Cột Thông Tin */}
            <Col
              md={6}
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Title level={2} style={{ fontSize: "28px", color: "#333", marginBottom: "10px" }}>
                {product.name || "Sản phẩm không tên"}
              </Title>
              <Rate
                allowHalf
                value={product.rating ?? 0}
                disabled
                style={{ marginBottom: "15px" }}
              />
              <Text
                style={{
                  display: "block",
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#ff4d4f",
                  marginBottom: "15px",
                }}
              >
                {product.price
                  ? `${product.price.toLocaleString("vi-VN")} VNĐ`
                  : "Liên hệ để biết giá"}
              </Text>
              <Text style={{ display: "block", color: "#666", marginBottom: "20px" }}>
                Tình trạng: {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
              </Text>
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{
                    background: "#1890ff",
                    border: "none",
                    borderRadius: "20px",
                    padding: "10px 25px",
                    fontSize: "16px",
                  }}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  style={{
                    borderRadius: "20px",
                    padding: "10px 25px",
                    fontSize: "16px",
                  }}
                >
                  Yêu thích
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Tabs Thông Tin Chi Tiết */}
          <Row
            style={{
              marginTop: "40px",
              padding: "20px",
              background: "#fafafa",
              borderRadius: "10px",
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            <Col>
              <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Mô tả sản phẩm" key="1">
                  <Text style={{ lineHeight: "1.8", color: "#555", fontSize: "16px" }}>
                    {product.description || "Chưa có thông tin mô tả chi tiết."}
                  </Text>
                </TabPane>
                <TabPane tab="Thông số kỹ thuật" key="2">
                  <div style={{ display: "grid", gap: "15px", padding: "20px" }}>
                    {[
                      { label: "Kích thước", value: product.size },
                      { label: "Model", value: product.model },
                      { label: "Thương hiệu", value: product.brand },
                      { label: "Switch", value: product.switchType },
                      { label: "Bảo hành", value: product.warranty },
                    ].map((spec, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <span style={{ fontWeight: "600", color: "#333", flex: 1 }}>
                          {spec.label}
                        </span>
                        <span style={{ color: "#666", flex: 2, textAlign: "right" }}>
                          {spec.value || "Chưa cập nhật"}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabPane>
              </Tabs>
            </Col>
          </Row>

          {/* Phần Feedback */}
          <Row
            style={{
              marginTop: "40px",
              padding: "20px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            <Col>
              <Title level={3} style={{ color: "#333", marginBottom: "20px" }}>
                Đánh giá sản phẩm
              </Title>

              {/* Danh sách Feedback */}
              <List
                dataSource={feedbacks}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar>{item.author[0]}</Avatar>}
                      title={
                        <Space>
                          <Text strong>{item.author}</Text>
                          <Rate
                            allowHalf
                            value={item.rating}
                            disabled
                            style={{ fontSize: 14 }}
                          />
                        </Space>
                      }
                      description={
                        <>
                          <Text>{item.content}</Text>
                          <br />
                          <Text style={{ color: "#999" }}>{item.date}</Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: "Chưa có đánh giá nào." }}
              />

              {/* Form gửi Feedback */}
              <div
                style={{
                  marginTop: "30px",
                  padding: "20px",
                  background: "#fafafa",
                  borderRadius: "8px",
                }}
              >
                <Title level={4} style={{ marginBottom: "20px" }}>
                  Viết đánh giá của bạn
                </Title>
                <Form form={form} onFinish={handleFeedbackSubmit} layout="vertical">
                  <Form.Item
                    name="rating"
                    label="Đánh giá"
                    rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
                  >
                    <Rate allowHalf />
                  </Form.Item>
                  <Form.Item
                    name="content"
                    label="Bình luận"
                    rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
                  >
                    <TextArea rows={4} placeholder="Nhập đánh giá của bạn..." />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ borderRadius: "20px", padding: "8px 20px" }}
                    >
                      Gửi đánh giá
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetail;