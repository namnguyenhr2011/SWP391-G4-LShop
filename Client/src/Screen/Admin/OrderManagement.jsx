import { Table, Select, message, Skeleton, Button } from "antd";
import { useState, useEffect } from "react";
import {
  getAllOrder,
  getAllUser,
  assignSalerToOrder,
} from "../../service/admin/AdminServices";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [assigning, setAssigning] = useState(false);

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

  const handleAutoAssignSalers = async () => {
    if (!sales.length) {
      message.error("No salers available to assign!");
      return;
    }

    setAssigning(true);
    try {
      // Lọc các order chưa có saler
      const unassignedOrders = orders.filter(
        (order) => !order.saleClaim?.salerId
      );

      if (unassignedOrders.length === 0) {
        message.info("All orders already have salers!");
        setAssigning(false);
        return;
      }

      // Đếm số order pending của mỗi saler
      const salerOrderCount = sales.map((saler) => {
        const pendingCount = orders.filter(
          (order) =>
            order.saleClaim?.salerId === saler._id &&
            order.status.toLowerCase() === "pending"
        ).length;
        return { salerId: saler._id, pendingCount };
      });

      // Sắp xếp saler theo số lượng order pending (ít nhất lên đầu)
      salerOrderCount.sort((a, b) => a.pendingCount - b.pendingCount);

      // Chia đều order cho các saler
      const assignPromises = [];
      const salerQueue = [...salerOrderCount]; // Hàng đợi saler để phân bổ

      unassignedOrders.forEach((order) => {
        // Lấy saler có ít order pending nhất
        const assignedSaler = salerQueue.shift(); // Lấy saler đầu tiên
        assignPromises.push(
          assignSalerToOrder(order._id, assignedSaler.salerId)
        );

        // Tăng số lượng pending của saler này và đưa lại vào hàng đợi
        assignedSaler.pendingCount += 1;
        salerQueue.push(assignedSaler);
        salerQueue.sort((a, b) => a.pendingCount - b.pendingCount); // Sắp xếp lại
      });

      await Promise.all(assignPromises);
      message.success(
        `Successfully assigned salers to ${unassignedOrders.length} orders evenly!`
      );
      await fetchOrders();
    } catch (error) {
      message.error("Failed to auto-assign salers");
    } finally {
      setAssigning(false);
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
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(amount),
    },
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
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={handleAutoAssignSalers}
          loading={assigning}
          disabled={loadingSales || loadingOrders}
        >
          Auto Assign Salers Evenly
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loadingOrders}
        pagination={{
          pageSizeOptions: ["10", "20", "50", "100"], // Các tùy chọn số lượng dòng
          showSizeChanger: true, // Hiển thị dropdown chọn số lượng dòng
          defaultPageSize: 10, // Giá trị mặc định
        }}
      />
    </div>
  );
};

export default OrderManagement;
