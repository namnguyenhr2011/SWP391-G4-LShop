import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, Select, message, Spin } from "antd";
import { getAllCategory, addSubCategory } from "../../Service/Client/ApiProduct";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";

const { Content } = Layout;
const { Option } = Select;

const AddSubcategory = () => {
  const [categories, setCategories] = useState([]); // Danh sách categories
  const [selectedCategory, setSelectedCategory] = useState(null); // Category đã chọn
  const [subcategoryName, setSubcategoryName] = useState(""); // Tên subcategory mới
  const [loading, setLoading] = useState(false);

  // Lấy danh sách category từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategory();
        if (response?.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        message.error("Không thể tải danh mục.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Xử lý thêm subcategory
  const handleAddSubcategory = async () => {
    if (!selectedCategory || !subcategoryName.trim()) {
      message.warning("Vui lòng chọn danh mục và nhập tên subcategory.");
      return;
    }

    setLoading(true);
    try {
      await addSubCategory(selectedCategory, subcategoryName.trim());
      message.success("Subcategory đã được thêm!");
      setSubcategoryName(""); // Reset input
    } catch (error) {
      message.error("Thêm subcategory thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout style={{ marginTop: 64, marginLeft: 200 }}>
        <Sidebar />
        <Layout style={{ padding: "20px" }}>
          <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px", paddingTop: 80 }}>
            <h3>ADD SUBCATEGORY</h3>
            {loading ? <Spin size="large" /> : (
              <Form layout="vertical" onFinish={handleAddSubcategory}>
                {/* Chọn Category */}
                <Form.Item label="Chọn danh mục">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn danh mục"
                    onChange={setSelectedCategory}
                    value={selectedCategory}
                  >
                    {categories?.map((category) => (
                      <Option key={category._id} value={category._id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {selectedCategory && (
                  <Form.Item label="Tên subcategory">
                    <Input
                      placeholder="Nhập tên subcategory"
                      value={subcategoryName}
                      onChange={(e) => setSubcategoryName(e.target.value)}
                    />
                  </Form.Item>
                )}

                <Button type="primary" block htmlType="submit" loading={loading} disabled={!selectedCategory}>
                  Thêm Subcategory
                </Button>
              </Form>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AddSubcategory;
