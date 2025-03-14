import { Card, Row, Col, Statistic, Spin, message } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getAllUser, getAllOrder } from "../../service/admin/AdminServices";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy dữ liệu users
      const userData = await getAllUser();
      setTotalUsers(userData.users.length);
      setTotalSales(
        userData.users.filter((user) => user.role.toLowerCase() === "sale")
          .length
      );

      // Lấy dữ liệu orders
      const orderData = await getAllOrder();
      const orders = orderData.orders || [];
      const stats = {
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
      };
      setOrderStats(stats);
    } catch (error) {
      message.error("Failed to fetch dashboard data");
      setTotalUsers(0);
      setTotalSales(0);
      setOrderStats({ pending: 0, processing: 0, completed: 0, cancelled: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <Spin
          size="large"
          tip="Loading dashboard data..."
          style={{ display: "block", textAlign: "center" }}
        />
      ) : (
        <>
          {/* Hàng 1: Total Users và Total Sales */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={totalUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Total Sales"
                  value={totalSales}
                  prefix={<ShopOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Hàng 2: 4 trạng thái order */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Pending Orders"
                  value={orderStats.pending}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Processing Orders"
                  value={orderStats.processing}
                  prefix={<SyncOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Completed Orders"
                  value={orderStats.completed}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Cancelled Orders"
                  value={orderStats.cancelled}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
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
