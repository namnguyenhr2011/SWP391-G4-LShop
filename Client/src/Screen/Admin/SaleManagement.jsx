import { useState, useEffect } from "react";
import { Table, Button, Spin, message, Select, Modal, Input } from "antd";
import {
  getAllUser,
  deleteUser,
  changeRole,
  changeStatus,
} from "../../service/admin/AdminServices";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { confirm } = Modal;

const SaleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

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

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChangeRole = async (id, newRole) => {
    try {
      await changeRole(id, newRole);
      message.success("Role update successful!");
      fetchUsers();
    } catch (error) {
      message.error(error.message);
    }
  };

  const showConfirmDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Confirm",
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
      setLoading(true);
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await changeStatus(userId, newStatus);
      message.success("Status updated successfully");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      message.error(error.message || "Failed to change status");
    } finally {
      setLoading(false);
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
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
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
      <Input
        placeholder="Search by username"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200, marginBottom: 16 }}
        prefix={<SearchOutlined />}
      />
      <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />
    </div>
  );
};

export default SaleManagement;
