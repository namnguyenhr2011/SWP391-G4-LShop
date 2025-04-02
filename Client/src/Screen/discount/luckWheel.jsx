import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Input, InputNumber, Space, Row, Col, Typography, Alert, Divider } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Container } from 'react-bootstrap';

const { Title, Text } = Typography;

const LuckyWheel = () => {
    const [items, setItems] = useState([
        { name: 'Giải nhất', weight: 10 },
        { name: 'Giải nhì', weight: 20 },
        { name: 'Giải ba', weight: 30 },
        { name: 'Chúc may mắn lần sau', weight: 40 }
    ]);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const canvasRef = useRef(null);
    const wheelRef = useRef({
        angle: 0,
        spinTime: 0,
        spinTimeTotal: 0,
        targetAngle: 0
    });

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

        // Tính tổng weight
        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);

        // Vẽ vòng tròn
        let startAngle = 0;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < items.length; i++) {
            // Tính góc dựa trên trọng số
            const arcWeight = ((items[i].weight || 1) / totalWeight) * (2 * Math.PI);
            const endAngle = startAngle + arcWeight;

            // Vẽ phần
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.stroke();

            // Vẽ text
            const textAngle = startAngle + arcWeight / 2;
            const textX = centerX + (radius / 2) * Math.cos(textAngle);
            const textY = centerY + (radius / 2) * Math.sin(textAngle);

            // Xoay và vẽ text
            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(textAngle + Math.PI / 2);

            // Rút gọn tên nếu quá dài
            let displayName = items[i].name;
            if (displayName.length > 15) {
                displayName = displayName.substring(0, 12) + '...';
            }

            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(displayName, 0, 0);
            ctx.restore();

            startAngle = endAngle;
        }

        // Vẽ vòng tròn trung tâm
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.stroke();
    };

    const getResultFromAngle = (angle) => {
        // Tính tổng weight
        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);

        // Tính góc tương đối (đảm bảo nằm trong khoảng 0-2PI)
        const relativeAngle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

        let startAngle = 0;

        for (let i = 0; i < items.length; i++) {
            // Tính góc của mỗi phần dựa trên tỉ lệ weight
            const arcWeight = ((items[i].weight || 1) / totalWeight) * (2 * Math.PI);
            const endAngle = startAngle + arcWeight;

            // Kiểm tra xem góc hiện tại có nằm trong phần này không
            if (relativeAngle >= startAngle && relativeAngle < endAngle) {
                return items[i]; // Trả về phần trúng thưởng
            }

            startAngle = endAngle; // Cập nhật góc bắt đầu cho phần tiếp theo
        }

        return items[0]; // Mặc định nếu có lỗi (nên không xảy ra)
    };


    const spinWheel = () => {
        if (spinning) return;

        setSpinning(true);
        setResult(null);

        const wheel = wheelRef.current;
        wheel.spinTime = 0;

        // Thay đổi thời gian quay từ 5-8 giây lên 8-15 giây
        wheel.spinTimeTotal = Math.random() * 8000 + 12000;

        // Tăng số lần quay ngẫu nhiên từ 5-10 lên 10-15 vòng
        const spinAngle = Math.random() * 10 + 15;

        // Tổng góc quay = số vòng * 2PI
        wheel.targetAngle = wheel.angle + spinAngle * 2 * Math.PI;

        rotateWheel();
    };

    const rotateWheel = () => {
        const wheel = wheelRef.current;
        wheel.spinTime += 20; // Giảm tốc độ cập nhật (từ 30 xuống 20) để quay mượt hơn

        if (wheel.spinTime >= wheel.spinTimeTotal) {
            stopRotateWheel();
            return;
        }

        // Tính góc quay dựa trên thời gian với hiệu ứng mượt mà hơn
        const progress = wheel.spinTime / wheel.spinTimeTotal;

        // Sử dụng hàm easeOutQuart cho chuyển động chậm dần nhẹ nhàng hơn
        // t: progress, b: start value, c: change in value, d: duration
        const easeOut = function (t) {
            // easeOutQuart
            return 1 - Math.pow(1 - t, 4);
        };

        const spinAngle = wheel.targetAngle - wheel.angle;
        const delta = spinAngle * (easeOut(progress));

        wheel.angle = wheel.targetAngle - spinAngle + delta;

        // Vẽ lại wheel với góc mới
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
        // Xác định kết quả dựa trên góc hiện tại
        const wheel = wheelRef.current;
        const resultItem = getResultFromAngle(wheel.angle);
        setTimeout(() => {
            setResult(resultItem);
            setSpinning(false);
        }, 1000);
    };


    const addItem = () => {
        setItems([...items, { name: `Phần thưởng ${items.length + 1}`, weight: 10 }]);
    };

    const removeItem = (index) => {
        if (items.length <= 2) {
            return; // Yêu cầu ít nhất 2 mục
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
                        <Title level={2} style={{ textAlign: 'center' }}>Vòng Quay May Mắn</Title>

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
                                {spinning ? 'Đang quay...' : 'Quay!'}
                            </Button>
                        </Row>

                        {result && (
                            <Alert
                                message="Kết quả"
                                description={`Chúc mừng! Kết quả là: ${result.name}`}
                                type="success"
                                showIcon
                                style={{ marginBottom: 20 }}
                            />
                        )}

                        <Divider>Thiết lập vòng quay</Divider>

                        <Card title="Danh sách phần thưởng">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {items.map((item, index) => (
                                    <Row key={index} gutter={16} align="middle">
                                        <Col flex="auto">
                                            <Input
                                                placeholder="Tên phần thưởng"
                                                value={item.name}
                                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                                            />
                                        </Col>
                                        <Col flex="140px">
                                            <InputNumber
                                                min={1}
                                                placeholder="Tỉ lệ"
                                                value={item.weight}
                                                onChange={(value) => updateItem(index, 'weight', value)}
                                                style={{ width: '100%' }}
                                            />
                                        </Col>
                                        <Col>
                                            <Button
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeItem(index)}
                                                danger
                                                disabled={items.length <= 2}
                                            />
                                        </Col>
                                    </Row>
                                ))}

                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={addItem}
                                    style={{ width: '100%' }}
                                >
                                    Thêm phần thưởng
                                </Button>
                            </Space>
                        </Card>

                        <Text type="secondary" style={{ marginTop: 20, display: 'block' }}>
                            Ghi chú: Giá trị tỉ lệ càng cao thì khả năng trúng càng lớn. Tổng tỉ lệ sẽ được quy đổi thành tỉ lệ phần trăm.
                        </Text>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LuckyWheel;