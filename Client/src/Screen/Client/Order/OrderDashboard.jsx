import React, { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table, Spin, message, Typography, Select } from "antd";
import { Pie } from "@ant-design/plots";
import { getOrders } from "../../../Service/Client/ApiOrder"; // Dùng API từ MyOrders
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

const { Title } = Typography;
const { Option } = Select;

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [stats, setStats] = useState({
    processing: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });
  const isDarkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      let orderList = response?.data?.orders || [];

      // Lọc đơn hàng theo thời gian
      const currentDate = new Date();
      if (timeFilter === "day") {
        orderList = orderList.filter(
          (order) => new Date(order.createdAt).toDateString() === currentDate.toDateString()
        );
      } else if (timeFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        orderList = orderList.filter((order) => new Date(order.createdAt) >= oneWeekAgo);
      } else if (timeFilter === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);
        orderList = orderList.filter((order) => new Date(order.createdAt) >= oneMonthAgo);
      }

      setOrders(orderList);
      calculateStats(orderList);
    } catch (error) {
      message.error("Không thể tải dữ liệu đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders) => {
    // Thống kê trạng thái đơn hàng
    const orderStats = orders.reduce(
      (acc, order) => {
        const status = order.status.toLowerCase();
        if (status === "processing") acc.processing += 1;
        if (status === "completed") acc.completed += 1;
        if (status === "cancelled") acc.cancelled += 1;
        acc.total += 1;
        return acc;
      },
      {
        processing: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
      }
    );

    setStats(orderStats);
  };

  // Cấu hình biểu đồ hình tròn
  const pieConfig = {
    appendPadding: 10,
    data: [
      { type: "Processing", value: stats.processing },
      { type: "Completed", value: stats.completed },
      { type: "Cancelled", value: stats.cancelled },
    ],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    color: ["#1890ff", "#52c41a", "#ff4d4f"], // Màu cho Processing, Completed, Cancelled
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: 14, textAlign: "center" },
    },
    interactions: [{ type: "element-active" }],
  };

  // Cột cho bảng đơn hàng
  const orderColumns = [
    { title: "Số thứ tự", render: (_, __, index) => index + 1 },
    {
      title: "Số tiền",
      dataIndex: "totalAmount",
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    { title: "Phương thức thanh toán", dataIndex: "paymentMethod" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color =
          status === "Processing" ? "blue" : status === "Completed" ? "green" : "red";
        return <span style={{ fontWeight: "bold", color }}>{status}</span>;
      },
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#21252b" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "all 0.3s ease",
      }}
    >
      <Header />
      <Container
        style={{
          flex: 1,
          paddingTop: "80px",
          paddingBottom: "20px",
          backgroundColor: isDarkMode ? "#2c3e50" : "#fff",
          borderRadius: isDarkMode ? "10px" : "0",
          boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
          <Col>
            <Title level={2} style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21", margin: 0 }}>
              Bảng điều khiển người dùng
            </Title>
          </Col>
          <Col>
            <Select defaultValue="all" onChange={setTimeFilter} style={{ width: 120 }}>
              <Option value="all">Tất cả</Option>
              <Option value="day">Hôm nay</Option>
              <Option value="week">Tuần này</Option>
              <Option value="month">Tháng này</Option>
            </Select>
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Thống kê nhanh */}
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Đơn hàng đang xử lý"
                    value={stats.processing}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Đơn hàng hoàn thành"
                    value={stats.completed}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Đơn hàng đã hủy"
                    value={stats.cancelled}
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Biểu đồ hình tròn */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Phân bố trạng thái đơn hàng" style={{ height: "100%" }}>
                  <Pie {...pieConfig} />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Đơn hàng gần đây" style={{ height: "100%" }}>
                  <Table
                    columns={orderColumns}
                    dataSource={orders.slice(0, 5)}
                    pagination={false}
                    rowKey="_id"
                    scroll={{ x: "max-content" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Bảng danh sách tất cả đơn hàng */}
            <Card title="Tất cả đơn hàng" style={{ marginTop: "20px" }}>
              <Table
                columns={orderColumns}
                dataSource={orders}
                rowKey="_id"
                bordered
                scroll={{ x: "max-content" }}
                pagination={{
                  pageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                }}
              />
            </Card>
          </>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default UserDashboard;