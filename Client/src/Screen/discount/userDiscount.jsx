import React, { useState, useEffect } from 'react';
import { getDiscountByUser } from '../../Service/Admin/DiscountServices';
import { Container, Row, Col } from 'react-bootstrap';
import { Table, Alert, Typography, Spin, Space } from 'antd';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const UserDiscount = ({ refreshKey }) => {
  const { t } = useTranslation('luckyWheel');
  const [discounts, setDiscounts] = useState([]);
  const [withdrawalNumber, setWithdrawalNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDiscountByUser();
        let allDiscounts = [];

        if (response) {
          if (Array.isArray(response)) {
            allDiscounts = response.flatMap((item) =>
              item.discountId && Array.isArray(item.discountId) ? item.discountId : []
            );
            setWithdrawalNumber(response[0]?.withdrawalNumber || 0);
          } else if (response.discountId && Array.isArray(response.discountId)) {
            allDiscounts = response.discountId;
            setWithdrawalNumber(response.withdrawalNumber || 0);
          }
        } else {
          throw new Error('Invalid response format');
        }

        allDiscounts.sort((a, b) => new Date(a.endAt) - new Date(b.endAt));
        setDiscounts(allDiscounts);
      } catch (error) {
        console.error('Error fetching user discounts:', error);
        toast.error(t('errorFetchingDiscounts'));
        setError(t('errorFetchingDiscounts'));
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [t, refreshKey]); // Refetch when refreshKey changes

  const columns = [
    {
      title: t('discountCode'),
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t('discountValue'),
      dataIndex: 'discountValue',
      key: 'discountValue',
      render: (value, record) =>
        record.discountType === 'Percentage' ? (
          <Text type="success">{`${value}%`}</Text>
        ) : (
          <Text type="success">{value}</Text>
        ),
    },
    {
      title: t('validUntil'),
      dataIndex: 'endAt',
      key: 'endAt',
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString();
        const isExpired = new Date(date) < new Date();
        return (
          <Text type={isExpired ? 'danger' : 'secondary'}>
            {formattedDate} {isExpired && `(${t('expired')})`}
          </Text>
        );
      },
    },
  ];

  return (
    <Container fluid>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#1a1a1a' }}>
          🎁 {t('yourDiscounts')}
        </Title>
        <Text style={{ textAlign: 'center', display: 'block', color: '#595959' }}>
          {t('spinsLeft')}: <strong>{withdrawalNumber}</strong>
        </Text>

        {loading ? (
          <Row justify="center">
            <Spin size="large" />
          </Row>
        ) : error ? (
          <Alert
            message={t('error')}
            description={error}
            type="error"
            showIcon
            style={{ borderRadius: 8 }}
          />
        ) : discounts.length === 0 ? (
          <Alert
            message={t('noDiscounts')}
            type="info"
            showIcon
            style={{ borderRadius: 8 }}
          />
        ) : (
          <Table
            dataSource={discounts}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5, simple: true }}
            style={{ borderRadius: 8, overflow: 'hidden' }}
            rowClassName={(record) =>
              new Date(record.endAt) < new Date() ? 'expired-row' : ''
            }
          />
        )}
      </Space>
    </Container>
  );
};

export default UserDiscount;