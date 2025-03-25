import React, { useState, useEffect } from "react";
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
    Avatar,
    Form,
    Input,
    Tabs,
} from "antd";
import { getProductById } from "../../../Service/Client/ApiProduct";
import { addFeedback, getFeedbackByProductId, deleteFeedback } from "../../../Service/Client/ApiFeedBack";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

                const totalRating = feedbackResponse.feedback.reduce((sum, fb) => sum + fb.rating, 0);
                const avgRating = feedbackResponse.feedback.length ? totalRating / feedbackResponse.feedback.length : 0;

                setProduct((prev) => ({ ...prev, rating: avgRating }));
            }
        } catch (err) {
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

    if (loading) {
        return (
            <Container style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin size="large" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Text type="danger" strong>{error}</Text>
            </Container>
        );
    }

    return (
        <>
            <Header />
            <Container fluid style={{ background: "#fff", padding: "50px 0", paddingTop: "80px" }}>
                <Container>
                    <Row style={{ alignItems: "center", padding: "20px 0", maxWidth: "1200px", width: "100%" }}>
                        <Col md={6} style={{ textAlign: "center" }}>
                            <img src={selectedImage} alt={product.name} style={{ width: "400px", height: "400px", objectFit: "cover", borderRadius: "10px" }} />
                        </Col>
                        <Col md={6} style={{ padding: "20px" }}>
                            <Title level={2}>{product.name || "Sản phẩm không tên"}</Title>
                            <Rate allowHalf value={product.rating ?? 0} disabled style={{ marginBottom: "15px" }} />
                            <Text style={{ fontSize: "32px", fontWeight: "bold", color: "#ff4d4f" }}>
                                {product.price ? `${product.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ để biết giá"}
                            </Text>
                            <Space size="large" style={{ marginTop: "20px" }}>
                                <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>Thêm vào giỏ</Button>
                                <Button type="primary" size="large" danger>Mua ngay</Button>
                            </Space>
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
                                                                title={feedback.userId?.userName}
                                                                description={
                                                                    <>
                                                                        <Text>{feedback.comment}</Text>
                                                                        <br />
                                                                        <Rate disabled value={feedback.rating} />
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

export default ProductDetail;
