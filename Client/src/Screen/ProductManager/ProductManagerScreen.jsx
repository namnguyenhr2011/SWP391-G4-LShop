import { getAllCategory } from "../../Service/Client/ApiProduct";
import { useState, useEffect } from "react";
import Header from "../../Screen/layout/ProductManageHeader";
import Sidebar from "./Sidebar";

const ProductManagerScreen = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                //call api
                const response = await getAllCategory();
                console.log(response);
                //neu api co du lieu, set respone = du lieu tra ve tu api
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
        <>       
            <Sidebar />
            <div>
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
            </div>
        </>

    );
};

export default ProductManagerScreen;