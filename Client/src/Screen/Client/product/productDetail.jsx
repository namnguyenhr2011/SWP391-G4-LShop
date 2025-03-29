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
} from "antd";
import { getProductById } from "../../../service/client/ApiProduct";
import {
  addFeedback,
  getFeedbackByProductId,
  deleteFeedback,
} from "../../../Service/Client/ApiFeedBack";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../store/reducer/cartReducer";
import BottomAds from "../../../Component/BottomAds"
import LeftAdsBanner from "../../../Component/LeftAds";
import RightAdsBanner from "../../../Component/RightAds";
const { Title, Text } = Typography;
const { TextArea } = Input;

const ProductDetail = () => {
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
      const productResponse = await getProductById(id);
      if (productResponse?.product) {
        setProduct(productResponse.product);
        setSelectedImage(productResponse.product.image || "");
      } else {
        setError("Không tìm thấy sản phẩm");
      }

      const feedbackResponse = await getFeedbackByProductId(id);
      if (feedbackResponse?.feedback) {
        setFeedbacks(feedbackResponse.feedback);

        const totalRating = feedbackResponse.feedback.reduce(
          (sum, fb) => sum + fb.rating,
          0
        );
        const avgRating = feedbackResponse.feedback.length
          ? totalRating / feedbackResponse.feedback.length
          : 0;

        setProduct((prev) => ({ ...prev, rating: avgRating }));
      }
    } catch (err) {
      message.error("Có lỗi khi tải dữ liệu!", err);
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
      message.error("Có lỗi khi gửi đánh giá!", err);
    }
  };

  if (loading) {
    return (
      <Container
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </Container>
    );
  }

  const handleDelete = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
      message.success("Feedback đã được xóa!");
      fetchProductAndFeedbacks();
    } catch (err) {
      message.error("Xóa feedback thất bại!", err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > product.quantity) {
      message.error(`Số lượng không thể vượt quá ${product.quantity}`);
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
          quantity: quantity,
          originalPrice: product.price,
          isSale: product.sale?.isSale || false,
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

  if (loading) {
    return (
      <Container
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text type="danger" strong>
          {error}
        </Text>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container
        fluid
        style={{
          background: isDarkMode ? "#0d1117" : "#fff", // Dark mode cho nền chính
          padding: "50px 0",
          paddingTop: "80px",
          backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
          color: isDarkMode ? "#e6edf3" : "#1c1e21",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Container>
          <Row
            style={{
              alignItems: "center",
              padding: "20px 0",
              maxWidth: "1400px",
              width: "100%",
            }}
          >
            <Col md={5} style={{ textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: "white", // Nền trắng cho ảnh trong cả dark mode và light mode
                  borderRadius: "10px",
                  height: "400px", // Cố định chiều cao
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  style={{
                    maxWidth: "90%", // Đảm bảo ảnh không vượt quá 90% chiều rộng
                    maxHeight: "100%", // Đảm bảo ảnh không vượt quá chiều cao của div
                    objectFit: "contain", // Giữ tỷ lệ ảnh
                    borderRadius: "10px",
                  }}
                />
              </div>
            </Col>
            <Col
              md={7}
              style={{
                padding: "20px",
                backgroundColor: isDarkMode ? "#1c1e21" : "#fff", // Dark mode cho phần thông tin sản phẩm
                borderRadius: "10px",
                height: "400px",
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
              }}
            >
              <Title
                level={2}
                style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
              >
                {product.name || "Sản phẩm không tên"}
              </Title>
              <Rate
                allowHalf
                value={product.rating ?? 0}
                disabled
                style={{
                  marginBottom: "15px",
                  color: isDarkMode ? "#fadb14" : "#8b949e",
                }}
              />
              <br />
              <Text
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#ff4d4f",
                }}
              >
                Giá:{" "}
                {product.price
                  ? `${product.price.toLocaleString("vi-VN")} VNĐ`
                  : "Liên hệ để biết giá"}
              </Text>
              <br />
              <Text
                style={{
                  fontSize: "24px",
                  color: isDarkMode ? "#8b949e" : "#666",
                }}
              >
                Còn lại: {product.quantity}
              </Text>
              <br />
              <Space size="large" style={{ marginTop: "20px" }}>
                <Button
                  onClick={handleDecreaseQuantity}
                  style={{
                    backgroundColor: isDarkMode ? "#21262d" : "#fff",
                    color: isDarkMode ? "#e6edf3" : "#1c1e21",
                  }}
                >
                  -
                </Button>
                <Text style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21" }}>
                  {quantity}
                </Text>
                <Button
                  onClick={handleIncreaseQuantity}
                  style={{
                    backgroundColor: isDarkMode ? "#21262d" : "#fff",
                    color: isDarkMode ? "#e6edf3" : "#1c1e21",
                  }}
                >
                  +
                </Button>
              </Space>
              <br />
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                block
                style={{
                  marginTop: "30px",
                  backgroundColor: isDarkMode ? "#238636" : "#52c41a",
                  borderColor: isDarkMode ? "#238636" : "#52c41a",
                  boxShadow: "none",
                  width: "300px",
                }}
              >
                Thêm vào giỏ
              </Button>
            </Col>
          </Row>
          <Row
            style={{
              marginTop: "40px",
              padding: "20px",
              backgroundColor: isDarkMode ? "#1c1e21" : "#fafafa", // Dark mode cho phần mô tả và đánh giá
              borderRadius: "10px",
              maxWidth: "1400px",
              width: "100%",
            }}
          >
            <Col>
              <Tabs
                defaultActiveKey="1"
                centered
                items={[
                  {
                    key: "1",
                    label: "Mô tả sản phẩm",
                    children: (
                      <Text
                        style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
                      >
                        {product.description ||
                          "Chưa có thông tin mô tả chi tiết."}
                      </Text>
                    ),
                  },
                  {
                    key: "2",
                    label: "Đánh giá sản phẩm",
                    children: (
                      <>
                        <Form
                          form={form}
                          onFinish={handleSubmitFeedback}
                          layout="vertical"
                          style={{
                            backgroundColor: isDarkMode ? "#1c1e21" : "#fafafa",
                          }}
                        >
                          <Form.Item
                            name="rating"
                            label={
                              <span
                                style={{
                                  color: isDarkMode ? "#e6edf3" : "#1c1e21",
                                }}
                              >
                                Rate
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please choose a rating",
                              },
                            ]}
                          >
                            <Rate
                              style={{
                                color: isDarkMode ? "#fadb14" : undefined,
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            name="comment"
                            label={
                              <span
                                style={{
                                  color: isDarkMode ? "#e6edf3" : "#1c1e21",
                                }}
                              >
                                Comment
                              </span>
                            }
                            rules={[{ required: true }]}
                          >
                            <TextArea
                              rows={4}
                              style={{
                                backgroundColor: isDarkMode
                                  ? "#21262d"
                                  : "#fff",
                                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                              }}
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              style={{
                                backgroundColor: isDarkMode
                                  ? "#238636"
                                  : "#52c41a",
                                borderColor: isDarkMode ? "#238636" : "#52c41a",
                                boxShadow: "none",
                              }}
                            >
                              Send Feedback
                            </Button>
                          </Form.Item>
                        </Form>

                        <List
                          itemLayout="horizontal"
                          dataSource={[...feedbacks].sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )}
                          renderItem={(feedback) => (
                            <List.Item>
                              <List.Item.Meta
                                title={
                                  <span
                                    style={{
                                      color: isDarkMode ? "#e6edf3" : "#1c1e21",
                                    }}
                                  >
                                    {feedback.userId?.userName}
                                  </span>
                                }
                                description={
                                  <>
                                    <Text
                                      style={{
                                        color: isDarkMode
                                          ? "#e6edf3"
                                          : "#1c1e21",
                                      }}
                                    >
                                      {feedback.comment}
                                    </Text>
                                    <br />
                                    <Rate
                                      disabled
                                      value={feedback.rating}
                                      style={{
                                        color: isDarkMode
                                          ? "#fadb14"
                                          : undefined,
                                      }}
                                    />
                                    {userId &&
                                      String(feedback.userId?._id) ===
                                      String(userId) && (
                                        <Button
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() =>
                                            handleDelete(feedback._id)
                                          }
                                          style={{
                                            marginTop: 4,
                                            marginLeft: 10,
                                            backgroundColor: isDarkMode
                                              ? "#21262d"
                                              : "#fff",
                                            color: isDarkMode
                                              ? "#ff4d4f"
                                              : undefined,
                                            borderColor: isDarkMode
                                              ? "#ff4d4f"
                                              : undefined,
                                            boxShadow: "none",
                                          }}
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
                style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Footer />
      <BottomAds />
      <LeftAdsBanner />
      <RightAdsBanner />
    </>
  );
};

export default ProductDetail;
