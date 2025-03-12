<<<<<<< HEAD
=======
import { useEffect, useState } from "react";
>>>>>>> duc
import { Layout, Typography, Row, Col, Carousel, Divider } from "antd";
import { useSelector } from "react-redux";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
<<<<<<< HEAD
import SidebarMenuAntd from "../Component/SidebarMenu";
import FeaturedProducts from "../Component/FearturedProducts";
import SaleProducts from "../Component/SaleProducts";
import TopSoldProducts from "../Component/TopSoldProducts";
=======
import ProductCard from "../Component/ProductCart";
import SidebarMenuAntd from "../Component/SidebarMenuAntd";
import { getTop8 } from "../Service/Client/ApiProduct";
import { getTopSold } from "../Service/Client/ApiProduct";
import { getAllProductsWithSale } from "../Service/Client/ApiProduct";
import SaleProductCard from "../Component/SaleProductCard";
import { FireOutlined, StarOutlined, ThunderboltOutlined } from "@ant-design/icons";
>>>>>>> duc

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
<<<<<<< HEAD
  const isDarkMode = useSelector((state) => state.user.darkMode);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#21252b" : "#f4f6f9", // Thay #0d1117 bằng #21252b
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "all 0.3s ease",
      }}
    >
      <Header />
      <Content
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "auto",
          backgroundColor: isDarkMode ? "rgba(33, 37, 43, 0.9)" : "#fff", // Nền mờ nhẹ trong dark mode
          borderRadius: isDarkMode ? "10px" : "0", // Bo góc trong dark mode
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
                position: "relative", // Thêm để overlay hoạt động
              }}
            >
              <div
                style={{
                  position: "relative",
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.3)"
                    : "transparent", // Overlay mờ trong dark mode
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
      <Footer />
    </Layout>
  );
=======
    const [products, setProducts] = useState([]);
    const [topSaleProducts, setTopSaleProduct] = useState([])
    const [saleProducts, setSaleProducts] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getTop8();
                setProducts(response.products);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getTopSold();
                setTopSaleProduct(response.products);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProductsWithSale();
                const saleProducts = response.products.filter(product =>
                    product.sale &&
                    typeof product.sale === 'object' &&
                    product.sale.isSale === true &&
                    product.sale.startDate &&
                    product.sale.endDate
                );
                setSaleProducts(saleProducts);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const isDarkMode = useSelector((state) => state.user.darkMode);

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
            <Content style={{ padding: "60px 20px", maxWidth: "1200px", margin: "auto" }}>
                <Row gutter={0} style={{ paddingTop: "10px" }}>
                    <Col xs={24} sm={4}>
                        <SidebarMenuAntd />
                    </Col>
                    <Col xs={24} sm={20} style={{ paddingLeft: "5px" }}>
                        <Carousel 
                            autoplay 
                            autoplaySpeed={5000}
                            effect="fade"
                            style={{ borderRadius: "10px", overflow: "hidden" }}
                        >
                            <div>
                                <img
                                    src="https://file.hstatic.net/200000722513/file/thang_01_laptop_gaming_banner_web_slider_800x400.png"
                                    style={{ width: "100%", height: "400px", objectFit: "cover" }}
                                />
                            </div>
                            <div>
                                <img
                                    src="https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_1199a3adfc23489798d4163a97f3bc62.jpg"
                                    style={{ width: "100%", height: "400px", objectFit: "cover" }}
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
                    <Text style={{ fontSize: "16px", color: isDarkMode ? "#8b949e" : "#666" }}>
                        Khám phá những sản phẩm chất lượng với giá tốt nhất
                    </Text>
                </div>

                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <ThunderboltOutlined style={{ fontSize: "24px", color: "#ff4d4f", marginRight: "10px" }} />
                        <Title level={4} style={{ margin: 0, color: isDarkMode ? "#e6edf3" : "#1c1e21" }}>
                            Sản phẩm nổi bật
                        </Title>
                    </div>
                    <ProductCard products={products} loading={loading} />
                </div>

                <Divider style={{ margin: "40px 0" }} />

                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <StarOutlined style={{ fontSize: "24px", color: "#ff4d4f", marginRight: "10px" }} />
                        <Title level={4} style={{ margin: 0, color: isDarkMode ? "#e6edf3" : "#1c1e21" }}>
                            Top bán chạy
                        </Title>
                    </div>
                    <ProductCard products={topSaleProducts} loading={loading} />
                </div>

                <Divider style={{ margin: "40px 0" }} />

                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <FireOutlined style={{ fontSize: "24px", color: "#ff4d4f", marginRight: "10px" }} />
                        <Title level={4} style={{ margin: 0, color: isDarkMode ? "#e6edf3" : "#1c1e21" }}>
                            Đang giảm giá
                        </Title>
                    </div>
                    <SaleProductCard products={saleProducts} loading={loading} />
                </div>
            </Content>
            <Footer />
        </Layout>
    );
>>>>>>> duc
};

export default Home;
