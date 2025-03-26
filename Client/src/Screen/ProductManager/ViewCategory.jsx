import React, { useState, useEffect } from "react";
import { Layout, Collapse, Card, Typography, Space, Button, List, message, Modal } from "antd";
import { useSelector } from "react-redux";
import Header from "../layout/ProductManageHeader"; // Import Header đã cung cấp
import Sidebar from "./Sidebar"; // Import Sidebar đã cung cấp
import {
  getAllCategory,
  managerDeleteCategory,
  deleteSubCategory,
} from "../../Service/Client/ApiProduct"; // Import các API từ file service

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;

const ViewCategory = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch danh sách categories từ API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategory();
      setCategories(data.categories || []);
    } catch (error) {
      message.error("Failed to fetch categories: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xóa category
  const handleDeleteCategory = (categoryId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await managerDeleteCategory(categoryId);
          message.success("Category deleted successfully!");
          setCategories(categories.filter((cat) => cat._id !== categoryId));
        } catch (error) {
          message.error("Failed to delete category: " + (error.response?.data?.message || error.message));
        }
      },
    });
  };

  // Xóa subcategory
  const handleDeleteSubCategory = (subCategoryId, categoryId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this subcategory?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteSubCategory(subCategoryId);
          message.success("Subcategory deleted successfully!");
          // Cập nhật lại danh sách subcategory trong category tương ứng
          setCategories(
            categories.map((cat) =>
              cat._id === categoryId
                ? { ...cat, subCategories: cat.subCategories.filter((sub) => sub.id !== subCategoryId) }
                : cat
            )
          );
        } catch (error) {
          message.error("Failed to delete subcategory: " + (error.response?.data?.message || error.message));
        }
      },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout style={{ marginTop: 64, marginLeft: 220 }}>
        <Sidebar />
        <Content
          style={{
            margin: "80px 24px 24px",
            padding: 24,
            background: isDarkMode ? "#0d1117" : "#fff",
            minHeight: 280,
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Card loading={loading}>
            <Title level={2} style={{ marginBottom: 24 }}>
              View Categories
            </Title>
            {categories.length === 0 && !loading ? (
              <Typography.Text>No categories available.</Typography.Text>
            ) : (
              <Collapse
                accordion
                style={{
                  background: isDarkMode ? "#161b22" : "#fff",
                  borderRadius: 8,
                }}
              >
                {categories.map((category) => (
                  <Panel
                    header={
                      <Space style={{ width: "100%", justifyContent: "space-between" }}>
                        <span>{category.name}</span>
                        <Space>
                          <Button type="link" danger onClick={() => handleDeleteCategory(category._id)}>
                            Delete
                          </Button>
                        </Space>
                      </Space>
                    }
                    key={category._id}
                  >
                    <List
                      dataSource={category.subCategories}
                      renderItem={(subcategory) => (
                        <List.Item
                          actions={[
                            <Button
                              type="link"
                              danger
                              onClick={() => handleDeleteSubCategory(subcategory.id, category._id)}
                            >
                              Delete
                            </Button>,
                          ]}
                        >
                          <Typography.Text>{subcategory.name}</Typography.Text>
                        </List.Item>
                      )}
                      bordered={false}
                      locale={{ emptyText: "No subcategories available" }}
                    />
                  </Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ViewCategory;