import { Layout, Typography, Row, Col, Carousel, Divider, Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import SidebarMenuAntd from "../Component/SidebarMenu";
import FeaturedProducts from "../Component/FearturedProducts";
import SaleProducts from "../Component/SaleProducts";
import TopSoldProducts from "../Component/TopSoldProducts";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import BottomAds from "../Component/BottomAds";
import LeftAdsBanner from "../Component/LeftAds";
import RightAdsBanner from "../Component/RightAds";
import { compareProducts } from "../Service/Client/ApiProduct";

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#21252b" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "all 0.3s ease",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <Content
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "auto",
          backgroundColor: isDarkMode ? "rgba(33, 37, 43, 0.9)" : "#fff",
          borderRadius: isDarkMode ? "10px" : "0",
          boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <Row gutter={0} style={{ paddingTop: "30px" }}>
          <Col xs={24} sm={4}>
            <SidebarMenuAntd />
          </Col>
          <Col xs={24} sm={20} style={{ paddingLeft: "15px" }}>
            <Carousel
              autoplay
              autoplaySpeed={5000}
              effect="fade"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                height: "500px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "relative",
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.3)"
                    : "transparent",
                }}
              >
                <img
                  src="https://file.hstatic.net/200000722513/file/thang_01_laptop_gaming_banner_web_slider_800x400.png"
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.3)"
                    : "transparent",
                }}
              >
                <img
                  src="https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_1199a3adfc23489798d4163a97f3bc62.jpg"
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                />
              </div>
            </Carousel>
          </Col>
        </Row>

        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Title
            level={2}
            style={{
              color: isDarkMode ? "#e6edf3" : "#1c1e21",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            {t("welcome")}
          </Title>
          <Text
            style={{ fontSize: "16px", color: isDarkMode ? "#b0b8c1" : "#666" }}
          >
            {t("explore")}
          </Text>
        </div>

        <FeaturedProducts isDarkMode={isDarkMode} />
        <Divider
          style={{
            margin: "40px 0",
            borderColor: isDarkMode ? "#444" : "#ccc",
          }}
        />

        <TopSoldProducts isDarkMode={isDarkMode} />
        <Divider
          style={{
            margin: "40px 0",
            borderColor: isDarkMode ? "#444" : "#ccc",
          }}
        />

        <SaleProducts isDarkMode={isDarkMode} />
      </Content>
      <Footer />
      <BottomAds />
      <LeftAdsBanner />
      <RightAdsBanner />
    </Layout>
  );
};

export default Home;
