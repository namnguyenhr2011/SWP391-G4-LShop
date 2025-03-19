import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Layout, message } from "antd";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";
import { getAllCategory, addProduct } from "../../Service/Client/ApiProduct";
import { useNavigate } from "react-router-dom"; 
import UploadProductImage from "./uploadImage/uploadImage"; // Import component upload ảnh

const { Content } = Layout;
const { Option } = Select;

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(""); // Lưu URL ảnh sau khi upload
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        quantity: "",
    });

    useEffect(() => {
        getAllCategory()
            .then((response) => {
                setCategories(response.categories);
            })
            .catch(() => {
                message.error("Failed to load categories!");
            });
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        const selectedCat = categories.find(cat => cat._id === categoryId);
        setSubCategories(selectedCat ? selectedCat.subCategories : []);
        setSelectedSubCategory(null);
    };

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

        if (!imageUrl) {
            message.error("Please upload an image!");
            return;
        }

        setLoading(true);

        try {
            const newProduct = { ...product, image: imageUrl };
            await addProduct(selectedSubCategory, newProduct);
            message.success("Product added successfully!");

            setProduct({
                name: "",
                price: "",
                description: "",
                quantity: "",
            });
            setSelectedCategory(null);
            setSelectedSubCategory(null);
            setSubCategories([]);
            setImageUrl(""); // Reset ảnh sau khi thêm sản phẩm

            navigate("/Productdashboard"); 
        } catch (error) {
            message.error("Failed to add product!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", border: "1px solid #ccc" }}>
            <Header />
            <Layout style={{ marginTop: 64 }}>
                <Sidebar />
                <Layout style={{ padding: "20px" }}>
                    <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px", paddingTop: 80 }}>
                        <Container>
                            <h3>ADD PRODUCT</h3>
                            <Form layout="vertical" onFinish={handleSubmit}>
                                <Form.Item label="Category" required>
                                    <Select
                                        placeholder="Choose Category"
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                    >
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
                                            onChange={handleSubCategoryChange}
                                        >
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
                                        type="number"
                                        value={product.price} 
                                        onChange={(e) => setProduct({ ...product, price: e.target.value })} 
                                    />
                                </Form.Item>

                                <Form.Item label="Quantity" required>
                                    <Input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                                    />
                                </Form.Item>

                                <Form.Item label="Description" required>
                                    <Input.TextArea
                                        value={product.description}
                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    />
                                </Form.Item>

                                {/* Component Upload ảnh */}
                                <UploadProductImage setImageUrl={setImageUrl} />

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
