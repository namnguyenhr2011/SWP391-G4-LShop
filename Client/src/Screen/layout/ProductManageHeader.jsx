import { Layout, Menu, Space, Avatar, Dropdown, message, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";

import ButtonAntd from "../../Component/Button";
import { doLogout, doDarkMode } from "../../store/reducer/userReducer";

const DEFAULT_LOGO = "/L.png";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("header");

  const { token } = useSelector((state) => state.user?.user);
  const { nameApp, logo } = useSelector((state) => state.admin?.app) || {};
  const isDarkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    if (nameApp) {
      document.title = nameApp;
    }

    if (logo) {
      const iconLink = document.querySelector("link[rel='icon']");
      if (iconLink) {
        iconLink.href = logo;
      }
    }
  }, [logo, nameApp]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(doLogout());
    message.success("Logged out successfully!");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    dispatch(doDarkMode(!isDarkMode));
  };

  const handleUserProfile = () => {
    navigate("/userProfile");
  };

  const profileMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={handleUserProfile}
      >
        Profile
      </Menu.Item>
      <Menu.Item key="darkmode">
        <Space>
          <MoonOutlined />
          Dark Mode
          <Switch
            checked={isDarkMode}
            onChange={toggleDarkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Space>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header
      style={{
        position: "fixed",
        top: 0,
        zIndex: 1000,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isDarkMode ? "#161b22" : "#001529",
        padding: "0 40px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        transition: "background-color 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          onClick={() => navigate("/")}
          src={logo || DEFAULT_LOGO}
          width={40}
          alt={nameApp || "Logo"}
          style={{
            cursor: "pointer",
            borderRadius: "8px",
            transition: "transform 0.3s ease",
            verticalAlign: "middle",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          aria-label="Go to homepage"
        />
      </div>

      <Space size="large" style={{ marginLeft: "auto" }}>
        <Dropdown overlay={profileMenu} trigger={["click"]}>
          {token ? (
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <ButtonAntd
              onClick={handleLogin}
              type="primary"
              icon={<LoginOutlined />}
              content={t("login")}
            />
          )}
        </Dropdown>
      </Space>
    </Layout.Header>
  );
};

export default Header;
