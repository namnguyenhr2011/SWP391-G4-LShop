import { Layout, Typography, Button, Card, Row, Col, Carousel } from "antd";
import { useSelector } from "react-redux";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ProductCard from "../Component/ProductCard";
import SidebarMenuAntd from "../Component/SidebarMenuAntd";

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const contentStyle = {
  height: "500px", // Chiều cao cố định cho carousel
  width: "100%",
  objectFit: "cover",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
  borderRadius: "10px",
  transition: "transform 0.3s ease",
};

const carouselImageStyle = {
  ...contentStyle,
  transform: "scale(1)",
  "&:hover": {
    transform: "scale(1.05)",
  },
};

const Home = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);

  const onClick = (e) => {
    console.log("Menu Clicked:", e);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#0d1117" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Header />

      <Content
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <Row gutter={[16, 16]} style={{ paddingTop: "10px" }}>
          <Col xs={24} sm={4}>
            <SidebarMenuAntd onClick={onClick} />
          </Col>
          <Col xs={24} sm={20}>
            <Carousel
              autoplay
              autoplaySpeed={4000}
              effect="fade"
              dots={{ className: "custom-dots" }}
              style={{ height: "500px" }} // Đảm bảo Carousel có chiều cao cố định
            >
              <div>
                <img
                  src="https://file.hstatic.net/200000722513/file/thang_01_laptop_gaming_banner_web_slider_800x400.png"
                  alt="Gaming Laptop"
                  style={carouselImageStyle}
                />
              </div>
              <div>
                <img
                  src="https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_1199a3adfc23489798d4163a97f3bc62.jpg"
                  alt="Promotion Banner"
                  style={carouselImageStyle}
                />
              </div>
              <div>
                <img
                  src="https://file.hstatic.net/200000722513/file/thang_01_laptop_acer_800x400.png"
                  alt="Acer Laptop"
                  style={carouselImageStyle}
                />
              </div>
              <div>
                <img
                  src="https://file.hstatic.net/200000722513/file/thang_12_thu_cu_ve_sinh_banner_web_slider_800x400.png"
                  alt="Trade-in Banner"
                  style={carouselImageStyle}
                />
              </div>
            </Carousel>
          </Col>
        </Row>

        <Title
          level={2}
          style={{
            textAlign: "center",
            color: isDarkMode ? "#e6edf3" : "#1c1e21",
            margin: "50px 0 30px",
            fontWeight: "600",
          }}
        >
          Welcome to Our Platform
        </Title>
        <Paragraph
          style={{
            textAlign: "center",
            color: isDarkMode ? "#a0a8b3" : "#5c5e62",
            maxWidth: "700px",
            margin: "0 auto 40px",
          }}
        >
          Discover the best deals and innovative products tailored just for you.
        </Paragraph>

        <Row justify="center">
          <Col span={24}>
            <ProductCard />
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: "40px" }}>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: isDarkMode ? "#096dd9" : "#1890ff",
              borderColor: isDarkMode ? "#096dd9" : "#1890ff",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = isDarkMode
                ? "#40c4ff"
                : "#40a9ff")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = isDarkMode
                ? "#096dd9"
                : "#1890ff")
            }
          >
            Explore More
          </Button>
        </Row>
      </Content>

      <Footer />
    </Layout>
  );
};

export default Home;
