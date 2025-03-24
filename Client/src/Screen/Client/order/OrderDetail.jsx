// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Card, Spin, message, Button } from "antd";
// import { getOrderDetails } from "../../../Service/Client/ApiOrder";
// import Header from "../../layout/Header";
// import Footer from "../../layout/Footer";

// const OrderDetails = () => {
//     const { id } = useParams();
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (id) {
//             fetchOrderDetails();
//         } else {
//             message.error("Invalid Order ID");
//         }
//     }, [id]);

//     const fetchOrderDetails = async () => {
//         try {
//             const response = await getOrderDetails(id);
//             console.log("Order Data:", response.order);
//             if (response && response.order) {
//                 setOrder(response.order);
//             } else {
//                 message.error("Order not found");
//             }
//         } catch (error) {
//             message.error("Failed to fetch order details");
//         }
//         setLoading(false);
//     };

//     return (
//         <>
//             <Header />
//             <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
//                 <Button onClick={() => window.history.back()} style={{ marginBottom: 20 }}>Back</Button>

//                 {loading ? (
//                     <Spin tip="Loading..." size="large" />
//                 ) : order ? (
//                     <div style={{ display: "flex", gap: 20 }}>
//                         {/* Bảng bên trái - Danh sách sản phẩm */}
//                         <Card title="Products" style={{ flex: 1 }}>
//                             {order.products && order.products.length > 0 ? (
//                                 <div>
//                                     {order.products.map((item, index) => (
//                                         <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
//                                             <img
//                                                 src={item.productId.image}
//                                                 alt={item.productId.name}
//                                                 style={{ width: 80, height: 80, borderRadius: 10, marginRight: 15 }}
//                                             />
//                                             <div>
//                                                 <strong>{item.productId.name}</strong>
//                                                 <p>Quantity: {item.quantity}</p>
//                                                 <p>Price: ${item.price}</p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <p>No items in this order</p>
//                             )}
//                         </Card>

//                         {/* Bảng bên phải - Thông tin đơn hàng */}
//                         <Card title="Order Information" style={{ flex: 1 }}>
//                             <p><strong>Total amount:</strong> ${order.totalAmount}</p>
//                             <p><strong>Payment method:</strong> {order.paymentMethod}</p>
//                             <p><strong>Payment status:</strong> {order.paymentStatus}</p>
//                             <p><strong>Phone:</strong> {order.phone || "N/A"}</p>
//                             <p><strong>Address:</strong> {order.address}</p>
//                             <p><strong>Status:</strong> {order.status || "Pending"}</p>
//                             <p><strong>Note:</strong> {order.note || "No notes"}</p>
//                             <p><strong>Created at:</strong> {new Date(order.createdAt).toLocaleString()}</p>
//                             <p><strong>Updated at:</strong> {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}</p>
//                         </Card>
//                     </div>
//                 ) : (
//                     <p style={{ color: "red" }}>Order not found</p>
//                 )}
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default OrderDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../../../Service/Client/ApiOrder";
import { useSelector } from "react-redux";
import { Button, Card, Spin } from 'antd';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";


const OrderDetails = () => {
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [transaction, setTransaction] = useState(null);
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
            console.log("Order Data:", response);

            if (response && response.order) {
                setOrder(response.order);
                setTransaction(response.transaction || null); // Đảm bảo transaction được set đúng
            } else {
                message.error("Order not found");
            }
        } catch (error) {
            message.error("Failed to fetch order details");
        }
        setLoading(false);
    };
    const cardStyle = {
        height: '100%',
        overflowY: 'auto',
    };
    const containerStyle = {
        paddingTop: '18vh',
        height: '90vh',
        margin: '0 auto',
        backgroundColor: isDarkMode ? '#21252b' : '#f4f6f9',
        color: isDarkMode ? '#e6edf3' : '#1c1e21',
        transition: 'all 0.3s ease',
        padding: '20px',
    };

    return (
        <>
            <Header />
            <div style={containerStyle}>
                <Row>
                    <Col>
                        <Button onClick={() => window.history.back()} style={{ marginBottom: 20 }}>Back</Button>
                    </Col>
                    <Col>
                        <div>
                            <h2>Order Details</h2>
                        </div>
                    </Col>
                </Row>

                {loading ? (
                    <Spin tip="Loading..." size="large" />
                ) : order ? (
                    <Container>
                        <Row className="g-4" style={{ height: '60vh' }}>
                            {/* Left - Products List */}
                            <Col md={4} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card title="Products" style={cardStyle}>
                                    {order.products && order.products.length > 0 ? (
                                        order.products.map((item, index) => (
                                            <div key={index} className="d-flex align-items-center mb-3">
                                                <Image src={item.productId.image} alt={item.productId.name} rounded width={100} height={100} className="me-3" />
                                                <div>
                                                    <strong>{item.productId.name}</strong>
                                                    <p>Quantity: {item.quantity}</p>
                                                    <p>Price: ${item.price}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No items in this order</p>
                                    )}
                                </Card>
                            </Col>

                            {/* Middle - Order Information */}
                            <Col md={4} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card title="Order Information" style={cardStyle}>
                                    <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                    <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                                    <p><strong>Phone:</strong> {order.phone || 'N/A'}</p>
                                    <p><strong>Address:</strong> {order.address}</p>
                                    <p><strong>Status:</strong> {order.status || 'Pending'}</p>
                                    <p><strong>Note:</strong> {order.note || 'No notes'}</p>
                                    <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                    <p><strong>Updated At:</strong> {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'N/A'}</p>
                                </Card>
                            </Col>

                            {/* Right - Transaction Information */}
                            <Col md={4} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card title="Transaction Information" style={cardStyle}>
                                    {transaction ? (
                                        <div>
                                            <p><strong>Amount:</strong> ${transaction.amount}</p>
                                            <p><strong>Payment Method:</strong> {transaction.paymentMethod}</p>
                                            <p><strong>Status:</strong> {transaction.status}</p>
                                            <p><strong>Description:</strong> {transaction.description}</p>
                                            <p><strong>Transaction Date:</strong> {new Date(transaction.transactionDate).toLocaleString()}</p>
                                            <p><strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                                            <p><strong>Updated At:</strong> {transaction.updatedAt ? new Date(transaction.updatedAt).toLocaleString() : 'N/A'}</p>
                                        </div>
                                    ) : (
                                        <p className="text-danger">No transaction data available</p>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                ) : (
                    <p className="text-danger">Order not found</p>
                )}
            </div>
            <Footer />
        </>
    );
};




export default OrderDetails;
