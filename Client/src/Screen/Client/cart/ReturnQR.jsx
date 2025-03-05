import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { notification, Result, Spin } from 'antd';
import Header from '../../layout/Header';
import AppFooter from '../../layout/Footer';
// import { updateOrderPaymentStatus } from '../../../Service/Client/ApiOrder'; 

const ReturnQR = () => {
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({});
    const location = useLocation();
    const navigate = useNavigate();


    
    useEffect(() => {
        const processPaymentResult = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const responseCode = queryParams.get('vnp_ResponseCode');
                const transactionStatus = queryParams.get('vnp_TransactionStatus');
                const amount = queryParams.get('vnp_Amount')
                    ? parseInt(queryParams.get('vnp_Amount')) / 100 
                    : 0;
                const bankCode = queryParams.get('vnp_BankCode') || '';
                const bankTranNo = queryParams.get('vnp_BankTranNo') || '';
                const cardType = queryParams.get('vnp_CardType') || '';
                const orderInfo = queryParams.get('vnp_OrderInfo') || '';
                const payDate = queryParams.get('vnp_PayDate') || '';
                const transactionNo = queryParams.get('vnp_TransactionNo') || '';
                const txnRef = queryParams.get('vnp_TxnRef') || '';
                const details = {
                    responseCode,
                    transactionStatus,
                    amount,
                    bankCode,
                    bankTranNo,
                    cardType,
                    orderInfo,
                    payDate,
                    transactionNo,
                    txnRef
                };

                setPaymentDetails(details);

                const isSuccess = responseCode === '00' && transactionStatus === '00';
                setPaymentStatus(isSuccess);
                if (isSuccess) {
                    // Assuming txnRef is your order ID or can be used to identify the order
                    // await updateOrderPaymentStatus({
                    //     orderReference: txnRef,
                    //     paymentStatus: 'Paid',
                    //     transactionDetails: details
                    // });

                    notification.success({
                        message: 'Thanh toán thành công',
                        description: `Giao dịch ${transactionNo} đã được xác nhận.`
                    });
                } else {
                    notification.error({
                        message: 'Thanh toán thất bại',
                        description: 'Giao dịch không thành công hoặc đã bị hủy.'
                    });
                }
            } catch (error) {
                console.error('Error processing payment return:', error);
                notification.error({
                    message: 'Lỗi xử lý',
                    description: 'Đã xảy ra lỗi khi xử lý kết quả thanh toán.'
                });
                setPaymentStatus(false);
            } finally {
                setLoading(false);
            }
        };

        processPaymentResult();
    }, [location]);

    const formatDateTime = (payDateStr) => {
        if (!payDateStr || payDateStr.length < 14) return 'N/A';
        const year = payDateStr.substring(0, 4);
        const month = payDateStr.substring(4, 6);
        const day = payDateStr.substring(6, 8);
        const hour = payDateStr.substring(8, 10);
        const minute = payDateStr.substring(10, 12);
        const second = payDateStr.substring(12, 14);

        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    return (
        <>
            <Header />
            <Container className="py-5" style={{ minHeight: "80vh" }}>
                {loading ? (
                    <div className="text-center py-5">
                        <Spin size="large" />
                        <p className="mt-3">Đang xử lý kết quả thanh toán...</p>
                    </div>
                ) : (
                    <>
                        {paymentStatus === true ? (
                            <Result
                                status="success"
                                title="Thanh toán thành công!"
                                subTitle={`Mã giao dịch: ${paymentDetails.transactionNo}`}
                                extra={[
                                    <Button
                                        key="continue"
                                        variant="primary"
                                        onClick={() => navigate('/')}
                                    >
                                        Tiếp tục mua sắm
                                    </Button>,
                                ]}
                            />
                        ) : (
                            <Result
                                status="error"
                                title="Thanh toán không thành công"
                                subTitle="Giao dịch của bạn không thể hoàn tất hoặc đã bị hủy."
                                extra={[
                                    <Button
                                        key="cart"
                                        variant="primary"
                                        onClick={() => navigate('/cart')}
                                    >
                                        Quay lại giỏ hàng
                                    </Button>,
                                ]}
                            />
                        )}

                        {paymentStatus === true && (
                            <Row className="mt-4">
                                <Col md={8} className="mx-auto">
                                    <Card>
                                        <Card.Header className="bg-primary text-white">
                                            Chi tiết giao dịch
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col xs={6} className="mb-3">
                                                    <strong>Số tiền:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.amount.toLocaleString()} VND
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>Ngân hàng:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.bankCode}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>Loại thẻ:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.cardType}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>Mã giao dịch VNPay:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.transactionNo}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>Mã giao dịch ngân hàng:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.bankTranNo}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>Thời gian thanh toán:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {formatDateTime(paymentDetails.payDate)}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>Mã tham chiếu:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.txnRef}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>Nội dung thanh toán:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {decodeURIComponent(paymentDetails.orderInfo).replace(/\+/g, ' ')}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </>
                )}
            </Container>
            <AppFooter />
        </>
    );
};

export default ReturnQR;