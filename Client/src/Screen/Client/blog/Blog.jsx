import {
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Space,
  Tag,
  Button,
  Pagination,
  Skeleton,
} from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { getAllBlogs } from "../../../Service/Admin/BlogServices";

const { Content } = Layout;
const { Title, Text } = Typography;

const BlogPage = () => {
  const { t } = useTranslation("blog");
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.user.darkMode) || false;

  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Thêm state để quản lý trang
  const pageSize = 5; // Số bài viết mỗi trang

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs();
        if (data && Array.isArray(data.blogs)) {
          setBlogPosts(data.blogs);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const contentStyle = {
    backgroundColor: isDarkMode ? "#0d1117" : "#ffffff",
    color: isDarkMode ? "#c9d1d9" : "#000000",
    minHeight: "calc(100vh - 128px)",
    padding: "40px 20px",
    paddingTop: "100px",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? "#161b22" : "#ffffff",
    borderColor: isDarkMode ? "#30363d" : "#d9d9d9",
    color: isDarkMode ? "#c9d1d9" : "#000000",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  };

  const handleReadMore = (id) => {
    navigate(`/blog/${id}`);
  };

  // Xác định bài viết hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const currentPosts = blogPosts.slice(startIndex, startIndex + pageSize);

  if (loading)
    return (
      <Content style={contentStyle}>
        <Row justify="center">
          <Col xs={22} sm={20} md={18} lg={16}>
            <Skeleton active />
          </Col>
        </Row>
      </Content>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <Header />
      <Content style={contentStyle}>
        <Row justify="center">
          <Col xs={22} sm={20} md={18} lg={16}>
            <Title
              level={2}
              style={{ color: isDarkMode ? "#ffffff" : "#001529" }}
            >
              {t("Blog")}
            </Title>
            <Text style={{ color: isDarkMode ? "#c9d1d9" : "#595959" }}>
              {t("Explore our latest articles and updates")}
            </Text>
            <Space
              direction="vertical"
              size="large"
              style={{ width: "100%", marginTop: "20px" }}
            >
              {currentPosts.map((post) => (
                <Card
                  key={post._id}
                  hoverable
                  style={cardStyle}
                  bodyStyle={{ padding: "20px" }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                      <Title
                        level={4}
                        style={{ color: isDarkMode ? "#ffffff" : "#001529" }}
                      >
                        {post.title}
                      </Title>
                      <Text
                        style={{ color: isDarkMode ? "#c9d1d9" : "#595959" }}
                      >
                        {post.description}
                      </Text>
                      <div style={{ marginTop: "10px" }}>
                        {post.tags.map((tag) => (
                          <Tag
                            key={tag}
                            color={isDarkMode ? "blue" : "default"}
                            style={{ marginRight: "8px" }}
                          >
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </Col>
                    <Col xs={24} md={8} style={{ textAlign: "right" }}>
                      <Space direction="vertical" size="small">
                        <Text
                          style={{ color: isDarkMode ? "#8b949e" : "#8c8c8c" }}
                        >
                          <ClockCircleOutlined />{" "}
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </Text>
                        <Text
                          style={{ color: isDarkMode ? "#8b949e" : "#8c8c8c" }}
                        >
                          <EyeOutlined /> {post.views} {t("views")}
                        </Text>
                        <Button
                          type="primary"
                          onClick={() => handleReadMore(post._id)}
                          style={{
                            marginTop: "10px",
                            borderRadius: "6px",
                            boxShadow: "none",
                          }}
                        >
                          {t("Read More")}
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
            {/* Thêm Pagination */}
            <Row justify="center" style={{ marginTop: "20px" }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={blogPosts.length}
                onChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo(0, 0); // Kéo lên đầu trang khi chuyển trang
                }}
                showSizeChanger={false}
              />
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};

export default BlogPage;
