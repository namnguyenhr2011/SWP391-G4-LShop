import { getAllCategory } from "../../Service/Client/ApiProduct";
import { useState, useEffect } from "react";
import Header from "../layout/ProductManageHeader";
import Sidebar from "./Sidebar";
import { Layout } from "antd";

const { Content, Sider } = Layout;

const ProductManagerScreen = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getAllCategory();
                if (response && response.categories) {
                    setCategory(response.categories);
                } else {
                    console.error("Invalid response structure", response);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategory();
    }, []);

    return (
        <Layout style={{ minHeight: "100vh", border: "1px solid #ccc" }}>
            <Header />
            <Layout style={{ marginTop: 64 }}>
                <Sidebar />
                {/* Nội dung chính */}
                <Layout style={{ marginLeft: 200, padding: "20px" }}>
                    <Content
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            minHeight: "100vh"
                        }}
                    >
                        {category.length > 0 ? (
                            <ul>
                                {category.map((item) => (
                                    <li key={item._id}>
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        {item.image && <img src={item.image} alt={item.name} />}
                                        <h4>Sub Categories</h4>
                                        {item.subCategories?.length > 0 ? (
                                            <ul>
                                                {item.subCategories.map((subItem) => (
                                                    <li key={subItem.id}>
                                                        <p>{subItem.name}</p>
                                                        <p>{subItem.description}</p>
                                                        {subItem.image && <img src={subItem.image} alt={subItem.name} />}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No subcategories available.</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Loading categories...</p>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ProductManagerScreen;
