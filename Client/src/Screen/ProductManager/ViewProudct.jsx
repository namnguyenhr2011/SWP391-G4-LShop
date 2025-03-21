import React, { useState, useEffect } from "react";
import { Select, Layout, message, Table, Input, Modal } from "antd";
import Sidebar from "./Sidebar";
import Header from "../layout/ProductManageHeader";
import { getAllCategory, getAllProductBySubCategory, getAllProduct } from "../../Service/Client/ApiProduct";

const { Content } = Layout;
const { Option } = Select;

const ProductView = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 }); // Đổi pageSize thành 8
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        setCategories(response.categories);
      } catch (error) {
        message.error("Không thể tải danh mục sản phẩm!");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!selectedCategory) {
        try {
          const response = await getAllProduct();
          if (response && response.products) {
            setProducts(response.products);
            setFilteredProducts(response.products);
          } else {
            setProducts([]);
          }
        } catch (error) {
          message.error("Không thể tải danh sách sản phẩm!");
        }
      }
    };
    fetchAllProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const category = categories.find((cat) => cat._id === categoryId);
    setSubCategories(category ? category.subCategories : []);
    setSelectedSubCategory(null);
    setProducts([]);
  };

  const handleSubCategoryChange = async (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    try {
      const response = await getAllProductBySubCategory(subCategoryId);
      if (response && response.products) {
        setProducts(response.products);
        setFilteredProducts(response.products);
      } else {
        message.error("Không tìm thấy sản phẩm cho danh mục này!");
      }
    } catch (error) {
      message.error("Không thể tải sản phẩm!");
    }
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPagination({ ...pagination, current: 1 });
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize: pageSize });
  };

  const handleRowClick = (record) => {
    setSelectedProduct(record);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image || "https://via.placeholder.com/50"}
          alt="Sản phẩm"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${new Intl.NumberFormat("vi-VN").format(price)} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout style={{ marginTop: 64 }}>
        <Sidebar />
        <Layout style={{ padding: "20px", marginLeft: 200 }}>
          <Content
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              paddingTop: 80,
            }}
          >
            <h3>Danh sách sản phẩm</h3>

            <div className="mb-3">
              <label className="form-label">Danh mục:</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn danh mục"
                onChange={handleCategoryChange}
              >
                <Option key={0} value={null}>
                  Tất cả sản phẩm
                </Option>
                {categories?.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="mb-3">
              <label className="form-label">Danh mục con:</label>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn danh mục con"
                onChange={handleSubCategoryChange}
                disabled={!selectedCategory}
              >
                {subCategories?.map((sub) => (
                  <Option key={sub.id} value={sub.id}>
                    {sub.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="mb-3">
              <label className="form-label">Tìm kiếm sản phẩm:</label>
              <Input
                placeholder="Nhập tên sản phẩm"
                value={searchKeyword}
                onChange={handleSearchChange}
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredProducts}
              rowKey="_id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize, // Hiển thị 8 sản phẩm mỗi trang
                total: filteredProducts.length,
                onChange: handlePaginationChange,
              }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
              rowClassName="clickable-row"
            />

            <Modal
              title="Chi tiết sản phẩm"
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
            >
              {selectedProduct && (
                <>
                  <p><b>Tên:</b> {selectedProduct.name}</p>
                  <p><b>Giá:</b> {new Intl.NumberFormat("vi-VN").format(selectedProduct.price)} VND</p>
                  <p><b>Số lượng:</b> {selectedProduct.quantity}</p>
                  <p><b>Mô tả:</b> {selectedProduct.description}</p>
                </>
              )}
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProductView;