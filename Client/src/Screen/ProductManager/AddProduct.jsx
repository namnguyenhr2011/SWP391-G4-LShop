import React, { useState } from "react";
import { Button, Form, Input, Select, Upload, Layout, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import { addProduct } from "../../Service/Client/ApiProduct";
import Header from "../layout/ProductManageHeader";

const { Content } = Layout;
const { Option } = Select;

const AddProduct = () => {
    const subCategory = "67b8261f68f190b3ee102ef9"
    const [product, setProduct] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
        quantity: "",
        sold: 0,
        saleOf: false,
        salePrice: "",
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await addProduct(subCategory, product);
            message.success("Product added successfully");
        } catch (error) {
            message.error("Failed to add product");
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", border: "1px solid #ccc" }}>
            <Header />
            <Layout style={{ marginTop: 64 }}>
                <Sidebar />
                <Layout style={{ padding: "20px", marginLeft: 200 }}>
                    <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px", paddingTop: 80 }}>
                        <h3>ADD PRODUCT</h3>
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item label="Product Name">
                                <Input name="name" placeholder="Product Name" onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Price">
                                <Input name="price" placeholder="Enter Price" onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Quantity">
                                <Input name="quantity" placeholder="Enter Quantity" onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Category">
                                <Select placeholder="Choose Category" onChange={(value) => setProduct({ ...product, category: value })}>
                                    <Option value="laptop">Laptop</Option>
                                    <Option value="accessory">Accessory</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Image">
                                <Input name="image" placeholder="Image URL" onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input name="description" placeholder="Description" onChange={handleChange} />
                            </Form.Item>
                            <Button type="primary" block htmlType="submit">
                                Add Product
                            </Button>
                        </Form>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AddProduct;