import { Layout, Typography, Button, Card, Row, Col, Carousel } from "antd";
import { useSelector } from "react-redux";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ProductCard from "../Component/ProductCard";
import SidebarMenuAntd from "../Component/SidebarMenuAntd";

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const contentStyle = {
  height: "100%",
  width: "100%",
  objectFit: "cover",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
  borderRadius: "10px",
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
        style={{ padding: "60px 20px", maxWidth: "1200px", margin: "auto" }}
      >
        <Row gutter={0} style={{ paddingTop: "10px" }}>
          <Col xs={24} sm={4}>
            <SidebarMenuAntd onClick={onClick} />
          </Col>
          <Col xs={24} sm={20} style={{ paddingLeft: "5px" }}>
            <Carousel
              autoplay={{
                dotDuration: true,
              }}
              autoplaySpeed={5000}
            >
              <div>
                <img
                  src="https://file.hstatic.net/200000722513/file/thang_01_laptop_gaming_banner_web_slider_800x400.png"
                  style={contentStyle}
                />
              </div>
              <div>
                <img
                  src="https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_1199a3adfc23489798d4163a97f3bc62.jpg"
                  style={contentStyle}
                />
              </div>
              <div>
                <img
                  src="https://file.hstatic.net/200000722513/file/thang_01_laptop_acer_800x400.png"
                  style={contentStyle}
                />
              </div>
              <div>
                <img
                  src="https://file.hstatic.net/200000722513/file/thang_12_thu_cu_ve_sinh_banner_web_slider_800x400.png"
                  alt="Content 4"
                  style={contentStyle}
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
            margin: "40px",
          }}
        >
          Welcome to Our Platform
        </Title>
        <ProductCard />
      </Content>
      <Footer />
    </Layout>
  );
};

export default Home;
