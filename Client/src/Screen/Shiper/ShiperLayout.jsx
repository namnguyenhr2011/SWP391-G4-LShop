import { Layout, Menu } from "antd";
import {
  ShopOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { doLogout, doDarkMode } from "../../store/reducer/userReducer";

const { Header, Sider, Content } = Layout;

const ShiperLayout = () => {
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
      key: "ms",
      icon: <ShopOutlined />,
      label: "Manage Shipper",
      children: [
        {
          key: "/shipper",
          label: <Link to="/shipper">Order List</Link>,
        },
      ],
    },
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
          Shipper Panel
        </Header>
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShiperLayout;
