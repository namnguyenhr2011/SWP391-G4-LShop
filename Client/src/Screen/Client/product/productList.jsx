import { Layout, Typography, Row, Col, Select, Space, Button, Pagination } from "antd";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import ProductCard from "../../../Component/ProductCard";
import { getAllProduct, getAllProductBySubCategory } from "../../../Service/Client/ApiProduct";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const ProductList = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subcategoryFilter, setSubcategoryFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const { subcategoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        if (subcategoryId) {
          if (!subcategoryId.match(/^[0-9a-fA-F]{24}$/)) {
            data = await getAllProduct(currentPage);
            setAllProducts(data.products || []);
            setProducts(data.products || []);
            setTotalProducts(data.totalPage * pageSize || data.products?.length || 0);
          } else {
            data = await getAllProductBySubCategory(subcategoryId, currentPage);
            setProducts(data.products || []);
            setTotalProducts(data.pagination?.totalProducts || data.products?.length || 0);
          }
        } else {
          data = await getAllProduct(currentPage);
          setAllProducts(data.products || []);
          setProducts(data.products || []);
          setTotalProducts(data.totalPage * pageSize || data.products?.length || 0);
        }
      } catch (error) {
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategoryId, currentPage]);

  const uniqueCategories = ["All", ...new Set(allProducts.map((p) => p.category?.name || p.category))];
  const uniqueSubcategories = ["All", ...new Set(
    allProducts
      .filter((p) => categoryFilter === "All" || (p.category?.name || p.category) === categoryFilter)
      .map((p) => p.subCategory?.name || p.subcategory)
      .filter(Boolean)
  )];

  const handleFilterChange = async () => {
    setLoading(true);
    try {
      let data;
      if (subcategoryFilter !== "All") {
        const subcategory = allProducts.find(
          (p) => (p.subCategory?.name || p.subcategory) === subcategoryFilter
        );
        if (subcategory && subcategory.subCategory?._id) {
          data = await getAllProductBySubCategory(subcategory.subCategory._id, currentPage);
          setProducts(data.products || []);
          setTotalProducts(data.pagination?.totalProducts || data.products?.length || 0);
        } else {
          setProducts([]);
          setTotalProducts(0);
        }
      } else if (categoryFilter !== "All") {
        const filteredProducts = allProducts.filter(
          (p) => (p.category?.name || p.category) === categoryFilter
        );
        setProducts(filteredProducts);
        setTotalProducts(filteredProducts.length);
      } else {
        data = await getAllProduct(currentPage);
        setProducts(data.products || []);
        setTotalProducts(data.totalPage * pageSize || data.products?.length || 0);
      }
    } catch (error) {
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (!subcategoryId) handleFilterChange();
  };

  const handleProductClick = (productId) => {};

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: isDarkMode
          ? "linear-gradient(135deg, #1e2a3c 0%, #21252b 100%)"
          : "linear-gradient(135deg, #f4f6f9 0%, #e9ecef 100%)",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "all 0.3s ease",
      }}
    >
      <Header />
      <Content style={{ padding: "80px 20px 40px", maxWidth: "1300px", margin: "0 auto" }}>
        <Title
          level={2}
          style={{
            color: isDarkMode ? "#ffffff" : "#2c3e50",
            marginBottom: "40px",
            fontWeight: 800,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "1px",
            textShadow: isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "none",
          }}
        >
          Product List
        </Title>

        {!subcategoryId && (
          <Row justify="center" style={{ marginBottom: 50 }}>
            <Col xs={22} md={20} lg={16}>
              <Space
                wrap
                style={{
                  width: "100%",
                  padding: 20,
                  background: isDarkMode ? "rgba(255,255,255,0.05)" : "#ffffff",
                  borderRadius: 12,
                  border: isDarkMode ? "1px solid #3a3f44" : "1px solid #e9ecef",
                  boxShadow: isDarkMode ? "0 4px 15px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <Select
                  value={categoryFilter}
                  style={{ width: 220, borderRadius: 8 }}
                  onChange={(value) => {
                    setCategoryFilter(value);
                    setSubcategoryFilter("All");
                  }}
                  showSearch
                  optionFilterProp="children"
                  dropdownStyle={{ background: isDarkMode ? "#2d3748" : "#ffffff", color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
                >
                  {uniqueCategories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
                <Select
                  value={subcategoryFilter}
                  style={{ width: 220, borderRadius: 8 }}
                  onChange={setSubcategoryFilter}
                  showSearch
                  optionFilterProp="children"
                  disabled={categoryFilter === "All"}
                  dropdownStyle={{ background: isDarkMode ? "#2d3748" : "#ffffff", color: isDarkMode ? "#e6edf3" : "#1c1e21" }}
                >
                  {uniqueSubcategories.map((subcategory) => (
                    <Option key={subcategory} value={subcategory}>
                      {subcategory}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  onClick={handleFilterChange}
                  disabled={loading}
                  style={{
                    borderRadius: 8,
                    padding: "6px 20px",
                    background: isDarkMode
                      ? "linear-gradient(90deg, #4a90e2 0%, #63b3ed 100%)"
                      : "linear-gradient(90deg, #3498db 0%, #2980b9 100%)",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {loading ? "Loading..." : "Apply"}
                </Button>
              </Space>
            </Col>
          </Row>
        )}

        <Row gutter={[24, 24]} justify="center">
          <Col span={24}>
            <ProductCard products={products} loading={loading} isDarkMode={isDarkMode} onProductClick={handleProductClick} />
            {!loading && products.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  background: isDarkMode ? "rgba(255,255,255,0.05)" : "#f9f9f9",
                  borderRadius: 12,
                  boxShadow: isDarkMode ? "0 4px 15px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <Title level={4} style={{ color: isDarkMode ? "#b0b8c1" : "#7f8c8d", fontWeight: 500 }}>
                  No products found
                </Title>
              </div>
            )}
          </Col>
        </Row>

        {totalProducts > 0 && (
          <Row justify="center" style={{ marginTop: 50 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProducts}
              onChange={handlePageChange}
              showSizeChanger={false}
              style={{
                padding: "10px 20px",
                background: isDarkMode ? "rgba(255,255,255,0.05)" : "#ffffff",
                borderRadius: 8,
                boxShadow: isDarkMode ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
          </Row>
        )}
      </Content>
      <Footer />
    </Layout>
  );
};

export default ProductList;