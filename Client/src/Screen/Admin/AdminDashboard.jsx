import { Card, Row, Col, Statistic, Spin, message, Divider } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  getAllUser,
  getAllOrder,
  getAllFeedback,
} from "../../service/admin/AdminServices";
import { Pie } from "@ant-design/charts";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSalers, setTotalSalers] = useState(0);
  const [totalProductManager, setTotalProductManager] = useState(0);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  });
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    hidden: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, // Thêm phân bố rating
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await getAllUser();
      setTotalUsers(userData.users.length);
      setTotalSalers(
        userData.users.filter((user) => user.role.toLowerCase() === "sale")
          .length
      );
      setTotalProductManager(
        userData.users.filter((user) => user.role === "productManager").length
      );

      const orderData = await getAllOrder();
      const orders = orderData.orders || [];
      setOrderStats({
        pending: orders.filter(
          (order) => order.status.toLowerCase() === "pending"
        ).length,
        processing: orders.filter(
          (order) => order.status.toLowerCase() === "processing"
        ).length,
        completed: orders.filter(
          (order) => order.status.toLowerCase() === "completed"
        ).length,
        cancelled: orders.filter(
          (order) => order.status.toLowerCase() === "cancelled"
        ).length,
      });

      const feedbackData = await getAllFeedback();
      const feedbacks = feedbackData.feedbacks || [];
      const totalFeedback = feedbacks.length;
      const hiddenFeedback = feedbacks.filter((fb) => fb.isHidden).length;
      const averageRating = totalFeedback
        ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalFeedback
        : 0;

      // Tính phân bố rating (1-5 sao)
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      feedbacks.forEach((fb) => {
        if (fb.rating >= 1 && fb.rating <= 5) {
          ratingDistribution[fb.rating]++;
        }
      });

      setFeedbackStats({
        total: totalFeedback,
        hidden: hiddenFeedback,
        averageRating: averageRating.toFixed(1),
        ratingDistribution,
      });
    } catch (error) {
      message.error("Failed to fetch dashboard data");
      setTotalUsers(0);
      setTotalSalers(0);
      setTotalProductManager(0);
      setOrderStats({ pending: 0, processing: 0, completed: 0, cancelled: 0 });
      setFeedbackStats({
        total: 0,
        hidden: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  // Dữ liệu cho biểu đồ Pie (chỉ hiển thị phân bố rating)
  const pieData = [
    { type: "1 Star", value: feedbackStats.ratingDistribution[1] },
    { type: "2 Stars", value: feedbackStats.ratingDistribution[2] },
    { type: "3 Stars", value: feedbackStats.ratingDistribution[3] },
    { type: "4 Stars", value: feedbackStats.ratingDistribution[4] },
    { type: "5 Stars", value: feedbackStats.ratingDistribution[5] },
  ].filter((item) => item.value > 0); // Loại bỏ các mục có giá trị 0 để biểu đồ đẹp hơn

  // Cấu hình biểu đồ Pie
  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [{ type: "element-active" }],
    color: ["#ff4d4f", "#faad14", "#fadb14", "#52c41a", "#1890ff"], // Màu cho 1-5 sao
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {loading ? (
        <Spin
          size="large"
          tip="Loading..."
          style={{ display: "block", textAlign: "center" }}
        />
      ) : (
        <>
          {/* User Stats */}
          <Divider orientation="left">User Statistics</Divider>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={totalUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Salers"
                  value={totalSalers}
                  prefix={<ShopOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Product Managers"
                  value={totalProductManager}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Order Stats */}
          <Divider orientation="left">Order Statistics</Divider>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={orderStats.pending}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Processing"
                  value={orderStats.processing}
                  prefix={<SyncOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={orderStats.completed}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Cancelled"
                  value={orderStats.cancelled}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Feedback Stats với Pie Chart chỉ cho Rating */}
          <Divider orientation="left">Feedback Statistics</Divider>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12}>
              <Card title="Rating Distribution">
                {pieData.length > 0 ? (
                  <Pie {...pieConfig} />
                ) : (
                  <p>No rating data available</p>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Total Feedback"
                  value={feedbackStats.total}
                  prefix={<CommentOutlined />}
                />
                <Statistic
                  title="Hidden Feedback"
                  value={feedbackStats.hidden}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
                <Statistic
                  title="Average Rating"
                  value={feedbackStats.averageRating}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
