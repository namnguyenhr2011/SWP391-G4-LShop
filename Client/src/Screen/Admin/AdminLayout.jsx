import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  MessageOutlined,

  FileTextOutlined, // Thêm icon cho blog
  SoundOutlined
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { doLogout, doDarkMode } from "../../store/reducer/userReducer";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(doLogout()); // Thực hiện logout
    dispatch(doDarkMode(false)); // Đặt lại dark mode về false (light mode)
    navigate("/");
  };

  const menuItems = [
    {
      key: "logo",
      label: (
        <div
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src="../L.png"
            alt="Logo"
            style={{ width: "30px", height: "30px", objectFit: "contain" }}
          />
        </div>
      ),
    },
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/manage-user",
      icon: <UserOutlined />,
      label: <Link to="/admin/manage-user">Manage Users</Link>,
    },
    {
      key: "ms",
      icon: <ShopOutlined />,
      label: "Manage Salers",
      children: [
        {
          key: "/admin/saler-list",
          label: <Link to="/admin/saler-list">Saler List</Link>,
        },
        {
          key: "/admin/order-list",
          label: <Link to="/admin/order-list">Order List</Link>,
        },
      ],
    },
    {
      key: "/admin/manage-productmanager",
      icon: <UserOutlined />,
      label: (
        <Link to="/admin/manage-productmanager">Manage ManagerProducts</Link>
      ),
    },
    {
      key: "/admin/manage-feedback",
      icon: <MessageOutlined />,
      label: <Link to="/admin/manage-feedback">Manage Feedback</Link>,

    }, {
    },
    {
      key: "mb",
      icon: <FileTextOutlined />,
      label: "Manage Blog",
      children: [
        {
          key: "/admin/blog-list",
          label: <Link to="/admin/blog-list">Blog List</Link>,
        },
        {
          key: "/admin/add-blog",
          label: <Link to="/admin/add-blog">Add Blog</Link>,
        },
      ],
    },
    {
      key: '/admin/manage-ads',
      icon: <SoundOutlined />,
      label: <Link to="/admin/manage-ads">Manage Ads</Link>
    }
    , {
      key: "admin/manage-discount",
      icon: <FileTextOutlined />,
      label: "Manage Discount",
      children: [
        {
          icon: <FileTextOutlined />,
          key: "/admin/statistics",
          label: <Link to="/admin/discountStatistics">Discount Statistics</Link>,
        },
        {
          icon: <FileTextOutlined />,
          key: "/admin/manage-discount",
          label: <Link to="/admin/manage-discount">Discount Dashboard</Link>,
        },
        {
          icon: <FileTextOutlined />,
          key: "/admin/userDiscount",
          label: <Link to="/admin/userDiscount">User Discount</Link>,
        },
      ],
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          Admin Panel
        </Header>
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
