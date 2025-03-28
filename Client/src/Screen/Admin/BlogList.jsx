import { useEffect, useState } from "react";
import { Table, Input, Button, Popconfirm, message, Tag, Space } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllBlogs, deleteBlog } from "../../Service/Admin/BlogServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.user.token); // Lấy token từ Redux
  const navigate = useNavigate();

  // Fetch danh sách blog khi component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await getAllBlogs();
        setBlogs(data.blogs);
        setFilteredBlogs(data.blogs); // Ban đầu hiển thị tất cả
      } catch (error) {
        message.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };

  // Xử lý xóa blog
  const handleDelete = async (blogId) => {
    try {
      await deleteBlog(blogId, token); // Gửi token để xác thực
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      setFilteredBlogs(filteredBlogs.filter((blog) => blog._id !== blogId));
      message.success("Blog deleted successfully");
    } catch (error) {
      message.error("Failed to delete blog");
    }
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true, // Rút ngắn nếu quá dài
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/update-blog/${record._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Input
        placeholder="Search by title"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 200, marginBottom: 16 }}
        prefix={<SearchOutlined />}
      />
      <Table
        columns={columns}
        dataSource={filteredBlogs}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BlogList;
