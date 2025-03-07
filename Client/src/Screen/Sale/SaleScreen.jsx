import { useState, useEffect } from "react";
import { getAllProductBySale, addSalePrice, updateSalePrice } from "../../Service/sale/ApiSale";
import { Button, Input, Table, Modal, Select, message, Spin, DatePicker } from "antd";
import { Container } from "react-bootstrap";

const { Option } = Select;

const SaleScreen = () => {
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [salePrice, setSalePrice] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProductBySale();
                setProducts(response.products);
            } catch {
                message.error("Không thể lấy dữ liệu sản phẩm.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleOpenModal = (product, isUpdate) => {
        setSelectedProduct(product);
        setSalePrice(product.sale?.salePrice || "");
        setStartDate(product.sale?.startDate || null);
        setEndDate(product.sale?.endDate || null);
        setIsUpdating(isUpdate);
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        if (!salePrice || isNaN(salePrice)) {
            message.warning("Vui lòng nhập giá hợp lệ.");
            return;
        }

        try {
            const priceValue = parseInt(salePrice, 10);
            const data = {
                salePrice: priceValue,
                startDate,
                endDate,
                discountType: "percentage", // Hoặc "fixed" tùy vào logic backend
                productId: selectedProduct._id
            };

            console.log("Gửi dữ liệu:", data); // Kiểm tra dữ liệu gửi lên

            let response;
            if (isUpdating) {
                response = await updateSalePrice(selectedProduct.sale._id, data);
            } else {
                response = await addSalePrice(selectedProduct._id, data);
            }

            console.log("Phản hồi từ API:", response); // Kiểm tra phản hồi từ API

            if (response.message) {
                message.success(response.message);
            } else {
                message.error("Lỗi không xác định từ API.");
            }

            setProducts(prev =>
                prev.map(p => (p._id === selectedProduct._id ? { ...p, sale: data } : p))
            );
            setModalVisible(false);
        } catch (error) {
            console.error("Lỗi khi gửi API:", error);
            message.error("Có lỗi xảy ra khi cập nhật dữ liệu: " + (error.response?.data?.message || error.message));
        }
    };



    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortOrder === "desc" ? b.price - a.price : sortOrder === "asc" ? a.price - b.price : 0);

    const columns = [
        { title: "Hình ảnh", dataIndex: "image", key: "image", render: image => <img src={image} alt="product" style={{ width: 50, height: 50 }} /> },
        { title: "Tên sản phẩm", dataIndex: "name", key: "name", className: "font-bold" },
        { title: "Giá gốc", dataIndex: "price", key: "price", render: price => `${price.toLocaleString()} VND` },
        { title: "Giá sale", dataIndex: "sale", key: "salePrice", render: sale => sale?.salePrice ? `${sale.salePrice.toLocaleString()} VND` : "Chưa có" },
        {
            title: "Hành động", key: "action", render: (_, record) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button type="primary" onClick={() => handleOpenModal(record, false)}>
                        Thêm giá sale
                    </Button>
                    <Button type="default" onClick={() => handleOpenModal(record, true)} disabled={!record.sale}>
                        Cập nhật giá sale
                    </Button>
                </div>
            )
        }
    ];

    return (
        <Container className="mt-4 p-4" style={{ background: "linear-gradient(to right, #6a11cb, #2575fc)", borderRadius: "10px", color: "white" }}>
            <h2 className="text-center mb-4">Sale Manager</h2>
            <div className="d-flex gap-2 my-3">
                <Input placeholder="🔍 Tìm kiếm sản phẩm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1 }} />
                <Select defaultValue="default" onChange={setSortOrder} style={{ width: 200 }}>
                    <Option value="default">Mặc định</Option>
                    <Option value="desc">Giá giảm dần</Option>
                    <Option value="asc">Giá tăng dần</Option>
                </Select>
            </div>
            {loading ? (
                <div className="text-center my-4">
                    <Spin size="large" />
                </div>
            ) : (
                <Table columns={columns} dataSource={filteredProducts} rowKey="_id" bordered style={{ background: "white", borderRadius: "10px", color: "black" }} />
            )}
            <Modal
                title={isUpdating ? "Cập nhật giá sale" : "Thêm giá sale"}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
                style={{ borderRadius: "10px" }}
            >
                <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "8px" }}>
                    <p><strong>Tên sản phẩm:</strong></p>
                    <Input value={selectedProduct?.name || ""} disabled style={{ marginBottom: "10px", fontWeight: "bold" }} />
                    <p><strong>Nhập giá sale mới:</strong></p>
                    <Input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="Nhập giá sale" style={{ marginBottom: "10px" }} />
                    <p><strong>Ngày bắt đầu:</strong></p>
                    <DatePicker onChange={(_, dateString) => setStartDate(dateString)} style={{ marginBottom: "10px" }} />
                    <p><strong>Ngày kết thúc:</strong></p>
                    <DatePicker onChange={(_, dateString) => setEndDate(dateString)} style={{ marginBottom: "10px" }} />
                </div>
            </Modal>
        </Container>
    );
};

export default SaleScreen;
