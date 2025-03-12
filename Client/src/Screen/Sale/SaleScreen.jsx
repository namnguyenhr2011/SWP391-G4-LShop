import { useState, useEffect } from "react";
import { addSalePrice, updateSalePrice, deleteSale, getProductWithSaleID } from "../../Service/sale/ApiSale";
import { Button, Input, Table, Modal, Select, message, Spin, DatePicker, App } from "antd";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "../../Store/reducer/userReducer";

const { Option } = Select;

const SaleScreen = () => {
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [saleId, setSaleId] = useState(null);
    const [salePrice, setSalePrice] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [discountType, setDiscountType] = useState("fixed");
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductWithSaleID();
                const updatedProducts = response.products.map(product => ({
                    ...product,
                    saleId: product.sale?.saleID || null  // Gán saleId nếu có
                }));
                setProducts(updatedProducts);
            } catch {
                message.error("Không thể lấy dữ liệu sản phẩm.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleLogout = () => {
        dispatch(doLogout());
        message.success("Đã đăng xuất thành công!");
        navigate("/");
    };

    const handleOpenModal = (product, isUpdate) => {
        setSelectedProduct(product);
        setSaleId(product.sale?.saleID || null);
        setSalePrice(product.sale?.salePrice || "");
        setStartDate(product.sale?.startDate ? new Date(product.sale.startDate) : null);
        setEndDate(product.sale?.endDate ? new Date(product.sale.endDate) : null);
        setDiscountType(product.sale?.discountType || "fixed");
        setIsUpdating(isUpdate);
        setModalVisible(true);
    };

    const handleStartDateChange = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            date.setHours(0, 0, 0, 0);
            setStartDate(date);
        } else {
            setStartDate(null);
        }
    };

    const handleEndDateChange = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            date.setHours(23, 59, 59, 999);
            setEndDate(date);
        } else {
            setEndDate(null);
        }
    };

    const handleSubmit = async () => {
        if (!salePrice || isNaN(salePrice) || salePrice <= 0) {
            message.warning("Vui lòng nhập giá hợp lệ.");
            return;
        }
        if (!startDate || !endDate) {
            message.warning("Vui lòng chọn ngày bắt đầu và kết thúc.");
            return;
        }
        if (startDate > endDate) {
            message.warning("Ngày bắt đầu phải trước ngày kết thúc.");
            return;
        }

        try {
            const priceValue = parseInt(salePrice, 10);
            if (discountType === "percentage" && (priceValue <= 0 || priceValue > 100)) {
                message.warning("Phần trăm giảm giá phải từ 1 đến 100.");
                return;
            }

            const saleData = {
                productId: selectedProduct._id,
                salePrice: priceValue,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                discountType,
            };
            let response;
            if (isUpdating) {
                if (!saleId) {
                    message.error("Không tìm thấy sale để cập nhật.");
                    return;
                }
                response = await updateSalePrice(saleId, saleData);
            } else {
                response = await addSalePrice(saleData);
            }

            if (response.message) {
                message.success(response.message);
                const updatedProducts = await getProductWithSaleID();
                setProducts(updatedProducts.products);
                setModalVisible(false);
                setSalePrice("");
                setStartDate(null);
                setEndDate(null);
                setDiscountType("fixed");
                setSaleId(null);
            } else {
                message.error("Lỗi không xác định từ API.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            message.error("Có lỗi xảy ra: " + errorMessage);
        }
    };

    const handleDelete = async (saleId) => {
        if (!saleId) {
            message.error("Không tìm thấy sale để xóa.");
            return;
        }
        try {
            const response = await deleteSale(saleId);
            if (response.message) {
                message.success(response.message);
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.sale?.saleID === saleId
                            ? { ...product, sale: null, saleId: null } // Xóa thông tin sale
                            : product
                    )
                );
            } else {
                message.error("Lỗi không xác định từ API.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            message.error("Có lỗi xảy ra: " + errorMessage);
            console.error("Chi tiết lỗi:", error.response?.data || error);
        }
    };

    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortOrder === "desc" ? b.price - a.price : sortOrder === "asc" ? a.price - b.price : 0);

    const columns = [
        { title: "Hình ảnh", dataIndex: "image", key: "image", render: image => <img src={image} alt="product" style={{ width: 70, height: 70 }} /> },
        { title: "Tên sản phẩm", dataIndex: "name", key: "name", className: "font-bold" },
        { title: "Giá gốc", dataIndex: "price", key: "price", render: price => `${price.toLocaleString()} VND` },
        { title: "Giá sale", dataIndex: "sale", key: "salePrice", render: sale => sale?.salePrice ? `${sale.salePrice.toLocaleString()} VND` : "Chưa có" },
        {
            title: "Hành động", key: "action", render: (_, record) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button type="primary" onClick={() => handleOpenModal(record, false)}>
                        Thêm giá sale
                    </Button>
                    <Button type="primary" onClick={() => handleOpenModal(record, true)} disabled={!record.sale}>
                        Cập nhật giá sale
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => handleDelete(record.sale?.saleID)}
                        disabled={!record.sale}
                    >
                        Xóa sale
                    </Button>
                </div>
            )
        }
    ];

    return (
        <App>
            <Container className="mt-4 p-4" style={{ background: "linear-gradient(to right, #6a11cb, #2575fc)", borderRadius: "10px", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 className="text-center mb-0">Sale Manager</h2>
                    <Button type="primary" danger onClick={handleLogout} style={{ borderRadius: "5px", fontWeight: "bold" }}>
                        Đăng xuất
                    </Button>
                </div>
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
                        <p><strong>Loại giảm giá:</strong></p>
                        <Select value={discountType} onChange={setDiscountType} style={{ width: "100%", marginBottom: "10px" }}>
                            <Option value="fixed">Giá cố định</Option>
                            <Option value="percentage">Phần trăm</Option>
                        </Select>
                        <p><strong>Ngày bắt đầu:</strong></p>
                        {startDate && <p>Đã chọn: {startDate.toLocaleString()}</p>}
                        <DatePicker
                            onChange={(_, dateString) => handleStartDateChange(dateString)}
                            style={{ width: "100%", marginBottom: "10px" }}
                        />
                        <p><strong>Ngày kết thúc:</strong></p>
                        {endDate && <p>Đã chọn: {endDate.toLocaleString()}</p>}
                        <DatePicker
                            onChange={(_, dateString) => handleEndDateChange(dateString)}
                            style={{ width: "100%", marginBottom: "10px" }}
                        />
                    </div>
                </Modal>
            </Container>
        </App>
    );
};

export default SaleScreen;