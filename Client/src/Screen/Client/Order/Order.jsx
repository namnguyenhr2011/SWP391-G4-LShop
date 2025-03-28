import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Spin, message, Modal, Switch } from "antd";
import { getOrders, cancelOrder } from "../../../Service/Client/ApiOrder";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { useSelector } from "react-redux";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      if (response && response.data.orders) {
        const sortedOrders = response.data.orders
          .filter((order) => order.createdAt)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setOrders(sortedOrders);
      } else {
        message.error("No orders found.");
      }
    } catch {
      message.error("Failed to fetch orders");
    }
    setLoading(false);
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
      okButtonProps: {
        style: { backgroundColor: isDarkMode ? "#4a90e2" : "#3498db" },
      },
      onOk: async () => {
        message.info("Your request is pending...");
        try {
          const response = await cancelOrder(id);
          if (response && response.status === "pending") {
            message.success(
              "Cancellation request sent. Waiting for confirmation."
            );
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
      title: "Total Amount",
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
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#21252b" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "all 0.3s ease",
      }}
    >
      <Header />
      <div
        style={{
          padding: "80px 20px 20px",
          margin: "auto",
          backgroundColor: isDarkMode ? "#2c3e50" : "#fff", // Blue in dark mode
          borderRadius: isDarkMode ? "10px" : "0",
          boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <h1
          style={{
            color: isDarkMode ? "#e6edf3" : "#1c1e21",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          My Orders
        </h1>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="_id"
            pagination={pagination}
            onChange={(p) => setPagination(p)}
            style={{
              backgroundColor: isDarkMode ? "#2c3e50" : "#fff",
            }}
            className={isDarkMode ? "dark-mode-table" : ""}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;

// Add these styles to your CSS file
const globalDarkModeStyles = `
  body.dark-mode {
    background-color: #21252b;
    color: #e6edf3;
  }

  .dark-mode-table .ant-table {
    background-color: #2c3e50 !important;
    color: #e6edf3;
  }

  .dark-mode-table .ant-table-thead > tr > th {
    background-color: #34495e !important;
    color: #e6edf3 !important;
    border-bottom: 1px solid #465c71 !important;
  }

  .dark-mode-table .ant-table-tbody > tr > td {
    border-bottom: 1px solid #465c71;
    color: #e6edf3;
  }

  .dark-mode-table .ant-table-tbody > tr:hover > td {
    background-color: #34495e !important;
  }

  .dark-mode-table .ant-table-row {
    background-color: #2c3e50 !important;
  }

  .dark-mode-table .ant-pagination-item {
    background-color: #34495e !important;
    border-color: #465c71 !important;
    color: #e6edf3 !important;
  }

  .dark-mode-table .ant-pagination-item-active {
    background-color: #4a90e2 !important;
    border-color: #4a90e2 !important;
  }

  .dark-mode-table .ant-pagination-prev,
  .dark-mode-table .ant-pagination-next {
    background-color: #34495e !important;
    border-color: #465c71 !important;
    color: #e6edf3 !important;
  }

  .dark-mode-table .ant-pagination-prev:hover,
  .dark-mode-table .ant-pagination-next:hover {
    border-color: #4a90e2 !important;
    color: #4a90e2 !important;
  }
`;
