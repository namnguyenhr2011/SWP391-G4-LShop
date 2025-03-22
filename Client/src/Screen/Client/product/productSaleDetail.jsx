import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  Typography,
  message,
  Spin,
  Rate,
  Button,
  Space,
  List,
  Form,
  Input,
  Tabs,
  Badge,
} from "antd";
import { getProductWithSaleById } from "../../../Service/sale/ApiSale";
import { addFeedback, getFeedbackByProductId, deleteFeedback } from "../../../Service/Client/ApiFeedBack";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../store/reducer/cartReducer";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProductSaleDetail = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [form] = Form.useForm();
  const { _id: userId } = useSelector((state) => state.user?.user) || {};

  useEffect(() => {
    fetchProductAndFeedbacks();
  }, [id]);

  const fetchProductAndFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API để lấy thông tin sản phẩm
      const productResponse = await getProductWithSaleById(id);
      console.log("Product Response:", productResponse); // Debug dữ liệu API trả về

      if (productResponse?.product) {
        setProduct(productResponse.product);
        setSelectedImage(productResponse.product.image || ""); // Đảm bảo có giá trị mặc định
      } else {
        setError("Không tìm thấy sản phẩm");
      }

      // Gọi API để lấy feedback
      const feedbackResponse = await getFeedbackByProductId(id);
      console.log("Feedback Response:", feedbackResponse); // Debug dữ liệu feedback trả về
      if (feedbackResponse?.feedback) {
        setFeedbacks(feedbackResponse.feedback);
        const totalRating = feedbackResponse.feedback.reduce((sum, fb) => sum + fb.rating, 0);
        const avgRating = feedbackResponse.feedback.length ? totalRating / feedbackResponse.feedback.length : 0;
        setProduct((prev) => prev ? { ...prev, rating: avgRating } : prev);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      message.error("Có lỗi khi tải dữ liệu!");
      setError("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (values) => {
    if (!values.rating || !values.comment) {
      message.error("Vui lòng chọn đầy đủ đánh giá và nhận xét!");
      return;
    }

    const feedbackData = {
      productId: product?._id,
      rating: Number(values.rating),
      comment: values.comment.trim(),
    };

    try {
      const response = await addFeedback(feedbackData);
      if (response && response.success) {
        message.success("Đánh giá của bạn đã được gửi!");
        form.resetFields();
        fetchProductAndFeedbacks();
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (err) {
      message.error("Có lỗi khi gửi đánh giá!");
    }
  };

  const handleDelete = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
      message.success("Feedback đã được xóa!");
      fetchProductAndFeedbacks();
    } catch (err) {
      message.error("Xóa feedback thất bại!");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > product.quantity) {
      message.error(`Số lượng không thể vượt quá ${product.quantity}`);
      return;
    }
    const priceToUse = isSaleActive() ? product.sale?.salePrice || product.price : product.price;
    dispatch(
      addToCart({
        userId,
        item: {
          productId: product._id,
          name: product.name,
          price: priceToUse,
          image: product.image,
          quantity: quantity,
          originalPrice: product.price,
          isSale: isSaleActive(),
        },
      })
    );
    message.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isSaleActive = () => {
    if (!product?.sale || !product.sale.startDate || !product.sale.endDate || !product.sale.salePrice) {
      return false;
    }
    const now = new Date();
    const startDate = new Date(product.sale.startDate);
    const endDate = new Date(product.sale.endDate);
    return now >= startDate && now <= endDate;
  };

  const calculateDiscountPercentage = () => {
    if (!product?.sale?.salePrice || !product?.price) return 0;
    const discount = ((product.price - product.sale.salePrice) / product.price) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <Container style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Text type="danger" strong>{error || "Không tìm thấy sản phẩm"}</Text>
      </Container>
    );
  }

  const saleActive = isSaleActive();

  return (
    <>
      <Header />
      <Container fluid style={{
        background: "#fff",
        padding: "50px 0",
        paddingTop: "80px",
        backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}>
        <Container>
          <Row style={{
            alignItems: "center",
            padding: "20px 0",
            maxWidth: "1200px",
            width: "100%",
          }}>
            <Col md={6} style={{ textAlign: "center", position: "relative" }}>
              {saleActive && (
                <Badge.Ribbon text={`Giảm ${calculateDiscountPercentage()}%`} color="red" />
              )}
              <img
                src={selectedImage || "https://via.placeholder.com/400"}
                alt={product.name}
                style={{ width: "400px", height: "400px", objectFit: "cover", borderRadius: "10px" }}
              />
            </Col>
            <Col md={6} style={{ padding: "20px", backgroundColor: saleActive ? "#fff5f5" : "#fff", borderRadius: "10px", height: "400px" }}>
              <Title level={2}>{product.name || "Sản phẩm không tên"}</Title>
              <Rate allowHalf value={product.rating ?? 0} disabled style={{ marginBottom: "15px" }} />
              <br />
              {saleActive ? (
                <>
                  <Text style={{ fontSize: "32px", fontWeight: "bold", color: "#ff4d4f" }}>
                    Giá sale: {product.sale?.salePrice ? `${product.sale.salePrice.toLocaleString("vi-VN")} VNĐ` : "Liên hệ để biết giá"}
                  </Text>
                  <br />
                  <Text delete style={{ fontSize: "24px", color: "#666" }}>
                    Giá gốc: {product.price ? `${product.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ để biết giá"}
                  </Text>
                  <br />
                  <Text style={{ fontSize: "16px", color: "#ff4d4f" }}>
                    Thời gian sale: {formatDate(product.sale.startDate)} - {formatDate(product.sale.endDate)}
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: "32px", fontWeight: "bold", color: "#ff4d4f" }}>
                  Giá: {product.price ? `${product.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ để biết giá"}
                </Text>
              )}
              <br />
              <Text style={{ fontSize: "24px", color: "#666" }}>
                Còn lại: {product.quantity ?? "N/A"}
              </Text>
              <br />
              <Space size="large" style={{ marginTop: "20px" }}>
                <Button onClick={handleDecreaseQuantity}>-</Button>
                <Text>{quantity}</Text>
                <Button onClick={handleIncreaseQuantity}>+</Button>
              </Space>
              <br />
              <Button style={{ marginTop: "20px" }} type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} block>
                Thêm vào giỏ
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: "40px", padding: "20px", background: "#fafafa", borderRadius: "10px", maxWidth: "1200px", width: "100%" }}>
            <Col>
              <Tabs
                defaultActiveKey="1"
                centered
                items={[
                  {
                    key: "1",
                    label: "Mô tả sản phẩm",
                    children: <Text>{product.description || "Chưa có thông tin mô tả chi tiết."}</Text>,
                  },
                  {
                    key: "2",
                    label: "Đánh giá sản phẩm",
                    children: (
                      <>
                        <Form form={form} onFinish={handleSubmitFeedback} layout="vertical">
                          <Form.Item name="rating" label="Rate" rules={[{ required: true, message: "Please choose a rating" }]}>
                            <Rate />
                          </Form.Item>
                          <Form.Item name="comment" label="Comment" rules={[{ required: true }]}>
                            <TextArea rows={4} />
                          </Form.Item>
                          <Form.Item>
                            <Button type="primary" htmlType="submit">Send Feedback</Button>
                          </Form.Item>
                        </Form>

                        <List
                          itemLayout="horizontal"
                          dataSource={[...feedbacks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
                          renderItem={(feedback) => (
                            <List.Item>
                              <List.Item.Meta
                                title={feedback.userId?.userName ?? "Người dùng ẩn danh"}
                                description={
                                  <>
                                    <Text>{feedback.comment}</Text>
                                    <br />
                                    <Rate disabled value={feedback.rating ?? 0} />
                                    {userId && String(feedback.userId?._id) === String(userId) && (
                                      <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(feedback._id)}
                                        style={{ marginTop: 4, marginLeft: 10 }}
                                      >
                                        Delete
                                      </Button>
                                    )}
                                  </>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </>
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default ProductSaleDetail;