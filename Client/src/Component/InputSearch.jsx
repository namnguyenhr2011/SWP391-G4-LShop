import { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const InputSearch = () => {
  const [valueSearch, setValueSearch] = useState("");
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.user.darkMode);

  // Xử lý khi người dùng nhập text
  const handleSearch = (e) => {
    setValueSearch(e.target.value.trim());
  };

  const handlePressEnter = () => {
    if (valueSearch && valueSearch.trim()) {
      // Chuyển hướng tới trang tìm kiếm với từ khóa đã mã hóa
      navigate(`/search?query=${encodeURIComponent(valueSearch.trim())}`);
    } else {
      // Nếu không có từ khóa tìm kiếm, chuyển hướng về trang chủ
      navigate("/");
    }
  };


  const placeholder = isDarkMode ? "" : "Search for product";

  return (
    <Input
      value={valueSearch}
      onChange={handleSearch}
      onPressEnter={handlePressEnter}
      placeholder={placeholder}
      style={{
        width: "300px",
        textAlign: "center",
        borderRadius: "20px",
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(0, 0, 0, 0.3)"
          : "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: isDarkMode ? "1px solid #3a3f44" : "1px solid #d9d9d9",
        backgroundColor: isDarkMode ? "#2a3b57" : "#fff",
        transition: "all 0.3s ease",
      }}
      prefix={
        <SearchOutlined style={{ color: isDarkMode ? "#b0c4de" : "#1890ff" }} />
      }
    />
  );
};

export default InputSearch;
