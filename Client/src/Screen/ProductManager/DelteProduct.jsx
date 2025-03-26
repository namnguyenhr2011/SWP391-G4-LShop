import React, { useState, useEffect } from "react";
import { Button, Select, Layout, message } from "antd";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";
import { managerDeleteProduct } from "../../Service/Client/ApiProduct";
import { getAllCategory } from "../../Service/Client/ApiProduct";
import { getAllProductBySubCategory } from "../../Service/Client/ApiProduct";

const { Content } = Layout;
const { Option } = Select;

const DeleteProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      } else {
        message.error("No products found for this subcategory.");
      }
    } catch (error) {
      message.error("Failed to load products");
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) {
      message.error("Please select a product to delete");
      return;
    }
    try {
      await managerDeleteProduct(selectedProduct);
      message.success("Product deleted successfully");
      setProducts(products.filter((p) => p._id !== selectedProduct));
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout style={{ marginTop: 64, marginLeft: 200 }}>
        <Sidebar />
        <Layout style={{ padding: "20px" }}>
          <Content
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              paddingTop: 80,
            }}
          >
            <h3>DELETE PRODUCT</h3>

            <div className="mb-3">
              <label className="form-label">Category:</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Choose category"
                onChange={handleCategoryChange}
              >
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
              <label className="form-label">Product Name:</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Choose Product"
                onChange={(value) => setSelectedProduct(value)}
                disabled={!selectedSubCategory}
              >
                {products?.map((product) => (
                  <Option key={product._id} value={product._id}>
                    {product.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Nút Xóa */}
            <Button type="primary" danger block onClick={handleDelete} disabled={!selectedProduct}>
              Delete Product
            </Button>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DeleteProduct;
