import { getAllProductBySale } from "../../Service/sale/ApiSale"
import { useState, useEffect } from "react"

const SaleScreen = () => {

    const [product, setProduct] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllProductBySale()
            console.log(response)
            setProduct(response)
        }
        fetchData()
    }, [])


    return (
        <div>
            <h2>Sale Screen</h2>
            {product.products?.map((item) => (
                <div key={item._id} className="col-3">
                    <div className="card" style={{ width: "18rem" }}>
                        <img src={item.image} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text">{item.description}</p>
                            <p className="card-text">Price: {item.price.toLocaleString()} VND</p>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default SaleScreen
