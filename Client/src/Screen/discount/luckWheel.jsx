import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Row, Col, Typography, Alert, Spin, Space } from 'antd';
import { Container } from 'react-bootstrap';
import { getAllDiscounts, getDiscountByUser, assignDiscount } from '../../Service/Admin/DiscountServices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import UserDiscount from './userDiscount';
import Header from '../layout/Header';
import AppFooter from '../layout/Footer';
import './LuckyWheel.css';

const { Title, Text } = Typography;

const LuckyWheel = () => {
  const { t } = useTranslation('luckyWheel');
  const [withdrawalNumber, setWithdrawalNumber] = useState(0);
  const [items, setItems] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const canvasRef = useRef(null);
  const wheelRef = useRef({
    angle: 0,
    spinTime: 0,
    spinTimeTotal: 0,
    targetAngle: 0,
  });

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        const response = await getAllDiscounts();
        const fetchedDiscounts = response.data.discounts;

        const newItems = fetchedDiscounts.map((discount) => ({
          name: `${discount.discountValue}%`,
          weight: discount.rate,
          _id: discount._id,
        }));

        newItems.push({ name: t('goodLuckNextTime'), weight: 40, _id: null });

        setItems(newItems);
      } catch (error) {
        console.error('Error fetching discounts:', error);
        toast.error(t('errorFetchingDiscounts'));
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [t]);

  useEffect(() => {
    const fetchUserWithdrawalNumber = async () => {
      try {
        setLoading(true);
        const response = await getDiscountByUser();
        const withdrawalNumber = response?.[0]?.withdrawalNumber || 0;
        setWithdrawalNumber(withdrawalNumber);
      } catch (error) {
        console.error('Error fetching user withdrawal number:', error);
        toast.error(t('errorFetchingWithdrawalNumber'));
      } finally {
        setLoading(false);
      }
    };
    fetchUserWithdrawalNumber();
  }, [refreshKey]);

  const colors = [
    '#4CAF50', '#FFC107', '#2196F3', '#E91E63',
    '#9C27B0', '#FF5722', '#795548', '#607D8B',
    '#3F51B5', '#009688', '#FF9800', '#F44336',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawWheel();
    }
  }, [items]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#d9d9d9';
    ctx.stroke();

    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);

    let startAngle = 0;
    ctx.font = 'bold 18px Roboto, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < items.length; i++) {
      const arcWeight = ((items[i].weight || 1) / totalWeight) * (2 * Math.PI);
      const endAngle = startAngle + arcWeight;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      const textAngle = startAngle + arcWeight / 2;
      const textX = centerX + (radius * 0.6) * Math.cos(textAngle);
      const textY = centerY + (radius * 0.6) * Math.sin(textAngle);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);

      let displayName = items[i].name;
      if (displayName.length > 12) {
        displayName = displayName.substring(0, 20);
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillText(displayName, 0, 0);
      ctx.restore();

      startAngle = endAngle;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d9d9d9';
    ctx.stroke();
  };

  const spinWheel = () => {
    if (withdrawalNumber <= 0) {
      toast.error(t('notEnoughWithdrawalNumber'), { autoClose: 3000 });
      return;
    }
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const wheel = wheelRef.current;
    wheel.spinTime = 0;
    wheel.spinTimeTotal = 10000; // Fixed 10 seconds for spin
    const spinAngle = 15 + Math.random() * 5; // 15-20 full rotations
    wheel.targetAngle = wheel.angle + spinAngle * 2 * Math.PI;

    rotateWheel();
  };

  const rotateWheel = () => {
    const wheel = wheelRef.current;
    wheel.spinTime += 20;

    if (wheel.spinTime >= wheel.spinTimeTotal) {
      stopRotateWheel();
      return;
    }

    const progress = wheel.spinTime / wheel.spinTimeTotal;
    const easeOut = (t) => 1 - Math.pow(1 - t, 5); // Smoother easing

    const spinAngle = wheel.targetAngle - wheel.angle;
    const delta = spinAngle * easeOut(progress);

    wheel.angle = wheel.targetAngle - spinAngle + delta;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(wheel.angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();

    requestAnimationFrame(rotateWheel);
  };

  const stopRotateWheel = async () => {
    const wheel = wheelRef.current;
    const resultItem = getResultFromAngle(wheel.angle);

    setResult(resultItem);
    setSpinning(false);

    try {
      await assignDiscount(resultItem._id || null);
      if (resultItem._id) {
        toast.success(t('discountAssignedSuccessfully'), { autoClose: 3000 });
      } else {
        toast.info(t('goodLuckNextTime'), { autoClose: 3000 });
      }

      setRefreshKey((prev) => prev + 1);

      const response = await getDiscountByUser();
      const newWithdrawalNumber = response?.[0]?.withdrawalNumber || 0;
      setWithdrawalNumber(newWithdrawalNumber);
    } catch (error) {
      console.error('Error processing spin:', error);
      toast.error(error.response?.data?.message || t('errorAssigningDiscount'), { autoClose: 3000 });
    }
  };

  const getResultFromAngle = (angle) => {
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    const relativeAngle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

    let startAngle = 0;
    for (let i = 0; i < items.length; i++) {
      const arcWeight = ((items[i].weight || 1) / totalWeight) * (2 * Math.PI);
      const endAngle = startAngle + arcWeight;

      if (relativeAngle >= startAngle && relativeAngle < endAngle) {
        return items[i];
      }

      startAngle = endAngle;
    }

    return items[0];
  };

  return (
    <>
      <Header />
      <Container fluid className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '80vh', marginTop: 50 }}>
        <Row justify="center" gutter={[24, 24]} className="align-items-stretch">
          <Col xs={24} md={12} lg={10}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <Spin spinning={loading}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Title level={2} style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: 0 }}>
                    {t('luckyWheel')}
                  </Title>
                  <Text style={{ textAlign: 'center', display: 'block', color: '#595959' }}>
                    {t('spinsLeft')}: <strong>{withdrawalNumber}</strong>
                  </Text>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: 400,
                      height: 400,
                      margin: '0 auto',
                    }}
                    className="wheel-container"
                  >
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={400}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: -30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 50,
                        height: 60,
                        background: 'linear-gradient(180deg, #ff4d4f 0%, #d90429 100%)',
                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                        zIndex: 10,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                  </div>
                  <Row justify="center">
                    <Button
                      type="primary"
                      size="large"
                      shape="round"
                      onClick={spinWheel}
                      disabled={spinning || withdrawalNumber <= 0 || loading}
                      style={{
                        padding: '0 32px',
                        height: 48,
                        fontSize: 18,
                        background: spinning ? '#bfbfbf' : '#1890ff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {spinning ? t('spinning') : t('spin')}
                    </Button>
                  </Row>
                  {result && (
                    <Alert
                      message={t('result')}
                      description={`${t('congratulations')}: ${result.name}`}
                      type={result._id ? 'success' : 'info'}
                      showIcon
                      style={{ borderRadius: 8, marginTop: 16 }}
                    />
                  )}
                </Space>
              </Spin>
            </Card>
          </Col>

          <Col xs={24} md={12} lg={10}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                background: '#fff',
                height: '100%',
              }}
            >
              <UserDiscount refreshKey={refreshKey} />
            </Card>
          </Col>
        </Row>
      </Container>
      <AppFooter />
    </>
  );
};

export default LuckyWheel;