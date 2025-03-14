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
import { addFeedback, getFeedbackByProductId } from "../../../Service/Client/ApiFeedBack";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProductAndFeedbacks();
    }, [id]);

    const fetchProductAndFeedbacks = async () => {
        try {
            const productResponse = await getProductById(id);
            console.log(productResponse); // Kiểm tra phản hồi sản phẩm
            if (productResponse?.product) {
                setProduct(productResponse.product);
                setSelectedImage(productResponse.product.image || "");
            } else {
                setError("Không tìm thấy sản phẩm");
            }

            const feedbackResponse = await getFeedbackByProductId(id);
            console.log(feedbackResponse); // Kiểm tra phản hồi phản hồi
            if (feedbackResponse?.feedback) {
                setFeedbacks(feedbackResponse.feedback);
            }
        } catch (err) {
            message.error("Có lỗi khi tải dữ liệu!");
            setError("Đã xảy ra lỗi khi tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitFdback = async (values) => {
        if (!values.rating || !values.comment) {
            message.error("Vui lòng chọn đầy đủ đánh giá và nhận xét!");
            return;
        }

        const feedbackData = {
            productId: id,
            rating: Number(values.rating),
            comment: values.comment.trim(),
        };

        try {
            const response = await addFeedback(feedbackData);
            if (response && response.success) {
                message.success("Đánh giá của bạn đã được gửi!");
                form.resetFields();
                fetchProductAndFeedbacks();  // Cập nhật lại feedbacks sau khi gửi
            } else {
                message.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (err) {
            message.error("Có lỗi khi gửi đánh giá!");
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
                            <Tabs defaultActiveKey="1" centered>
                                <TabPane tab="Mô tả sản phẩm" key="1">
                                    <Text>{product.description || "Chưa có thông tin mô tả chi tiết."}</Text>
                                </TabPane>
                                <TabPane tab="Đánh giá sản phẩm" key="2">
                                    <Form form={form} onFinish={handleSubmitFdback} layout="vertical">
                                        <Form.Item name="rating" label="Đánh giá sao" rules={[{ required: true, type: "number", message: "Vui lòng chọn số sao!" }]}> <Rate /> </Form.Item>
                                        <Form.Item name="comment" label="Nhận xét" rules={[{ required: true }]}> <TextArea rows={4} /> </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">Gửi Đánh Giá</Button>
                                        </Form.Item>
                                    </Form>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={feedbacks}
                                        renderItem={(feedback) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={feedback.userId?.userName}  // Hiển thị tên người dùng
                                                    description={
                                                        <>
                                                            <Rate disabled value={feedback.rating} /> {/* Hiển thị đánh giá sao */}
                                                            <Text>{feedback.comment}</Text> {/* Hiển thị nhận xét */}
                                                        </>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Footer />
        </>
    );
};

export default ProductDetail;
