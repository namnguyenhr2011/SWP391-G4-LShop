import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllProductBySubCategory } from "../../../Service/Client/ApiProduct"; // Adjust path as needed

const ProductList = () => {
  const { subcategoryId } = useParams(); // Get subcategoryId from URL
  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProductBySubCategory(subcategoryId);
        setProducts(response.products || []);
        setSubcategory(response.subCategory || null);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategoryId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {subcategory ? (
        <div>
          <h1>{subcategory.name}</h1>
          <p>{subcategory.description}</p>
        </div>
      ) : (
        <h1>Subcategory not found</h1>
      )}

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              {product.name} - {product.price} - {subcategory?.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;