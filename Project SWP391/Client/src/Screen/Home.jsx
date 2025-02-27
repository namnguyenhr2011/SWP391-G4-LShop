import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col, Carousel } from "antd";
import { useSelector } from "react-redux";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ProductCard from "../Component/ProductCart";
import SidebarMenuAntd from "../Component/SidebarMenuAntd";
import { getTop8 } from "../Service/Client/ApiProduct";
import { getTopSold } from "../Service/Client/ApiProduct";

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
    const [products, setProducts] = useState([]);
    const [topSaleProducts, setTopSaleProduct] = useState([])
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
                        <Carousel autoplay autoplaySpeed={5000}>
                            <div>
                                <img
                                    src="https://file.hstatic.net/200000722513/file/thang_01_laptop_gaming_banner_web_slider_800x400.png"
                                    style={{ width: "100%", borderRadius: "10px" }}
                                />
                            </div>
                            <div>
                                <img
                                    src="https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_1199a3adfc23489798d4163a97f3bc62.jpg"
                                    style={{ width: "100%", borderRadius: "10px" }}
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

                <ProductCard products={products} loading={loading} />
                <Title
                    level={4}
                    style={{
                        color: isDarkMode ? "#e6edf3" : "#1c1e21",
                    }}
                >
                    Top sale
                </Title>
                <ProductCard products={topSaleProducts} loading={loading} />

            </Content>
            <Footer />
        </Layout>
    );
};

export default Home;
