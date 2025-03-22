import { Layout, Typography, Row, Col, Space, Button, Pagination, Input, Select, message } from "antd";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import ProductCard from "../../../Component/ProductCard";
import { getAllProduct, getAllProductBySubCategory, getAllCategory } from "../../../Service/Client/ApiProduct";
import { SearchOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const ProductList = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode) || false;
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); 
  const [subcategories, setSubcategories] = useState([]); 
  const [filterMode, setFilterMode] = useState(null);
  const { subcategoryId } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        console.log("Categories Data:", JSON.stringify(response, null, 2));
        if (response && Array.isArray(response.categories)) {
          setCategories(response.categories);
        } else {
          console.error("Invalid categories data:", response);
          setCategories([]);
          message.error("Failed to load categories. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        message.error("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        if (filterMode === "all") {
          data = await getAllProduct(currentPage);
        } else if (selectedSubcategory && /^[0-9a-fA-F]{24}$/.test(selectedSubcategory)) {
          data = await getAllProductBySubCategory(selectedSubcategory, currentPage);
        } else {
          data = await getAllProduct(currentPage);
        }
        setAllProducts(data?.products || []);
        setProducts(data?.products || []);
        setTotalProducts(data?.totalPage * pageSize || data?.products?.length || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setAllProducts([]);
        setTotalProducts(0);
        message.error("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubcategory, currentPage, filterMode]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedSubcategory(null); 
    setFilterMode(null); 
    const selectedCat = categories.find((cat) => cat._id === value);
    if (selectedCat && Array.isArray(selectedCat.subCategories)) {
      setSubcategories(selectedCat.subCategories);
    } else {
      setSubcategories([]);
    }
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (value) => {
    setSelectedSubcategory(value);
    setFilterMode(null);
    setCurrentPage(1);
  };

  const handleShowAllProducts = () => {
    setFilterMode("all");
    setSelectedSubcategory(null);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setLoading(true);
    try {
      let filteredProducts = [...allProducts];

      if (searchQuery) {
        filteredProducts = filteredProducts.filter((p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      const startIndex = (currentPage - 1) * pageSize;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

      setProducts(paginatedProducts);
      setTotalProducts(filteredProducts.length);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
      setTotalProducts(0);
      message.error("Failed to search products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleSearch();
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleProductClick = (productId) => {
    // Handle product click if needed
  };

  return (
    <>
      <style>
        {`
          /* Tùy chỉnh Select chính */
          .custom-select .ant-select-selector {
            background: ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#ffffff"} !important;
            border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"} !important;
            border-radius: 40px !important;
            padding: 0 15px !important;
            height: 38px !important;
            color: ${isDarkMode ? "#e6edf3" : "#2d3748"} !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.3s ease !important;
          }

          .custom-select .ant-select-selector:hover {
            border-color: ${isDarkMode ? "#60a5fa" : "#2563eb"} !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .custom-select .ant-select-selector:focus-within {
            border-color: ${isDarkMode ? "#60a5fa" : "#2563eb"} !important;
            box-shadow: 0 0 0 3px ${isDarkMode ? "rgba(96, 165, 250, 0.2)" : "rgba(37, 99, 235, 0.2)"} !important;
          }

          /* Tùy chỉnh dropdown menu */
          .custom-select-dropdown .ant-select-item-option {
            color: ${isDarkMode ? "#e6edf3" : "#2d3748"} !important;
            transition: background 0.3s ease !important;
          }

          .custom-select-dropdown .ant-select-item-option:hover {
            background: ${isDarkMode ? "#3b82f6" : "#e6f0fa"} !important;
          }

          .custom-select-dropdown .ant-select-item-option-selected {
            background: ${isDarkMode ? "#60a5fa" : "#2563eb"} !important;
            color: #ffffff !important;
          }
        `}
      </style>
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

          <Row justify="center" style={{ marginBottom: 50 }}>
            <Col xs={24} sm={20} md={16} lg={12}>
              <Space
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {/* Dropdown chọn danh mục */}
                <Select
                  placeholder="Select a category"
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                  style={{
                    width: 200,
                    height: 38,
                  }}
                  allowClear
                  dropdownStyle={{
                    backgroundColor: isDarkMode ? "#2d3748" : "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  className="custom-select"
                  popupClassName="custom-select-dropdown"
                  bordered={false}
                >
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <Option key={category._id} value={category._id}>
                        {category.name}
                      </Option>
                    ))}
                </Select>

                {/* Dropdown chọn subcategory */}
                <Select
                  placeholder="Select a subcategory"
                  onChange={handleSubcategoryChange}
                  value={selectedSubcategory}
                  style={{
                    width: 200,
                    height: 38,
                  }}
                  allowClear
                  disabled={!selectedCategory || subcategories.length === 0}
                  dropdownStyle={{
                    backgroundColor: isDarkMode ? "#2d3748" : "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  className="custom-select"
                  popupClassName="custom-select-dropdown"
                  bordered={false}
                >
                  {Array.isArray(subcategories) &&
                    subcategories.map((sub, index) => {
                      const subId = sub._id || sub.id || `tmp-${index}`;
                      if (!sub._id && !sub.id) {
                        console.warn(`Subcategory "${sub.name}" is missing _id in category`);
                      }
                      return (
                        <Option key={subId} value={subId}>
                          {sub.name || "Unnamed Subcategory"}
                        </Option>
                      );
                    })}
                </Select>

                {/* Nút Show All Products như một bộ lọc */}
                <Button
                  type={filterMode === "all" ? "primary" : "default"}
                  onClick={handleShowAllProducts}
                  disabled={loading}
                  style={{
                    height: 38,
                    borderRadius: "40px",
                    padding: "0 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    border: filterMode === "all" ? "none" : isDarkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.1)",
                    background: filterMode === "all" ? (isDarkMode ? "linear-gradient(90deg,rgb(231, 39, 145) 0%,rgb(194, 31, 216) 100%)" : "linear-gradient(90deg,rgb(236, 62, 213) 0%, #3b82f6 100%)") : isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                    color: filterMode === "all" ? "#ffffff" : isDarkMode ? "#e6edf3" : "#2d3748",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Show All Products
                </Button>

                {/* Thanh tìm kiếm */}
                <Space
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,1)",
                    borderRadius: "40px",
                    border: isDarkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.1)",
                    boxShadow: isDarkMode
                      ? "0 4px 15px rgba(0,0,0,0.3)"
                      : "0 4px 15px rgba(0,0,0,0.05)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    onPressEnter={handleSearch}
                    prefix={<SearchOutlined style={{ color: isDarkMode ? "#b0b8c1" : "#7f8c8d", fontSize: 16 }} />}
                    style={{
                      flex: 1,
                      height: 38,
                      borderRadius: "40px",
                      border: "none",
                      background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.02)",
                      padding: "0 15px",
                      fontSize: 14,
                      color: isDarkMode ? "#e6edf3" : "#2d3748",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                    }}
                    allowClear
                    className="custom-search-input"
                  />
                  <Button
                    type="primary"
                    onClick={handleSearch}
                    disabled={loading}
                    style={{
                      height: 38,
                      borderRadius: "40px",
                      padding: "0 20px",
                      background: isDarkMode
                        ? "linear-gradient(90deg,rgb(11, 240, 11) 0%,rgb(85, 223, 43) 100%)"
                        : "linear-gradient(90deg,rgb(23, 213, 219) 0%,rgb(25, 190, 177) 100%)",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 500,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      marginLeft: 8,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                  >
                    {loading ? "Loading..." : "Search"}
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>

          <Row gutter={[24, 24]} justify="center">
            <Col span={24}>
              <ProductCard
                products={products || []}
                loading={loading}
                isDarkMode={isDarkMode}
                onProductClick={handleProductClick}
              />
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
    </>
  );
};

export default ProductList;