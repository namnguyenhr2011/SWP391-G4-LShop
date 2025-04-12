import { Table, Button, message, Spin, Typography, Space } from "antd";
import { useState, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { getAssignedOrders, acceptOrder, completeOrder, cancelOrder } from "../../Service/sale/ApiSale";

const { Title } = Typography;

const SaleOrderManagement = ({ loading: parentLoading, setLoading: setParentLoading }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const fetchAssignedOrders = async () => {
    setLoading(true);
    setParentLoading(true);
    try {
      const data = await getAssignedOrders();
      setOrders((data.orders || []).reverse()); // Đảo ngược mảng để đơn mới nhất lên đầu
    } catch (error) {
      message.error("Unable to fetch order list");
      setOrders([]);
    } finally {
      setLoading(false);
      setParentLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder(orderId);
      message.success("Order accepted successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Processing" } : order
        )
      );
    } catch (error) {
      message.error(error.message || "Unable to accept order");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId);
      message.success("Order completed successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Completed" } : order
        )
      );
    } catch (error) {
      message.error(error.message || "Unable to complete order");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      message.success("Order cancelled successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (error) {
      message.error(error.message || "Unable to cancel order");
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      key: "no",
      render: (_, __, index) => <span style={{ fontSize: "16px" }}>{index + 1}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "userId",
      key: "customer",
      render: (user) => <span style={{ fontSize: "16px" }}>{user?.userName || "Unknown"}</span>, 
    },
    { title: "Customer Phone", 
      dataIndex: "userId", 
      key: "phone", 
      render: (user) => <span style={{ fontSize: "16px" }}>{user?.phone || "Unknown"}</span> },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <div style={{ fontSize: "14px", lineHeight: "1.4" }}> {/* Tăng từ 11px lên 14px */}
          {products.map((item) => (
            <div key={item._id} style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
              {item.productId?.name || "Unknown"} - Qty: {item.quantity} - Price: {item.price.toLocaleString()} VND
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => <span style={{ fontSize: "16px" }}>{totalAmount.toLocaleString()} VND</span>, // Tăng từ 12px lên 16px
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => <span style={{ fontSize: "16px" }}>{method}</span>, // Tăng từ 12px lên 16px
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) => {
        let color = "orange";
        if (paymentStatus === "Completed") color = "green";
        if (paymentStatus === "Failed") color = "red";
        return <span style={{ fontWeight: "bold", color, fontSize: "16px" }}>{paymentStatus}</span>; // Tăng từ 12px lên 16px
      },
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Processing") color = "blue";
        if (status === "Completed") color = "green";
        if (status === "Cancelled") color = "red";
        return <span style={{ fontWeight: "bold", color, fontSize: "16px" }}>{status}</span>; // Tăng từ 12px lên 16px
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => {
        const canAcceptOrCancel = record.status === "Pending";
        const canCompleteOrCancel = record.status === "Processing";
        return (
          <Space>
            {canAcceptOrCancel && (
              <>
                <Button type="primary" onClick={() => handleAcceptOrder(record._id)} size="middle"> {/* Tăng từ small lên middle */}
                  Process
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleCancelOrder(record._id)}
                  size="middle" // Tăng từ small lên middle
                />
              </>
            )}
            {canCompleteOrCancel && (
              <>
                <Button type="primary" onClick={() => handleCompleteOrder(record._id)} size="middle"> {/* Tăng từ small lên middle */}
                  Complete
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleCancelOrder(record._id)}
                  size="middle" // Tăng từ small lên middle
                />
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return loading ? (
    <div style={{ textAlign: "center", padding: "4rem 0" }}>
      <Spin size="large" />
    </div>
  ) : (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <Title level={3} style={{ color: "#1e3c72", fontWeight: "600", marginBottom: "1.5rem", fontSize: "24px" }}> {/* Tăng từ 18px lên 24px */}
        Order Management
      </Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        bordered
        style={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          fontSize: "16px", // Tăng fontSize mặc định của bảng từ 12px lên 16px
        }}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: 5,
          position: ["bottomCenter"],
          showTotal: (total, range) => (
            <span style={{ fontSize: "16px" }}>{`${range[0]}-${range[1]} of ${total} orders`}</span> // Tăng từ 12px lên 16px
          ),
        }}
      />
    </div>
  );
};

export default SaleOrderManagement;