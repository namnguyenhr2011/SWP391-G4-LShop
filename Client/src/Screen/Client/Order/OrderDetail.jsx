import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, message, Button } from "antd";
import { getOrderDetails } from "../../../Service/Client/ApiOrder";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { useSelector } from "react-redux";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

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

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#21252b" : "#f4f6f9",
        color: isDarkMode ? "#e6edf3" : "#1c1e21",
        transition: "all 0.3s ease",
      }}
    >
      <Header />
      <div
        style={{
          padding: "80px 20px 20px",
          margin: "0 auto",
          backgroundColor: isDarkMode ? "#2c3e50" : "#fff",
          borderRadius: isDarkMode ? "10px" : "0",
          boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 20,
            color: isDarkMode ? "#e6edf3" : "#1c1e21",
          }}
        >
          Order Details
        </h1>

        <Button
          onClick={() => window.history.back()}
          style={{
            marginBottom: 20,
            backgroundColor: isDarkMode ? "#34495e" : "#3498db",
            color: isDarkMode ? "#e6edf3" : "white",
            border: "none",
          }}
        >
          Back
        </Button>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <Spin tip="Loading..." size="large" />
          </div>
        ) : order ? (
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {/* Products Card */}
            <Card
              title="Products"
              style={{
                flex: 1,
                minWidth: 300,
                backgroundColor: isDarkMode ? "#34495e" : "white",
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                border: "none",
              }}
              headStyle={{
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                backgroundColor: isDarkMode ? "#465c71" : "#f0f2f5",
              }}
            >
              {order.products && order.products.length > 0 ? (
                order.products.map((item, index) => {
                  const product = item.productId || {};
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 20,
                        color: isDarkMode ? "#e6edf3" : "#1c1e21",
                      }}
                    >
                      <img
                        src={product.image || "/default-product.jpg"}
                        alt={product.name || "Unknown Product"}
                        style={{
                          width: 100,
                          height: 90,
                          borderRadius: 10,
                          marginRight: 15,
                          backgroundColor: "white",
                          padding: 5,
                        }}
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

            {/* Order Information Card */}
            <Card
              title="Order Information"
              style={{
                flex: 1,
                minWidth: 300,
                backgroundColor: isDarkMode ? "#34495e" : "white",
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                border: "none",
              }}
              headStyle={{
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                backgroundColor: isDarkMode ? "#465c71" : "#f0f2f5",
              }}
            >
              <p>
                <strong>Total amount:</strong>{" "}
                {formatCurrency(order.totalAmount)}
              </p>
              <p>
                <strong>Payment method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Payment status:</strong> {order.paymentStatus}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Status:</strong> {order.status || "Pending"}
              </p>
              <p>
                <strong>Note:</strong> {order.note || "No notes"}
              </p>
              <p>
                <strong>Created at:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated at:</strong>{" "}
                {order.updatedAt
                  ? new Date(order.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </Card>

            {/* Transaction Information Card */}
            <Card
              title="Transaction Information"
              style={{
                flex: 1,
                minWidth: 300,
                backgroundColor: isDarkMode ? "#34495e" : "white",
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                border: "none",
              }}
              headStyle={{
                color: isDarkMode ? "#e6edf3" : "#1c1e21",
                backgroundColor: isDarkMode ? "#465c71" : "#f0f2f5",
              }}
            >
              {transaction ? (
                <div>
                  <p>
                    <strong>Amount:</strong>{" "}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {transaction.paymentMethod}
                  </p>
                  <p>
                    <strong>Status:</strong> {transaction.status}
                  </p>
                  <p>
                    <strong>Description:</strong> {transaction.description}
                  </p>
                  <p>
                    <strong>Transaction Date:</strong>{" "}
                    {new Date(transaction.transactionDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {transaction.updatedAt
                      ? new Date(transaction.updatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              ) : (
                <p style={{ color: isDarkMode ? "#ff4d4f" : "red" }}>
                  No transaction data available
                </p>
              )}
            </Card>
          </div>
        ) : (
          <p
            style={{
              color: isDarkMode ? "#ff4d4f" : "red",
              textAlign: "center",
            }}
          >
            Order not found
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;

// Add these styles to your CSS file if needed
const globalDarkModeStyles = `
  body.dark-mode {
    background-color: #21252b;
    color: #e6edf3;
  }

  .ant-card {
    transition: all 0.3s ease;
  }

  .ant-btn:hover {
    opacity: 0.9;
  }
`;
