import { Table, Select, message, Skeleton } from "antd";
import { useState, useEffect } from "react";
import {
  getAllOrder,
  getAllUser,
  assignSalerToOrder,
} from "../../service/admin/AdminServices";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true); // Tách loading cho orders
  const [loadingSales, setLoadingSales] = useState(true); // Tách loading cho sales

  useEffect(() => {
    fetchOrders();
    fetchSales();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getAllOrder();
      console.log("Orders data:", data.orders);
      setOrders(data.orders || []);
    } catch (error) {
      message.error("Failed to fetch orders");
      setOrders([]); 
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchSales = async () => {
    setLoadingSales(true);
    try {
      const data = await getAllUser();
      const salesData = data.users.filter(
        (user) => user.role.toLowerCase() === "sale"
      );
      setSales(salesData || []); 
    } catch (error) {
      message.error("Failed to fetch sales data");
      setSales([]);
    } finally {
      setLoadingSales(false);
    }
  };

  const handleSalerChange = async (orderId, salerId) => {
    try {
      await assignSalerToOrder(orderId, salerId);
      message.success("Saler assigned successfully!");
      await fetchOrders();
    } catch (error) {
      message.error(error.message || "Failed to assign saler");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "stt",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Username",
      dataIndex: "userId",
      key: "customer",
      render: (user) => user?.userName || "Unknown",
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    { title: "Phonenumber", dataIndex: "phone", key: "phone" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Total", dataIndex: "totalAmount", key: "totalAmount" },
    {
      title: "Saler",
      dataIndex: "saleClaim",
      key: "saler",
      render: (saleClaim, record) => {
        const selectedSalerId = saleClaim?.salerId || null;
        return (
          <Select
            style={{ width: 150 }}
            value={selectedSalerId}
            onChange={(value) => handleSalerChange(record._id, value)}
            placeholder="Select a saler"
            disabled={loadingSales} 
            loading={loadingSales}
          >
            {sales.map((s) => (
              <Select.Option key={s._id} value={s._id}>
                {s.userName}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
  ];

  if (loadingOrders) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} /> 
      </div>
    );
  }

  return (
    <div
      style={{
        opacity: loadingSales ? 0.5 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loadingOrders} 
        pagination={{ pageSize: 10 }} 
      />
    </div>
  );
};

export default OrderManagement;
