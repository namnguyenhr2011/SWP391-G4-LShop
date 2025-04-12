import { useEffect, useState } from 'react';
import { Table, Tag, Spin, Empty, Card, Typography } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import { getAllUserHaveDiscount } from '../../../Service/Admin/DiscountServices';

const { Title } = Typography;

const UserDiscount = () => {
    const [userDiscounts, setUserDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDiscounts = async () => {
            try {
                const response = await getAllUserHaveDiscount();
                setUserDiscounts(response);
            } catch (error) {
                console.error('Error fetching user discounts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDiscounts();
    }, []);

    const columns = [
        {
            title: 'User Name',
            dataIndex: ['userId', 'userName'],
            key: 'userName',
            sorter: (a, b) => a.userId.userName.localeCompare(b.userId.userName),
            render: (text) => <span style={{ fontWeight: 500, color: '#262626' }}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: ['userId', 'email'],
            key: 'email',
            sorter: (a, b) => a.userId.email.localeCompare(b.userId.email),
            render: (text) => <span style={{ color: '#595959' }}>{text}</span>,
        },
        {
            title: 'Withdrawal Number',
            dataIndex: 'withdrawalNumber',
            key: 'withdrawalNumber',
            sorter: (a, b) => a.withdrawalNumber - b.withdrawalNumber,
            render: (text) => (
                <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>
            ),
        },
        {
            title: 'Discount Codes',
            dataIndex: 'discountId',
            key: 'discountCodes',
            render: (discounts) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {discounts && discounts.length > 0 ? (
                        discounts.map((d) => (
                            <div
                                key={d._id}
                                style={{
                                    background: '#f6ffed',
                                    border: '1px solid #b7eb8f',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    fontWeight: 500,
                                    color: '#1a1a1a',
                                }}
                            >
                                Code: {d.code} - Value: {d.discountValue ? `$${d.discountValue}` : 'N/A'} - Rate: {d.rate ? `${d.rate}%` : 'N/A'} - Start: {d.startAt ? new Date(d.startAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }) : 'N/A'} - End: {d.endAt ? new Date(d.endAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }) : 'N/A'}
                            </div>
                        ))
                    ) : (
                        <Tag
                            color="volcano"
                            style={{
                                borderRadius: '12px',
                                padding: '4px 8px',
                                fontWeight: 500,
                                backgroundColor: '#fff1f0',
                                border: '1px solid #ffa39e',
                            }}
                        >
                            No Discount
                        </Tag>
                    )}
                </div>
            ),

        },
    ];

    return (
        <Container
            fluid
            style={{
                padding: '5px',
                background: '#fafafa',
                minHeight: '100vh',
                width: '100%',
            }}
        >
            <Row className="justify-content-center" style={{ width: "90vw" }}>
                <Col xs={12} md={10} lg={8}>
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '24px',

                        }}
                    >
                        <Title
                            level={2}
                            style={{
                                color: '#1a1a1a',
                                margin: 0,
                                fontWeight: 600,
                            }}
                        >
                            User Discounts
                        </Title>
                    </div>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            background: '#ffffff',
                            overflow: 'hidden',
                            width: '65vw',
                            margin: '0 auto',
                        }}
                        bodyStyle={{ padding: '0 24px 24px' }}
                    >
                        {loading ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '200px',
                                }}
                            >
                                <Spin size="large" />
                            </div>
                        ) : userDiscounts.length === 0 ? (
                            <Empty
                                description="No user discounts available"
                                style={{ padding: '40px 0' }}
                            />
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={userDiscounts}
                                rowKey="_id"
                                pagination={{
                                    pageSize: 5,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['5', '10', '20'],
                                }}
                                bordered={false}
                                scroll={{ x: 'max-content' }}
                                style={{ marginTop: '16px' }}
                                rowClassName={() => 'table-row-hover'}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDiscount;
