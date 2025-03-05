import { Layout, Menu, Space, Avatar, Dropdown, message, Switch, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { UserOutlined, LoginOutlined, LogoutOutlined, MoonOutlined, SunOutlined, ShoppingCartOutlined } from "@ant-design/icons";

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

    const profileMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />} onClick={handleUserProfile}>
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
};

export default Header;
