import React, { useState } from "react";
import { Button, Form, Input, Upload, Layout, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";
import { addCategory } from "../../Service/Client/ApiProduct";

const { Content } = Layout;

const AddCategory = () => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleUpload = (info) => {
    if (info.file.status === "done" && info.file.response) {
      setCategory({ ...category, image: info.file.response.url });
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const handleSubmit = async () => {
    const { name, description, image } = category;
    try {
      await addCategory(name, description, image);
      message.success("Category added successfully");
    } catch (error) {
      message.error("Failed to add category");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout style={{ marginTop: 64, marginLeft: 200}}>
        <Sidebar />
        <Layout style={{ padding: "20px" }}>
          <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px", paddingTop: 80 }}>
            <h3>ADD CATEGORY</h3>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Category Name">
                <Input name="name" placeholder="Category Name" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="Description">
                <Input name="description" placeholder="Description" onChange={handleChange} />
              </Form.Item>
              <Button type="primary" block htmlType="submit">
                Add Category
              </Button>
            </Form>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AddCategory;
