import { Layout, Typography, Row, Col, Carousel, Divider, Button } from "antd"; // Thêm Button vào import
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import SidebarMenuAntd from "../Component/SidebarMenu";
import FeaturedProducts from "../Component/FearturedProducts";
import SaleProducts from "../Component/SaleProducts";
import TopSoldProducts from "../Component/TopSoldProducts";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const navigate = useNavigate();

 
  const handleViewMore = () => {
    navigate("/all-products");
  };

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
        <Row gutter={0} style={{ paddingTop: "10px" }}>
          <Col xs={24} sm={4}>
            <SidebarMenuAntd />
          </Col>
          <Col xs={24} sm={20} style={{ paddingLeft: "5px" }}>
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
            Chào mừng đến với cửa hàng của chúng tôi
          </Title>
          <Text
            style={{ fontSize: "16px", color: isDarkMode ? "#b0b8c1" : "#666" }}
          >
            Khám phá những sản phẩm chất lượng với giá tốt nhất
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
      <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Button
            type="primary"
            size="large"
            onClick={handleViewMore}
            style={{
              borderRadius: "8px",
              padding: "6px 24px",
              background: isDarkMode
                ? "linear-gradient(90deg, #4a90e2 0%, #63b3ed 100%)"
                : "linear-gradient(90deg, #3498db 0%, #2980b9 100%)",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            View More Products
          </Button>
        </div>
      <Footer />
    </Layout>
  );
};

export default Home;
