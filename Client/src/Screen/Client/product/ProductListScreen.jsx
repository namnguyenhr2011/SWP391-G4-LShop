import { Layout, Typography, Row, Col, Select, Space } from "antd";
import { useSelector } from "react-redux";
import { useState } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import ProductCard from "../../../Component/ProductCard";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

// Dữ liệu mẫu
const sampleProducts = [
  {
    _id: "1",
    name: "Laptop Gaming ASUS ROG",
    price: 25000000,
    category: "Laptop",
    image:
      "https://file.hstatic.net/200000722513/file/thang_01_laptop_gaming_banner_web_slider_800x400.png",
  },
  {
    _id: "2",
    name: "Tai nghe Sony WH-1000XM4",
    price: 7500000,
    category: "Accessories",
    image:
      "https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_1199a3adfc23489798d4163a97f3bc62.jpg",
  },
  {
    _id: "3",
    name: "Điện thoại iPhone 14 Pro",
    price: 30000000,
    category: "Phone",
    image:
      "https://file.hstatic.net/200000722513/file/thang_01_laptop_gaming_banner_web_slider_800x400.png",
  },
  {
    _id: "4",
    name: "Màn hình Dell UltraSharp",
    price: 12000000,
    category: "Monitor",
    image:
      "https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_1199a3adfc23489798d4163a97f3bc62.jpg",
  },
];

const ProductList = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [products, setProducts] = useState(sampleProducts);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Hàm lọc sản phẩm theo danh mục
  const filterProducts = (value) => {
    if (value === "All") {
      setProducts(sampleProducts);
    } else {
      const filtered = sampleProducts.filter(
        (product) => product.category === value
      );
      setProducts(filtered);
    }
  };

  // Xử lý khi thay đổi danh mục
  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    filterProducts(value);
  };

  // Hàm xử lý click vào sản phẩm
  const handleProductClick = (productId) => {
    console.log(`Clicked product with ID: ${productId}`);
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
      <Header />
      <Content
        style={{
          padding: "100px 20px 60px 20px", // Tăng padding-top để đẩy nội dung xuống
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Filter bên trái */}
          <Col xs={24} sm={6}>
            <div
              style={{
                backgroundColor: isDarkMode ? "rgba(33, 37, 43, 0.9)" : "#fff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: isDarkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 2px 8px rgba(0, 0, 0, 0.05)",
                height: "fit-content",
                position: "sticky",
                top: "100px", // Đẩy filter xuống cùng với nội dung
              }}
            >
              <Title
                level={4}
                style={{
                  color: isDarkMode ? "#e6edf3" : "#1c1e21",
                  marginBottom: "20px",
                  fontWeight: "600",
                }}
              >
                Lọc sản phẩm
              </Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Select
                  defaultValue="All"
                  style={{ width: "100%" }}
                  onChange={handleCategoryChange}
                >
                  <Option value="All">Tất cả danh mục</Option>
                  <Option value="Laptop">Laptop</Option>
                  <Option value="Phone">Điện thoại</Option>
                  <Option value="Accessories">Phụ kiện</Option>
                  <Option value="Monitor">Màn hình</Option>
                </Select>
              </Space>
            </div>
          </Col>

          {/* Danh sách sản phẩm bên phải */}
          <Col xs={24} sm={18}>
            <Title
              level={2}
              style={{
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                marginBottom: "30px",
                fontWeight: "700",
              }}
            >
              Tất cả sản phẩm
            </Title>
            <ProductCard
              products={products}
              loading={false}
              isDarkMode={isDarkMode}
              onProductClick={handleProductClick}
            />
            {products.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Title
                  level={4}
                  style={{ color: isDarkMode ? "#b0b8c1" : "#666" }}
                >
                  Không tìm thấy sản phẩm nào
                </Title>
              </div>
            )}
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};

export default ProductList;
