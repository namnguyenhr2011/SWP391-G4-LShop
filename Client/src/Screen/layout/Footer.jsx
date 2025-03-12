<<<<<<< HEAD
import {
  FacebookOutlined,
  GithubOutlined,
  GoogleOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
=======
import { FacebookOutlined, GithubOutlined, GoogleOutlined, LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";
>>>>>>> duc
import { Layout, Row, Col, Typography, Space, Divider, Input } from "antd";
import { useSelector } from "react-redux";

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => {
<<<<<<< HEAD
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
            L-Shop
          </Title>
          <Text style={{ color: textColor }}>
            L-Shop chuyên cung cấp điện thoại, laptop và phụ kiện chính hãng.
          </Text>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: textColor }}>
            Danh Mục
          </Title>
          <Space direction="vertical">
            <Text style={{ color: textColor }}>📱 Điện thoại</Text>
            <Text style={{ color: textColor }}>💻 Laptop</Text>
            <Text style={{ color: textColor }}>🎧 Phụ kiện</Text>
            <Text style={{ color: textColor }}>⌚ Đồng hồ thông minh</Text>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: textColor }}>
            Hỗ Trợ
          </Title>
          <Space direction="vertical">
            <Text style={{ color: textColor }}>📞 Hotline: 1900 8888</Text>
            <Text style={{ color: textColor }}>
              📍 Địa chỉ: 123 Nguyễn Văn Cừ, TP.HCM
            </Text>
            <Text style={{ color: textColor }}>
              📧 Email: support@lshop.com
            </Text>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: textColor }}>
            Nhận Tin Khuyến Mãi
          </Title>
          <Input
            placeholder="Nhập email của bạn"
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
        © 2024 L-Shop. All Rights Reserved.
      </div>
    </Footer>
  );
=======
    const isDarkMode = useSelector((state) => state.user.darkMode) || false;

    const footerStyle = {
        backgroundColor: isDarkMode ? "#161b22" : "#001529",
        color: isDarkMode ? "#c9d1d9" : "#ffffff",
        padding: "40px 20px",
        transition: "background-color 0.3s ease, color 0.3s ease",
    };

    const textColor = isDarkMode ? "#c9d1d9" : "#ffffff";
    const dividerColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)";

    return (
        <Footer style={footerStyle}>
            <Row gutter={[32, 32]} justify="center">
                <Col xs={24} sm={12} md={6}>
                    <Title level={4} style={{ color: textColor }}>L-Shop</Title>
                    <Text style={{ color: textColor }}>L-Shop chuyên cung cấp điện thoại, laptop và phụ kiện chính hãng.</Text>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: textColor }}>Danh Mục</Title>
                    <Space direction="vertical">
                        <Text style={{ color: textColor }}>📱 Điện thoại</Text>
                        <Text style={{ color: textColor }}>💻 Laptop</Text>
                        <Text style={{ color: textColor }}>🎧 Phụ kiện</Text>
                        <Text style={{ color: textColor }}>⌚ Đồng hồ thông minh</Text>
                    </Space>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: textColor }}>Hỗ Trợ</Title>
                    <Space direction="vertical">
                        <Text style={{ color: textColor }}>📞 Hotline: 1900 8888</Text>
                        <Text style={{ color: textColor }}>📍 Địa chỉ: 123 Nguyễn Văn Cừ, TP.HCM</Text>
                        <Text style={{ color: textColor }}>📧 Email: support@lshop.com</Text>
                    </Space>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: textColor }}>Nhận Tin Khuyến Mãi</Title>
                    <Input placeholder="Nhập email của bạn" style={{ borderRadius: "8px", marginBottom: "10px" }} />
                    <Space size="middle">
                        <a href="#!" style={{ color: textColor, fontSize: "20px" }}><FacebookOutlined /></a>
                        <a href="#!" style={{ color: textColor, fontSize: "20px" }}><TwitterOutlined /></a>
                        <a href="#!" style={{ color: textColor, fontSize: "20px" }}><GoogleOutlined /></a>
                        <a href="#!" style={{ color: textColor, fontSize: "20px" }}><GithubOutlined /></a>
                        <a href="#!" style={{ color: textColor, fontSize: "20px" }}><LinkedinOutlined /></a>
                    </Space>
                </Col>
            </Row>

            <Divider style={{ borderColor: dividerColor }} />

            <div style={{ textAlign: "center", fontSize: "14px", opacity: 0.8, color: textColor }}>
                © 2024 L-Shop. All Rights Reserved.
            </div>
        </Footer>
    );
>>>>>>> duc
};

export default AppFooter;
