import React, { useState, useEffect } from "react";
import { Button, Select, Input, Upload, Layout, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";
import { getAllCategory, getSubCategory, updateProduct, getAllProductBySubCategory } from "../../Service/Client/ApiProduct";

const { Content } = Layout;
const { Option } = Select;

const UpdateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    price: "",
    image: null,
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategory();
        setCategories(response.categories);
      } catch (error) {
        message.error("Failed to load categories");
      } finally {
        setLoading(false);
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
      setLoading(true);
      const response = await getAllProductBySubCategory(subCategoryId);
      if (response && response.products) {
        setProducts(response.products);
      } else {
        message.error("No products found for this subcategory.");
      }
    } catch (error) {
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi ảnh thành Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) {
      message.error("Please select a product to update");
      return;
    }

    setLoading(true);
    try {
      const updatedProduct = {
        ...productDetails,
        image: productDetails.image ? await convertImageToBase64(productDetails.image) : null,  // Chuyển ảnh thành Base64
      };
      await updateProduct(selectedProduct, updatedProduct);
      message.success("Product updated successfully");
    } catch (error) {
      message.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

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
            <h3>UPDATE PRODUCT</h3>
            {loading ? <Spin size="large" /> : (
              <>
                {/* Chọn Category */}
                <div className="mb-3">
                  <label className="form-label">Category:</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Choose category"
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                  >
                    {categories?.map((category) => (
                      <Option key={category._id} value={category._id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Chọn SubCategory */}
                <div className="mb-3">
                  <label className="form-label">SubCategory:</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Choose sub category"
                    onChange={handleSubCategoryChange}
                    value={selectedSubCategory}
                    disabled={!selectedCategory}
                  >
                    {subCategories?.map((sub) => (
                      <Option key={sub.id} value={sub.id}>
                        {sub.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Chọn Product */}
                <div className="mb-3">
                  <label className="form-label">Product Name:</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Choose Product"
                    onChange={(value) => setSelectedProduct(value)}
                    value={selectedProduct}
                    disabled={!selectedSubCategory}
                  >
                    {products?.map((product) => (
                      <Option key={product._id} value={product._id}>
                        {product.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {selectedProduct && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Product Name:</label>
                      <Input
                        value={productDetails.name}
                        onChange={(e) =>
                          setProductDetails({ ...productDetails, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Price:</label>
                      <Input
                        type="number"
                        value={productDetails.price}
                        onChange={(e) =>
                          setProductDetails({ ...productDetails, price: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description:</label>
                      <Input.TextArea
                        value={productDetails.description}
                        onChange={(e) =>
                          setProductDetails({ ...productDetails, description: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Product Image:</label>
                      <Upload
                        beforeUpload={async (file) => {
                          const base64Image = await convertImageToBase64(file); // Chuyển file thành Base64
                          setProductDetails({ ...productDetails, image: base64Image });
                          return false; // Prevent auto upload
                        }}
                        fileList={productDetails.image ? [{ uid: "-1", name: "image.png", url: productDetails.image }] : []}
                      >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                      </Upload>
                    </div>
                  </>
                )}

                <Button type="primary" block onClick={handleUpdateProduct}>
                  Update Product
                </Button>
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UpdateProduct;
