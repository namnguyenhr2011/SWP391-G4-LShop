import { Layout, Menu, Space, Avatar, Dropdown, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { UserOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";

import ButtonAntd from "../../Component/ButtonAntd";
import SwicthAntd from "../../Component/SwicthAntd";
import InputSearch from "../../Component/InputSearch";
import { doLogout } from "../../Store/reducer/userReducer";

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

    const menuItems = [
        { key: "home", label: "Home", onClick: () => navigate("/") },
        { key: "features", label: "Features", onClick: () => navigate("/features") },
        { key: "pricing", label: "Pricing", onClick: () => navigate("/pricing") },
        { key: "contact", label: "Contact", onClick: () => navigate("/contact") },
    ];

    const profileMenu = (
        <Menu
            items={[
                { key: "profile", label: "Profile", icon: <UserOutlined /> },
                {
                    key: "logout",
                    label: "Logout",
                    icon: <LogoutOutlined />,
                    onClick: handleLogout,
                },
            ]}
        />
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
            <Space>
                {logo && (
                    <img
                        onClick={() => navigate("/")}
                        src={logo}
                        width={50}
                        alt="logo"
                        style={{ cursor: "pointer", borderRadius: "8px" }}
                    />
                )}
                <Menu
                    theme={isDarkMode ? "dark" : "light"}
                    mode="horizontal"
                    items={menuItems}
                    style={{
                        backgroundColor: "transparent",
                        borderBottom: "none",
                        color: "#ffffff",
                    }}
                />
            </Space>

            <Space size="large">
                <InputSearch />

                <SwicthAntd />

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
