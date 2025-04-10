import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Row, Col, Typography, Alert } from 'antd';
import { Container } from 'react-bootstrap';
import { getAllDiscounts } from '../../Service/Admin/DiscountServices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const LuckyWheel = () => {
    const { t } = useTranslation("luckyWheel");
    const [items, setItems] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const canvasRef = useRef(null);
    const wheelRef = useRef({
        angle: 0,
        spinTime: 0,
        spinTimeTotal: 0,
        targetAngle: 0
    });

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await getAllDiscounts();
                const newItems = response.data.discounts.map((discount) => ({
                    name: discount.discountValue,
                    weight: discount.rate
                }));

                newItems.push({ name: t('goodLuckNextTime'), weight: 40 });

                setItems(newItems);
            } catch (error) {
                console.error('Error fetching discounts:', error);
            }
        };

        fetchDiscounts();
    }, [t]);

    const colors = [
        '#4CAF50', '#FFC107', '#2196F3', '#E91E63',
        '#9C27B0', '#FF5722', '#795548', '#607D8B',
        '#3F51B5', '#009688', '#FF9800', '#F44336'
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
        const radius = Math.min(centerX, centerY) - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);

        let startAngle = 0;
        ctx.font = 'bold 16px Arial';
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
            ctx.stroke();

            const textAngle = startAngle + arcWeight / 2;
            const textX = centerX + (radius / 2) * Math.cos(textAngle);
            const textY = centerY + (radius / 2) * Math.sin(textAngle);

            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(textAngle + Math.PI / 2);

            let displayName = items[i].name;
            if (displayName.length > 15) {
                displayName = displayName.substring(0, 12) + '...';
            }

            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(displayName, 0, 0);
            ctx.restore();

            startAngle = endAngle;
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.stroke();
    };

    const spinWheel = () => {
        if (spinning) return;

        setSpinning(true);
        setResult(null);

        const wheel = wheelRef.current;
        wheel.spinTime = 0;

        wheel.spinTimeTotal = Math.random() * 8000 + 12000;
        const spinAngle = Math.random() * 10 + 15;
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
        const easeOut = function (t) {
            return 1 - Math.pow(1 - t, 4);
        };

        const spinAngle = wheel.targetAngle - wheel.angle;
        const delta = spinAngle * (easeOut(progress));

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

    const stopRotateWheel = () => {
        const wheel = wheelRef.current;
        const resultItem = getResultFromAngle(wheel.angle);
        setTimeout(() => {
            setResult(resultItem);
            setSpinning(false);
        }, 1000);
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

    const addItem = () => {
        setItems([...items, { name: t('prize') + ` ${items.length + 1}`, weight: 10 }]);
    };

    const removeItem = (index) => {
        if (items.length <= 2) {
            return;
        }
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    return (
        <Container>
            <Row justify="center" style={{ marginTop: 20 }}>
                <Col xs={24} md={20} lg={16}>
                    <Card>
                        <Title level={2} style={{ textAlign: 'center' }}>{t('luckyWheel')}</Title>

                        <Row justify="center">
                            <Col style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'relative',
                                    width: 400,
                                    height: 400,
                                    margin: '20px auto'
                                }}>
                                    <canvas
                                        ref={canvasRef}
                                        width={400}
                                        height={400}
                                        style={{ position: 'absolute', top: 0, left: 0 }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: -30,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 40,
                                        height: 50,
                                        backgroundColor: '#f44336',
                                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                                        zIndex: 10
                                    }} />
                                </div>
                            </Col>
                        </Row>

                        <Row justify="center" style={{ marginBottom: 20 }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={spinWheel}
                                disabled={spinning}
                                style={{ minWidth: 120 }}
                            >
                                {spinning ? t('spinning') : t('spin')}
                            </Button>
                        </Row>

                        {result && (
                            <Alert
                                message={t('result')}
                                description={`${t('congratulations')}: ${result.name}`}
                                type="success"
                                showIcon
                                style={{ marginBottom: 20 }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LuckyWheel;
