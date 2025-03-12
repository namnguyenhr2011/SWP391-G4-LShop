import React, { useState, useEffect } from "react";
import { Select, Layout, message, Table, Input } from "antd";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";
import { getAllCategory, getAllProductBySubCategory, getAllProduct } from "../../Service/Client/ApiProduct";

const { Content } = Layout;
const { Option } = Select;

const ProductView = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        setCategories(response.categories);
      } catch (error) {
        message.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);


  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!selectedCategory) {
        try {
          const response = await getAllProduct();
          if (response && response.products) {
            setProducts(response.products);
            setFilteredProducts(response.products);
          } else {
            setProducts([]);
          }
        } catch (error) {
          message.error("Failed to load products");
        }
      }
    };
    fetchAllProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const category = categories.find((cat) => cat._id === categoryId);
    setSubCategories(category ? category.subCategories : []);
    setSelectedSubCategory(null);
    setProducts([]);
  };

  const handleSubCategoryChange = async (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    try {
      const response = await getAllProductBySubCategory(subCategoryId);
      if (response && response.products) {
        setProducts(response.products);
        setFilteredProducts(response.products);
      } else {
        message.error("No products found for this subcategory.");
      }
    } catch (error) {
      message.error("Failed to load products");
    }
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout style={{ marginTop: 64 }}>
        <Sidebar />
        <Layout style={{ padding: "20px", marginLeft: 200 }}>
          <Content
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              paddingTop: 80,
            }}
          >
            <h3>VIEW PRODUCT LIST</h3>

            <div className="mb-3">
              <label className="form-label">Category:</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Choose category"
                onChange={handleCategoryChange}
              >
                <Option key={0} value={null}>
                  All Products
                </Option>
                {categories?.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="mb-3">
              <label className="form-label">SubCategory:</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Choose sub category"
                onChange={handleSubCategoryChange}
                disabled={!selectedCategory}
              >
                {subCategories?.map((sub) => (
                  <Option key={sub.id} value={sub.id}>
                    {sub.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="mb-3">
              <label className="form-label">Search Product:</label>
              <Input
                placeholder="Search by product name"
                value={searchKeyword}
                onChange={handleSearchChange}
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredProducts}
              rowKey="_id"
              pagination={false}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProductView;
