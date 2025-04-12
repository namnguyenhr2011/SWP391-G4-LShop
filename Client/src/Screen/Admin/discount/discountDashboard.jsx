import { useEffect, useState } from 'react';
import { adminGetAllDiscounts, deleteDiscount, changeDiscountStatus } from '../../../Service/Admin/DiscountServices';
import { Table, Input, Spin, Alert, Tag, Button, Popconfirm, Switch, Space } from 'antd';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Search } = Input;

const DiscountDashboard = () => {
    const [discounts, setDiscounts] = useState([]);
    const [filteredDiscounts, setFilteredDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await adminGetAllDiscounts();
                const discountData = response?.data?.discounts || [];
                setDiscounts(discountData);
                setFilteredDiscounts(discountData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDiscounts();
    }, []);

    const handleSearch = (value) => {
        const lowercasedValue = value.toLowerCase();
        const filtered = discounts.filter((discount) =>
            discount.code.toLowerCase().includes(lowercasedValue) ||
            discount.discountValue.toString().includes(lowercasedValue)
        );
        setFilteredDiscounts(filtered);
    };

    const handleDelete = async (discountId) => {
        try {
            await deleteDiscount(discountId);
            setDiscounts(discounts.filter(discount => discount._id !== discountId));
            setFilteredDiscounts(filteredDiscounts.filter(discount => discount._id !== discountId));
            toast.success('Discount deleted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete discount');
        }
    };

    const handleEdit = (discountId) => {
        navigate(`/admin/updateDiscount/${discountId}`);
    };

    const handleToggleStatus = async (discountId, checked) => {
        try {
            const response = await changeDiscountStatus(discountId);
            const updatedDiscount = response?.discount;
            setDiscounts(discounts.map(discount =>
                discount._id === discountId ? { ...discount, isActive: updatedDiscount.isActive } : discount
            ));
            setFilteredDiscounts(filteredDiscounts.map(discount =>
                discount._id === discountId ? { ...discount, isActive: updatedDiscount.isActive } : discount
            ));
            toast.success(response.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to toggle discount status');
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...filteredDiscounts].sort((a, b) => {
            if (key === 'isActive') {
                return direction === 'asc' ? (a[key] === b[key] ? 0 : a[key] ? -1 : 1) : (a[key] === b[key] ? 0 : a[key] ? 1 : -1);
            }
            if (key === 'startAt' || key === 'endAt') {
                return direction === 'asc'
                    ? new Date(a[key]) - new Date(b[key])
                    : new Date(b[key]) - new Date(a[key]);
            }
            return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
        });

        setFilteredDiscounts(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <UpOutlined /> : <DownOutlined />;
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Type',
            dataIndex: 'discountType',
            key: 'discountType',
        },
        {
            title: (
                <Space>
                    Value
                    <Button
                        type="link"
                        icon={getSortIcon('discountValue')}
                        onClick={() => handleSort('discountValue')}
                    />
                </Space>
            ),
            dataIndex: 'discountValue',
            key: 'discountValue',
            render: (value, record) => (
                <span>{record.discountType === 'Percentage' ? `${value}%` : `$${value}`}</span>
            ),
        },
        {
            title: (
                <Space>
                    Rate
                    <Button
                        type="link"
                        icon={getSortIcon('rate')}
                        onClick={() => handleSort('rate')}
                    />
                </Space>
            ),
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: (
                <Space>
                    Status
                    <Button
                        type="link"
                        icon={getSortIcon('isActive')}
                        onClick={() => handleSort('isActive')}
                    />
                </Space>
            ),
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive, record) => (
                <Space>
                    <Tag color={isActive ? 'green' : 'red'}>
                        {isActive ? 'Active' : 'Inactive'}
                    </Tag>
                    <Switch
                        checked={isActive}
                        onChange={(checked) => handleToggleStatus(record._id, checked)}
                        size="small"
                    />
                </Space>
            ),
        },
        {
            title: (
                <Space>
                    Start At
                    <Button
                        type="link"
                        icon={getSortIcon('startAt')}
                        onClick={() => handleSort('startAt')}
                    />
                </Space>
            ),
            dataIndex: 'startAt',
            key: 'startAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: (
                <Space>
                    End At
                    <Button
                        type="link"
                        icon={getSortIcon('endAt')}
                        onClick={() => handleSort('endAt')}
                    />
                </Space>
            ),
            dataIndex: 'endAt',
            key: 'endAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record._id)}
                        size="middle"
                        style={{ background: '#1d39c4', borderColor: '#1d39c4' }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this discount?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            size="middle"
                            style={{ background: '#f5222d', borderColor: '#f5222d' }}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Container className="mt-5" style={{ padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0, color: '#1d39c4' }}>Discounts</h1>
                <Button
                    type="primary"
                    onClick={() => navigate('/admin/createDiscount')}
                    size="large"
                    style={{ background: '#1d39c4', borderColor: '#1d39c4' }}
                >
                    Create New
                </Button>
            </div>

            <Search
                placeholder="Search discount codes"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
                style={{ marginBottom: '24px', maxWidth: '400px' }}
            />

            {loading ? (
                <div className="text-center">
                    <Spin size="large" tip="Loading discounts..." />
                </div>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredDiscounts}
                    rowKey="_id"
                    bordered
                    pagination={{ pageSize: 10 }}
                    style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}
                />
            )}
        </Container>
    );
};

export default DiscountDashboard;