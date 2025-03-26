import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Layout, message } from "antd";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";
import { getAllCategory, addProduct } from "../../Service/Client/ApiProduct";
import { useNavigate } from "react-router-dom"; 

const { Content } = Layout;
const { Option } = Select;

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
        quantity: "",
    });

    useEffect(() => {
        getAllCategory()
            .then((response) => {
                setCategories(response.categories);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                message.error("Failed to load categories!");
            });
    }, []);

    // Xử lý khi chọn Category
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        const selectedCat = categories.find(cat => cat._id === categoryId);

        if (selectedCat && selectedCat.subCategories.length > 0) {
            setSubCategories(selectedCat.subCategories);
        } else {
            setSubCategories([]);
        }
        setSelectedSubCategory(null);  // Reset SubCategory khi đổi Category
    };

    // Xử lý khi chọn SubCategory
    const handleSubCategoryChange = (subCategoryId) => {
        setSelectedSubCategory(subCategoryId);
    };

    const handleSubmit = async () => {
        if (!selectedCategory || !selectedSubCategory) {
            message.error("Please select Category and SubCategory!");
            return;
        }

        if (!product.quantity || Number(product.quantity) <= 0) {
            message.error("Quantity must be greater than 0!");
            return;
        }

        setLoading(true);

        try {
            const newProduct = { ...product };
            await addProduct(selectedSubCategory, newProduct);
            message.success("Product added successfully!");

            // Reset form sau khi thêm thành công
            setProduct({
                name: "",
                price: "",
                image: "",
                description: "",
                quantity: "",
            });
            setSelectedCategory(null);
            setSelectedSubCategory(null);
            setSubCategories([]);

            navigate("/Productdashboard"); 
        } catch (error) {
            message.error("Failed to add product!");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", border: "1px solid #ccc" }}>
            <Header />
            <Layout style={{ marginTop: 64 }}>
                <Sidebar />
                <Layout style={{ padding: "20px", marginLeft: 200 }}>
                    <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px", paddingTop: 80 }}>
                        <Container>
                            <h3>ADD PRODUCT</h3>
                            <Form layout="vertical" onFinish={handleSubmit}>
                                <Form.Item label="Category" required>
                                    <Select
                                        placeholder="Choose Category"
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}>
                                        {categories.map((cat) => (
                                            <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                {selectedCategory && subCategories.length > 0 && (
                                    <Form.Item label="SubCategory" required>
                                        <Select
                                            placeholder="Choose SubCategory"
                                            value={selectedSubCategory}
                                            onChange={handleSubCategoryChange}>
                                            {subCategories.map((sub) => (
                                                <Option key={sub.id} value={sub.id}>{sub.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )}

                                <Form.Item label="Product Name" required>
                                    <Input 
                                        value={product.name} 
                                        onChange={(e) => setProduct({ ...product, name: e.target.value })} 
                                    />
                                </Form.Item>
                                <Form.Item label="Price" required>
                                    <Input 
                                        value={product.price} 
                                        onChange={(e) => setProduct({ ...product, price: e.target.value })} 
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Quantity"
                                    required
                                    rules={[
                                        { required: true, message: "Please enter quantity!" },
                                        { type: "number", min: 1, message: "Quantity must be greater than 0!" }
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                                    />
                                </Form.Item>
                                <Form.Item label="Image URL">
                                    <Input 
                                        value={product.image} 
                                        onChange={(e) => setProduct({ ...product, image: e.target.value })} 
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Description"
                                    required
                                    rules={[
                                        { required: true, message: "Please enter a description!" },
                                        { max: 500, message: "Description must be less than 500 characters!" }
                                    ]}
                                >
                                    <Input.TextArea
                                        value={product.description}
                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                        maxLength={500} 
                                    />
                                </Form.Item>
                                <Button type="primary" block htmlType="submit" loading={loading}>
                                    {loading ? "Adding..." : "Add Product"}
                                </Button>
                            </Form>
                        </Container>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AddProduct;