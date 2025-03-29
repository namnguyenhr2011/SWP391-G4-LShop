import { Layout, Typography, Pagination, Empty } from "antd";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Header from "../../layout/Header";
import AppFooter from "../../layout/Footer";
import ProductCard from "../../../Component/ProductCard";
import { searchProducts } from "../../../service/client/ApiProduct";
import { useNavigate } from "react-router-dom";
import BottomAds from "../../../Component/BottomAds"
import LeftAdsBanner from "../../../Component/LeftAds";
import RightAdsBanner from "../../../Component/RightAds";
const { Title } = Typography;

const SearchProduct = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode) || false;
  const queryParams = new URLSearchParams(window.location.search);
  const name = queryParams.get("query"); // Sử dụng `name` cho từ khóa tìm kiếm

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await searchProducts(name, currentPage); // Sử dụng `name` thay vì `searchTerm`
        setProducts(response.products || []);
        setTotalProducts(response.totalProducts || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchProducts();
    }
  }, [name, currentPage]); // Chạy lại khi `name` hoặc `currentPage` thay đổi

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh", // Đảm bảo chiều cao của Layout chiếm toàn bộ màn hình
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Layout.Content
        style={{
          padding: "20px",
          marginTop: "60px",
          height: "60vh",
          backgroundColor: isDarkMode ? "#161b22" : "#f0f2f5",
          flex: 1, // Đảm bảo content chiếm phần còn lại của không gian
        }}
      >
        <Title
          level={2}
          style={{
            color: isDarkMode ? "#fff" : "#000", // Điều chỉnh màu sắc theo chế độ tối/sáng
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Chọn font chữ đẹp
            fontWeight: "bold", // Làm chữ đậm
            fontSize: "36px", // Tăng kích thước chữ
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)", // Thêm bóng đổ cho chữ
            textAlign: "center", // Căn giữa tiêu đề
            marginBottom: "20px", // Thêm khoảng cách dưới tiêu đề
          }}
        >
          Kết quả tìm kiếm cho `{name}`
        </Title>

        {/* Hiển thị thông báo nếu không có kết quả tìm kiếm */}
        {products.length === 0 && !loading ? (
          <Empty
            description={`Không tìm thấy sản phẩm cho từ khóa "${name}"`}
          />
        ) : (
          <ProductCard
            products={products || []}
            loading={loading}
            onProductClick={handleProductClick}
          />
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalProducts}
            onChange={handlePageChange}
            style={{
              marginTop: "20px",
              textAlign: "center",
              justifyContent: "center",
            }}
          />
        )}
      </Layout.Content>
      <AppFooter /> 
      <BottomAds />
      <LeftAdsBanner />
      <RightAdsBanner />
    </Layout>
  );
};

export default SearchProduct;
