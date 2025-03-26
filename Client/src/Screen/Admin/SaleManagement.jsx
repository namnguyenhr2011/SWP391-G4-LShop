import { useState, useEffect } from "react";
import { Table, Button, Spin, message, Select, Modal } from "antd";
import {
  getAllUser,
  deleteUser,
  changeRole,
  changeStatus,
} from "../../service/admin/AdminServices";

const { Option } = Select;
const { confirm } = Modal;

const SaleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUser();
      const productManagerData = data.users.filter(
        (user) => user.role === "sale"
      );
      setUsers(productManagerData);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await changeRole(id, newRole);
      message.success("Role update successful!");
      fetchUsers(); // Load lại danh sách
    } catch (error) {
      console.error("Error changing role:", error);
      message.error(error.message);
    }
  };

  const showConfirmDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Comfirm",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDeleteUser(id);
      },
    });
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      message.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleChangeStatus = async (userId, currentStatus) => {
    try {
      setLoading(true); // Bật hiệu ứng loading

      const newStatus = currentStatus === "active" ? "inactive" : "active";

      // Gọi API đổi trạng thái
      await changeStatus(userId, newStatus);
      message.success("Status updated successfully");

      // Cập nhật trạng thái mới vào danh sách người dùng
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      message.error(error.message || "Failed to change status");
    } finally {
      setLoading(false); // Tắt hiệu ứng loading sau khi hoàn thành
    }
  };

  const showConfirmStatusChange = (userId, currentStatus) => {
    const action = currentStatus === "active" ? "ban" : "unban";
    confirm({
      title: `Are you sure you want to ${action} this user?`,
      content: "This action will change the user's access rights.",
      okText: "Confirm",
      cancelText: "Cancel",
      okType: "danger",
      onOk() {
        handleChangeStatus(userId, currentStatus);
      },
    });
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          value={role}
          style={{ width: 120 }}
          onChange={(value) => {
            handleChangeRole(record._id, value);
          }}
        >
          <Option value="user">User</Option>
          <Option value="sale">Sale</Option>
          <Option value="productManager">Product Manager</Option>
        </Select>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "active" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            danger
            style={{ marginRight: "10px" }}
            onClick={() => showConfirmDelete(record._id)}
          >
            Delete
          </Button>
          <Button
            type={record.status === "active" ? "default" : "primary"}
            danger={record.status === "active"}
            style={
              record.status !== "active"
                ? { background: "#52c41a", color: "white" }
                : {}
            }
            onClick={() => showConfirmStatusChange(record._id, record.status)}
          >
            {record.status === "active" ? "Ban" : "Unban"}
          </Button>
        </>
      ),
    },
  ];

  return loading ? (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <Spin size="large" />
    </div>
  ) : (
    <div style={{ padding: "20px" }}>
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </div>
  );
};

export default SaleManagement;
