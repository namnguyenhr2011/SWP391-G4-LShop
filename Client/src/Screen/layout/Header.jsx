<<<<<<< HEAD
import {
  Layout,
  Menu,
  Space,
  Avatar,
  Dropdown,
  message,
  Switch,
  Badge,
} from "antd";
=======
import { Layout, Menu, Space, Avatar, Dropdown, message, Switch, Badge } from "antd";
>>>>>>> duc
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
<<<<<<< HEAD
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import ButtonAntd from "../../Component/Button";
import InputSearch from "../../Component/InputSearch";
import { doLogout, doDarkMode } from "../../Store/reducer/userReducer";

const DEFAULT_LOGO = "/L.png";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("header");

  // Redux state selectors
  const { token, _id: userId } = useSelector((state) => state.user?.user || {});
  const { nameApp, logo } = useSelector((state) => state.admin?.app || {});
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const cartItems = useSelector((state) => state.cart.items[userId] || []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Effects
  useEffect(() => {
    document.title = nameApp || "My App";
    const iconLink = document.querySelector("link[rel='icon']");
    if (logo && iconLink) {
      iconLink.href = logo;
    }
  }, [logo, nameApp]);

  // Event handlers
  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    dispatch(doLogout()); // Thực hiện logout
    dispatch(doDarkMode(false)); // Đặt lại dark mode về false (light mode)
    message.success(t("Logout success!"));
    navigate("/");
  };

  const toggleDarkMode = () => dispatch(doDarkMode(!isDarkMode));

  const handleUserProfile = () => navigate("/userProfile");

  // Profile dropdown menu
  const profileMenu = (
    <Menu
      style={{
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        backgroundColor: isDarkMode ? "#1e2a3c" : "#fff",
      }}
    >
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={handleUserProfile}
      >
        {t("Profile")}
      </Menu.Item>

      <Menu.Item key="darkmode">
        <Space>
          {isDarkMode ? <MoonOutlined /> : <SunOutlined />}
          {t("DarkMode")}
          <Switch
            checked={isDarkMode}
            onChange={toggleDarkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            size="small"
          />
        </Space>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        {t("Logout")}
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
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        transition: "background-color 0.3s ease, padding 0.3s ease",
        height: 64,
      }}
    >
      {/* Logo Section */}
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

      {/* Right Section */}
      <Space
        size="large"
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <InputSearch />

        <Badge count={cartCount} offset={[8, 0]} size="small" color="#ff4d4f">
          <ShoppingCartOutlined
            onClick={() => navigate("/cart")}
            style={{
              fontSize: "24px",
              cursor: "pointer",
              color: "#fff",
              transition: "color 0.3s ease",
              verticalAlign: "middle",
              lineHeight: "64px",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#40c4ff")}
            onMouseLeave={(e) => (e.target.style.color = "#fff")}
            aria-label={`Cart with ${cartCount} items`}
          />
        </Badge>

        <Dropdown
          overlay={profileMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          {token ? (
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{
                cursor: "pointer",
                backgroundColor: isDarkMode ? "#30363d" : "#1890ff",
                transition: "background-color 0.3s ease",
                verticalAlign: "middle",
                lineHeight: "64px",
              }}
              aria-label="User profile menu"
            />
          ) : (
            <ButtonAntd
              onClick={handleLogin}
              type="primary"
              icon={<LoginOutlined />}
              content={t("login")}
              style={{
                borderRadius: "6px",
                transition: "all 0.3s ease",
                height: "36px",
                lineHeight: "36px",
              }}
            />
          )}
        </Dropdown>
      </Space>
    </Layout.Header>
  );
=======
import { UserOutlined, LoginOutlined, LogoutOutlined, MoonOutlined, SunOutlined, ShoppingCartOutlined, OrderedListOutlined } from "@ant-design/icons";

import ButtonAntd from "../../Component/ButtonAntd";
import InputSearch from "../../Component/InputSearch";
import { doLogout, doDarkMode } from "../../Store/reducer/userReducer";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation("header");

    const { token } = useSelector((state) => state.user?.user);
    const { nameApp, logo } = useSelector((state) => state.admin?.app) || {};
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const { _id: userId } = useSelector((state) => state.user?.user) || {};
    const cartItems = useSelector((state) => state.cart.items[userId] || []);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);



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
    }

    const handleOrder = () => {
        navigate("/order");
    }

    const profileMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />} onClick={handleUserProfile}>
                Profile
            </Menu.Item>
            <Menu.Item key="order" icon={<OrderedListOutlined />} onClick={handleOrder}>
                Your Order
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
            {/* LOGO BÊN TRÁI */}
            <div>
                {logo && (
                    <img
                        onClick={() => navigate("/")}
                        src={logo}
                        width={50}
                        alt="logo"
                        style={{ cursor: "pointer", borderRadius: "8px" }}
                    />
                )}
            </div>

            <Space size="large" style={{ marginLeft: "auto" }}>
                <InputSearch />

                <Badge count={cartCount} offset={[10, 0]} size="small">
                    <ShoppingCartOutlined
                        onClick={() => navigate("/cart")}
                        style={{ fontSize: "24px", cursor: "pointer", color: "#fff" }}
                    />
                </Badge>

                <Dropdown overlay={profileMenu} trigger={["click"]}>
                    {token ? (
                        <Avatar size="large" icon={<UserOutlined />} style={{ cursor: "pointer" }} />
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
>>>>>>> duc
};

export default Header;
