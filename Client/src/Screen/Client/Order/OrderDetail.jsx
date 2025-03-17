import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, message, Button } from "antd";
import { getOrderDetails } from "../../../Service/Client/ApiOrder";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        } else {
            message.error("Invalid Order ID");
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await getOrderDetails(id);
            console.log("Order Data:", response.order);
            if (response && response.order) {
                setOrder(response.order);
            } else {
                message.error("Order not found");
            }
        } catch (error) {
            message.error("Failed to fetch order details");
        }
        setLoading(false);
    };

    return (
        <>
            <Header />
            <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
                <Button onClick={() => window.history.back()} style={{ marginBottom: 20 }}>Back</Button>

                {loading ? (
                    <Spin tip="Loading..." size="large" />
                ) : order ? (
                    <div style={{ display: "flex", gap: 20 }}>
                        {/* Bảng bên trái - Danh sách sản phẩm */}
                        <Card title="Products" style={{ flex: 1 }}>
                            {order.products && order.products.length > 0 ? (
                                <div>
                                    {order.products.map((item, index) => (
                                        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                                            <img
                                                src={item.productId.image}
                                                alt={item.productId.name}
                                                style={{ width: 80, height: 80, borderRadius: 10, marginRight: 15 }}
                                            />
                                            <div>
                                                <strong>{item.productId.name}</strong>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Price: ${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No items in this order</p>
                            )}
                        </Card>

                        {/* Bảng bên phải - Thông tin đơn hàng */}
                        <Card title="Order Information" style={{ flex: 1 }}>
                            <p><strong>Total amount:</strong> ${order.totalAmount}</p>
                            <p><strong>Payment method:</strong> {order.paymentMethod}</p>
                            <p><strong>Payment status:</strong> {order.paymentStatus}</p>
                            <p><strong>Phone:</strong> {order.phone || "N/A"}</p>
                            <p><strong>Address:</strong> {order.address}</p>
                            <p><strong>Status:</strong> {order.status || "Pending"}</p>
                            <p><strong>Note:</strong> {order.note || "No notes"}</p>
                            <p><strong>Created at:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Updated at:</strong> {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}</p>
                        </Card>
                    </div>
                ) : (
                    <p style={{ color: "red" }}>Order not found</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderDetails;
