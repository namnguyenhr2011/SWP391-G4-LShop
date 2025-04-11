import {
  Layout,
  Typography,
  Row,
  Col,
  Space,
  Button,
  Pagination,
  Input,
  Select,
  message,
} from "antd";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import ProductCard from "../../../Component/ProductCard";
import {
  getAllProduct,
  getAllProductBySubCategory,
  getAllCategory,
} from "../../../Service/Client/ApiProduct";
import { SearchOutlined } from "@ant-design/icons";
import BottomAds from "../../../Component/BottomAds"
import LeftAdsBanner from "../../../Component/LeftAds";
import RightAdsBanner from "../../../Component/RightAds";
import CompareProduct from "../../../Component/CompareProduct";
import { toast } from "react-toastify";

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
  const { subcategoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const handleCompare = (productId) => {
    if (selectedProducts.length < 2) {
      setSelectedProducts((prev) => [...prev, productId]);
    }
  };
  const handleCompareRedirect = () => {
    if (selectedProducts.length === 2) {
      navigate(`/compare?product1=${selectedProducts[0]}&product2=${selectedProducts[1]}`);
    } else {
      toast.error("Chọn đủ 2 sản phẩm để so sánh");
    }
  };
  const createSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        if (response && Array.isArray(response.categories)) {
          setCategories(response.categories);

          // Xử lý subcategory từ URL hoặc state
          const subcategoryIdFromState = location.state?.subcategoryId;
          if (subcategoryName || subcategoryIdFromState) {
            let matchedSubcategory = null;
            let matchedCategory = null;

            for (const cat of response.categories) {
              matchedSubcategory = cat.subCategories.find(
                (sub) =>
                  createSlug(sub.name || "unnamed-subcategory") ===
                  subcategoryName ||
                  (sub._id || sub.id) === subcategoryIdFromState
              );
              if (matchedSubcategory) {
                matchedCategory = cat;
                break;
              }
            }

            if (matchedSubcategory && matchedCategory) {
              setSelectedCategory(matchedCategory._id);
              setSubcategories(matchedCategory.subCategories);
              setSelectedSubcategory(
                matchedSubcategory._id || matchedSubcategory.id
              );
            } else {
              console.warn("Subcategory not found for:", {
                subcategoryName,
                subcategoryIdFromState,
              });
              message.error("Subcategory not found.");
            }
          }
        } else {
          console.error("Invalid categories data:", response);
          setCategories([]);
          message.error("Failed to load categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        message.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, [subcategoryName, location.state]);

  // Load products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        if (filterMode === "all") {
          data = await getAllProduct(currentPage);
        } else if (
          selectedSubcategory &&
          /^[0-9a-fA-F]{24}$/.test(selectedSubcategory)
        ) {
          data = await getAllProductBySubCategory(
            selectedSubcategory,
            currentPage
          );
        } else {
          data = await getAllProduct(currentPage);
        }
        setAllProducts(data?.products || []);
        setProducts(data?.products || []);
        setTotalProducts(
          data?.totalPage * pageSize || data?.products?.length || 0
        );
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setAllProducts([]);
        setTotalProducts(0);
        message.error("Failed to load products.");
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
    setSubcategories(selectedCat?.subCategories || []);
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (value) => {
    setSelectedSubcategory(value);
    setFilterMode(null);
    setCurrentPage(1);
    // Cập nhật URL với tên subcategory
    const selectedSub = subcategories.find(
      (sub) => (sub._id || sub.id) === value
    );
    if (selectedSub) {
      const slug = createSlug(selectedSub.name || "unnamed-subcategory");
      navigate(`/product-list/${slug}`, {
        state: { subcategoryId: value },
        replace: true,
      });
    }
  };

  const handleShowAllProducts = () => {
    setFilterMode("all");
    setSelectedSubcategory(null);
    setCurrentPage(1);
    navigate("/all-products", { replace: true });
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
      const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + pageSize
      );
      setProducts(paginatedProducts);
      setTotalProducts(filteredProducts.length);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
      setTotalProducts(0);
      message.error("Failed to search products.");
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
    navigate(`/product/${productId}`);
  };

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
      <Content
        style={{
          padding: "80px 20px 40px",
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
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
              <Select
                placeholder="Select a category"
                onChange={handleCategoryChange}
                value={selectedCategory}
                style={{ width: 200, height: 38 }}
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
              <Select
                placeholder="Select a subcategory"
                onChange={handleSubcategoryChange}
                value={selectedSubcategory}
                style={{ width: 200, height: 38 }}
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
                    return (
                      <Option key={subId} value={subId}>
                        {sub.name || "Unnamed Subcategory"}
                      </Option>
                    );
                  })}
              </Select>
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
                  border:
                    filterMode === "all"
                      ? "none"
                      : isDarkMode
                        ? "1px solid rgba(255,255,255,0.2)"
                        : "1px solid rgba(0,0,0,0.1)",
                  background:
                    filterMode === "all"
                      ? isDarkMode
                        ? "linear-gradient(90deg,rgb(231, 39, 145) 0%,rgb(194, 31, 216) 100%)"
                        : "linear-gradient(90deg,rgb(236, 62, 213) 0%, #3b82f6 100%)"
                      : isDarkMode
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                  color:
                    filterMode === "all"
                      ? "#ffffff"
                      : isDarkMode
                        ? "#e6edf3"
                        : "#2d3748",
                  transition: "all 0.3s ease",
                }}
              >
                Show All Products
              </Button>
              <Space
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: isDarkMode
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,1)",
                  borderRadius: "40px",
                  border: isDarkMode
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid rgba(0,0,0,0.1)",
                  boxShadow: isDarkMode
                    ? "0 4px 15px rgba(0,0,0,0.3)"
                    : "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  onPressEnter={handleSearch}
                  prefix={<SearchOutlined />}
                  style={{
                    flex: 1,
                    height: 38,
                    borderRadius: "40px",
                    border: "none",
                    background: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.02)",
                    padding: "0 15px",
                    fontSize: 14,
                    color: isDarkMode ? "#e6edf3" : "#2d3748",
                  }}
                  allowClear
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
                    boxShadow: "none",
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
              onProductClick={handleProductClick}
            />
            {!loading && products.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  background: isDarkMode ? "rgba(255,255,255,0.05)" : "#f9f9f9",
                  borderRadius: 12,
                }}
              >
                <Title
                  level={4}
                  style={{
                    color: isDarkMode ? "#b0b8c1" : "#7f8c8d",
                    fontWeight: 500,
                  }}
                >
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
              }}
            />
          </Row>
        )}
        <div>
          <CompareProduct
            products={products}
            loading={loading}
            isDarkMode={isDarkMode}
            onCompare={handleCompare}
          />
          {selectedProducts.length === 2 && (
            <Button type="primary" onClick={handleCompareRedirect}>
              So sánh các sản phẩm đã chọn
            </Button>
          )}
        </div>

      </Content>
      <Footer />
      <BottomAds />
      <LeftAdsBanner />
      <RightAdsBanner />
    </Layout>
  );
};

export default ProductList;
