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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUser();
      setUsers(data.users);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await changeRole(id, newRole);
      message.success("Cập nhật vai trò thành công!");
      fetchUsers(); // Load lại danh sách
    } catch (error) {
      console.error("Error changing role:", error);
      message.error(error.message);
    }
  };

  const showConfirmDelete = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa người dùng này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDeleteUser(id);
      },
    });
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      message.success("Xóa người dùng thành công!");
      fetchUsers();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleChangeStatus = async (userId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await changeStatus(userId, newStatus);
      message.success("Status updated successfully");
      fetchUsers();
    } catch (error) {
      message.error(error.message || "Failed to change status");
    } finally {
      setLoading(false);
    }
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
          <Option value="admin">Admin</Option>
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
            onClick={() => handleChangeStatus(record._id, record.status)}
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

export default UserManagement;
