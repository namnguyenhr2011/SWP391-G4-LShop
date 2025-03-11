import { Table, Button, Popconfirm, message } from "antd";
import { useState, useEffect } from "react";
import { getAllUser } from "../../Service/Admin/AdminServices";

const SaleManagement = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await getAllUser();
      const salesData = data.users.filter(
        (user) => user.role.toLowerCase() === "sale"
      );
      setSales(salesData);
    } catch (error) {
      message.error("Failed to fetch sales data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key) => {
    try {
      await fetch(`/api/users/${key}`, { method: "DELETE" });
      message.success("User deleted successfully");
      fetchSales();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "stt",
      render: (_, __, index) => index + 1,
    },
    { title: "Username", dataIndex: "userName", key: "userName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status.toLowerCase() === "active" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.key)}
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns}
        dataSource={sales}
        rowKey="key"
        loading={loading}
      />
    </div>
  );
};

export default SaleManagement;
