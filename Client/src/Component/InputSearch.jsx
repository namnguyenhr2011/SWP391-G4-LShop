import { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const InputSearch = () => {
    const [valueSearch, setValueSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setValueSearch(e.target.value.trim());
    };

    const handlePressEnter = () => {
        // if (valueSearch) {
        //   navigate(`/search/${encodeURIComponent(valueSearch)}`);
        // }
        alert("Navigae to Seach ")
        navigate('/')
    };

    return (
        <Input
            value={valueSearch}
            onChange={handleSearch}
            onPressEnter={handlePressEnter}
            placeholder="Search for product"
            style={{ width: "300px", textAlign: "center" }}
            prefix={<SearchOutlined />}
        />
    );
};

export default InputSearch;
