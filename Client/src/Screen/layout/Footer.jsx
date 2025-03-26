import { FacebookOutlined, GithubOutlined, GoogleOutlined, LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Typography, Space, Divider, Input } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";  

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => {
  const { t } = useTranslation("footer"); 
  const isDarkMode = useSelector((state) => state.user.darkMode) || false;

  const footerStyle = {
    backgroundColor: isDarkMode ? "#161b22" : "#001529",
    color: isDarkMode ? "#c9d1d9" : "#ffffff",
    padding: "40px 20px",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const textColor = isDarkMode ? "#c9d1d9" : "#ffffff";
  const dividerColor = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(255, 255, 255, 0.2)";

  return (
    <Footer style={footerStyle}>
      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: textColor }}>
            {t("L-Shop")}
          </Title>
          <Text style={{ color: textColor }}>
            {t("L-Shop Description")}
          </Text>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: textColor }}>
            {t("Category")}
          </Title>
          <Space direction="vertical">
            <Text style={{ color: textColor }}>📱 {t("Phone")}</Text>
            <Text style={{ color: textColor }}>💻 {t("Laptop")}</Text>
            <Text style={{ color: textColor }}>🎧 {t("Accessories")}</Text>
            <Text style={{ color: textColor }}>⌚ {t("Smartwatch")}</Text>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: textColor }}>
            {t("Support")}
          </Title>
          <Space direction="vertical">
            <Text style={{ color: textColor }}>📞 {t("Hotline")}</Text>
            <Text style={{ color: textColor }}>
              📍 {t("Address")}
            </Text>
            <Text style={{ color: textColor }}>
              📧 {t("Email")}
            </Text>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: textColor }}>
            {t("Subscribe")}
          </Title>
          <Input
            placeholder={t("Enter email")}
            style={{ borderRadius: "8px", marginBottom: "10px" }}
          />
          <Space size="middle">
            <a href="#!" style={{ color: textColor, fontSize: "20px" }}>
              <FacebookOutlined />
            </a>
            <a href="#!" style={{ color: textColor, fontSize: "20px" }}>
              <TwitterOutlined />
            </a>
            <a href="#!" style={{ color: textColor, fontSize: "20px" }}>
              <GoogleOutlined />
            </a>
            <a href="#!" style={{ color: textColor, fontSize: "20px" }}>
              <GithubOutlined />
            </a>
            <a href="#!" style={{ color: textColor, fontSize: "20px" }}>
              <LinkedinOutlined />
            </a>
          </Space>
        </Col>
      </Row>

      <Divider style={{ borderColor: dividerColor }} />

      <div
        style={{
          textAlign: "center",
          fontSize: "14px",
          opacity: 0.8,
          color: textColor,
        }}
      >
        {t("All Rights Reserved")}
      </div>
    </Footer>
  );
};

export default AppFooter;
