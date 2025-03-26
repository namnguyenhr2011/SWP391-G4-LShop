import { Table, Button, message, Spin, Typography, Space } from "antd";
import { useState, useEffect } from "react";
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
      const sortedOrders = sortOrders(data.orders || []);
      setOrders(sortedOrders);
    } catch (error) {
      message.error("Unable to fetch order list");
      setOrders([]);
    } finally {
      setLoading(false);
      setParentLoading(false);
    }
  };

  // Helper function to sort orders: "Completed" and "Cancelled" go to the bottom
  const sortOrders = (orders) => {
    return orders.sort((a, b) => {
      const statusA = a.status;
      const statusB = b.status;

      // Define the order of statuses
      const statusOrder = {
        Pending: 1,
        Processing: 2,
        Completed: 3,
        Cancelled: 4,
      };

      return statusOrder[statusA] - statusOrder[statusB];
    });
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder(orderId);
      message.success("Order accepted successfully!");
      // Update local state instead of refetching
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Processing" } : order
        );
        return sortOrders(updatedOrders);
      });
    } catch (error) {
      message.error(error.message || "Unable to accept order");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId);
      message.success("Order completed successfully!");
      // Update local state instead of refetching
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Completed" } : order
        );
        return sortOrders(updatedOrders);
      });
    } catch (error) {
      message.error(error.message || "Unable to complete order");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      message.success("Order cancelled successfully!");
      // Update local state instead of refetching
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        );
        return sortOrders(updatedOrders);
      });
    } catch (error) {
      message.error(error.message || "Unable to cancel order");
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Customer Name",
      dataIndex: "userId",
      key: "customer",
      render: (user) => user?.userName || "Unknown",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <div style={{ fontSize: "12px", lineHeight: "1.2" }}>
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
      render: (totalAmount) => `${totalAmount.toLocaleString()} VND`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Processing") color = "blue";
        if (status === "Completed") color = "green";
        if (status === "Cancelled") color = "red";
        return <span style={{ fontWeight: "bold", color }}>{status}</span>;
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => {
        const canAcceptOrCancel = record.status === "Pending";
        const canComplete = record.status === "Processing";
        return (
          <Space>
            {canAcceptOrCancel && (
              <>
                <Button type="primary" onClick={() => handleAcceptOrder(record._id)}>
                  Process
                </Button>
                <Button danger onClick={() => handleCancelOrder(record._id)}>
                  Cancel
                </Button>
              </>
            )}
            {canComplete && (
              <Button type="primary" onClick={() => handleCompleteOrder(record._id)}>
                Complete
              </Button>
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
      <Title level={3} style={{ color: "#1e3c72", fontWeight: "600", marginBottom: "1.5rem" }}>
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
        }}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: 5,
          position: ["bottomCenter"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
        }}
      />
    </div>
  );
};

export default SaleOrderManagement;