import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, message, Button } from "antd";
import { getOrderDetails } from "../../../Service/Client/ApiOrder";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await getOrderDetails(id);
                console.log("Order Data:", response);

                if (response && response.order) {
                    setOrder(response.order);
                    setTransaction(response.transaction || null);
                } else {
                    message.error("Order not found");
                }
            } catch {
                message.error("Failed to fetch order details");
            }
            setLoading(false);
        };

        if (id) {
            fetchOrderDetails();
        } else {
            message.error("Invalid Order ID");
        }
    }, [id]);
        try {
            const response = await getOrderDetails(id);
            console.log("Order Data:", response);

            if (response && response.order) {
                setOrder(response.order);
                setTransaction(response.transaction || null);
            } else {
                message.error("Order not found");
            }
        } catch {
            message.error("Failed to fetch order details");
        }
        setLoading(false);
    };

    // Hàm format tiền theo VND
    const formatCurrency = (amount) => {
        return amount.toLocaleString("vi-VN") + " VND";
    };

    return (
        <>
            <Header />
            <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
                <Button onClick={() => window.history.back()} style={{ marginBottom: 20 }}>Back</Button>

                {loading ? (
                    <Spin tip="Loading..." size="large" />
                ) : order ? (
                    <div style={{ display: "flex", gap: 20, justifyContent: "space-between" }}>
                        {/* Bảng bên trái - Danh sách sản phẩm */}
                        <Card title="Products" style={{ flex: 1, minWidth: 300 }}>
                            {order.products && order.products.length > 0 ? (
                                order.products.map((item, index) => {
                                    const product = item.productId || {}; // Tránh lỗi nếu productId bị null
                                    return (
                                        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                                            <img
                                                src={product.image || "/default-product.jpg"} // Ảnh mặc định nếu thiếu
                                                alt={product.name || "Unknown Product"}
                                                style={{ width: 80, height: 80, borderRadius: 10, marginRight: 15 }}
                                            />
                                            <div>
                                                <strong>{product.name || "Unknown Product"}</strong>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Price: {formatCurrency(item.price)}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No items in this order</p>
                            )}
                        </Card>

                        {/* Bảng giữa - Thông tin đơn hàng */}
                        <Card title="Order Information" style={{ flex: 1, minWidth: 300 }}>
                            <p><strong>Total amount:</strong> {formatCurrency(order.totalAmount)}</p>
                            <p><strong>Payment method:</strong> {order.paymentMethod}</p>
                            <p><strong>Payment status:</strong> {order.paymentStatus}</p>
                            <p><strong>Phone:</strong> {order.phone || "N/A"}</p>
                            <p><strong>Address:</strong> {order.address}</p>
                            <p><strong>Status:</strong> {order.status || "Pending"}</p>
                            <p><strong>Note:</strong> {order.note || "No notes"}</p>
                            <p><strong>Created at:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Updated at:</strong> {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}</p>
                        </Card>

                        {/* Bảng bên phải - Thông tin giao dịch */}
                        <Card title="Transaction Information" style={{ flex: 1, minWidth: 300 }}>
                            {transaction ? (
                                <div>
                                    <p><strong>Amount:</strong> {formatCurrency(transaction.amount)}</p>
                                    <p><strong>Payment Method:</strong> {transaction.paymentMethod}</p>
                                    <p><strong>Status:</strong> {transaction.status}</p>
                                    <p><strong>Description:</strong> {transaction.description}</p>
                                    <p><strong>Transaction Date:</strong> {new Date(transaction.transactionDate).toLocaleString()}</p>
                                    <p><strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                                    <p><strong>Updated At:</strong> {transaction.updatedAt ? new Date(transaction.updatedAt).toLocaleString() : "N/A"}</p>
                                </div>
                            ) : (
                                <p style={{ color: "red" }}>No transaction data available</p>
                            )}
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