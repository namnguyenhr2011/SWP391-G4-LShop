import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Spin, message, Modal, Input, Select, Row, Col, Space } from "antd";
import { getOrders, cancelOrder } from "../../../Service/Client/ApiOrder";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { UpOutlined, DownOutlined } from "@ant-design/icons"; // Import sort icons

const { Option } = Select;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({
    totalAmount: "",
    paymentMethod: "",
    paymentStatus: "",
    orderStatus: "",
  });
  const [sortOrder, setSortOrder] = useState("asc"); // Track the sorting state
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchOrders();
  }, []); // Fetch orders when the component loads

  useEffect(() => {
    applyFilters(); // Apply filters whenever they change
  }, [filters, orders, sortOrder]); // Run when filters or orders change

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      if (response && response.data.orders) {
        setOrders(response.data.orders);
      } else {
        message.error("No orders found.");
      }
    } catch {
      message.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Apply filters based on the selected filter values
    if (filters.totalAmount) {
      filtered = filtered.filter((order) => order.totalAmount >= parseFloat(filters.totalAmount));
    }
    if (filters.paymentMethod) {
      filtered = filtered.filter((order) => order.paymentMethod === filters.paymentMethod);
    }
    if (filters.paymentStatus) {
      filtered = filtered.filter((order) => order.paymentStatus === filters.paymentStatus);
    }
    if (filters.orderStatus) {
      filtered = filtered.filter((order) => order.status === filters.orderStatus);
    }

    // Apply sorting
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    } else {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    setFilteredOrders(filtered);
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order/orderDetail/${orderId}`);
  };

  const handleCancelOrder = async (id) => {
    Modal.confirm({
      title: "Confirm Cancellation",
      content: "Are you sure you want to cancel this order?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        message.info("Your request is pending...");
        try {
          const response = await cancelOrder(id);
          if (response && response.status === "pending") {
            message.success("Cancellation request sent. Waiting for confirmation.");
          } else {
            fetchOrders();
          }
        } catch {
          message.error("Failed to cancel order");
        }
      },
    });
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const columns = [
    {
      title: "Order Number",
      key: "orderNumber",
      render: (text, record, index) =>
        `Order ${index + 1 + (pagination.current - 1) * pagination.pageSize}`,
    },
    {
      title: (
        <>
          Total Amount
          <Button
            type="link"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            icon={sortOrder === "asc" ? <UpOutlined /> : <DownOutlined />}
            style={{ padding: 0, marginLeft: 8 }}
          />
        </>
      ),
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Pending" ? "orange" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleViewDetails(record._id)}>
            View
          </Button>
          {record.status !== "Cancelled" && record.status !== "Completed" && (
            <Button
              type="link"
              danger
              onClick={() => handleCancelOrder(record._id)}
            >
              Cancel
            </Button>
          )}
        </>
      ),
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
        <Row className="mb-4">
          <Col xs={12} className="text-center mb-3">
            <h1
              style={{
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
              }}
            >
              My Orders
            </h1>
          </Col>

          {/* Filters with Labels */}
          <Col xs={12}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {/* Filter by Payment Method */}
              <label style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21", fontWeight: "bold" }}>Filter by Payment Method</label>
              <Select
                placeholder="Select payment method"
                style={{ width: "100%" }}
                onChange={(value) => setFilters({ ...filters, paymentMethod: value })}
                value={filters.paymentMethod}
              >
                <Option value="">All</Option>
                <Option value="COD">COD</Option>
                <Option value="Bank Transfer">Bank Transfer</Option>
              </Select>

              {/* Filter by Payment Status */}
              <label style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21", fontWeight: "bold" }}>Filter by Payment Status</label>
              <Select
                placeholder="Select payment status"
                style={{ width: "100%" }}
                onChange={(value) => setFilters({ ...filters, paymentStatus: value })}
                value={filters.paymentStatus}
              >
                <Option value="">All</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>

              {/* Filter by Order Status */}
              <label style={{ color: isDarkMode ? "#e6edf3" : "#1c1e21", fontWeight: "bold" }}>Filter by Order Status</label>
              <Select
                placeholder="Select Order Status"
                style={{ width: "100%", marginBottom: 10 }}
                onChange={(value) => setFilters({ ...filters, orderStatus: value })}
                value={filters.orderStatus}
              >
                <Option value="">All</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Shipped">Shipped</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Space>
          </Col>
        </Row>

        <Table
          dataSource={filteredOrders} // Use filtered orders to display the table
          columns={columns}
          rowKey="_id"
          pagination={pagination}
          onChange={(p) => setPagination(p)}
        />
      </Container>
      <Footer />
    </div>
  );
};

export default MyOrders;
