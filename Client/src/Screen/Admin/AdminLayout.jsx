import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item>
            <Link
              to="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="../L.png"
                alt="Logo"
                style={{ width: "30px", height: "30px", objectFit: "contain" }}
              />
            </Link>
          </Menu.Item>

          <Menu.Item key="/admin" icon={<DashboardOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/admin/manage-user" icon={<UserOutlined />}>
            <Link to="/admin/manage-user">Manage Users</Link>
          </Menu.Item>
          <Menu.Item key="/admin/manage-sale" icon={<ShopOutlined />}>
            <Link to="/admin/manage-sale">Manage Sales</Link>
          </Menu.Item>
          <Menu.Item key="/admin/manage-feedback" icon={<MessageOutlined />}>
            <Link to="/admin/manage-feedback">Manage Feedback</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          Admin Panel
        </Header>
        <Content style={{ margin: "16px" }}>
          <Outlet /> {/* Hiển thị nội dung của từng trang con */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
