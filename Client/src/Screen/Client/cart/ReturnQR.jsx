import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { notification, Result, Spin } from 'antd';
import Header from '../../layout/Header';
import AppFooter from '../../layout/Footer';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { addWithdrawDiscount } from '../../../Service/Admin/DiscountServices';

const ReturnQR = () => {
    const { t } = useTranslation("returnQR");
    const isDarkMode = useSelector((state) => state.user.darkMode);
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
                    notification.success({
                        message: t('payment_success'),
                        description: `${t('transaction_no')}: ${transactionNo}`
                    });

                    let withdrawalNumber = 0;
                    if (amount >= 50000000) {
                        withdrawalNumber = 3;
                    } else if (amount >= 35000000) {
                        withdrawalNumber = 2;
                    } else if (amount >= 20000000) {
                        withdrawalNumber = 1;
                    }

                    if (withdrawalNumber > 0) {
                        try {
                            const response = await addWithdrawDiscount(withdrawalNumber);
                            if (response.status === 200) {
                                notification.success({
                                    message: t('withdrawal_success'),
                                    description: `${t('withdrawal_number')}: ${withdrawalNumber}`
                                });
                            } else {
                                notification.error({
                                    message: t('withdrawal_failed'),
                                    description: t('error_processing_withdrawal')
                                });
                            }
                        } catch (error) {
                            console.error('Error processing withdrawal:', error);
                            notification.error({
                                message: t('withdrawal_error'),
                                description: t('error_processing_withdrawal')
                            });
                        }
                    }

                } else {
                    notification.error({
                        message: t('payment_failed'),
                        description: t('transaction_failed_or_cancelled')
                    });
                }

            } catch (error) {
                console.error('Error processing payment return:', error);
                notification.error({
                    message: t('processing_error'),
                    description: t('error_processing_payment')
                });
                setPaymentStatus(false);
            } finally {
                setLoading(false);
            }
        };

        processPaymentResult();
    }, [location, t]);

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
        <div style={{ minHeight: "80vh", backgroundColor: isDarkMode ? '#121212' : '#ffffff', color: isDarkMode ? '#e6edf3' : '#000000' }}>
            <Header />
            <Container className="py-5" style={{ minHeight: "80vh", backgroundColor: isDarkMode ? '#121212' : '#ffffff' }}>
                {loading ? (
                    <div className="text-center py-5">
                        <Spin size="large" />
                        <p className="mt-3" style={{ color: isDarkMode ? '#e6edf3' : '#000000' }}>{t('processing_payment')}</p>
                    </div>
                ) : (
                    <>
                        {paymentStatus === true ? (
                            <Result
                                status="success"
                                title={t('payment_success_title')}
                                subTitle={
                                    <span
                                        style={{
                                            color: isDarkMode ? '#e6edf3' : '#110000',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                        }}
                                    >
                                        {t('transaction_no')}: {paymentDetails.transactionNo}
                                    </span>
                                }
                                extra={[
                                    <Button
                                        key="continue"
                                        variant="primary"
                                        onClick={() => navigate('/')}
                                        style={{
                                            backgroundColor: isDarkMode ? '#007bff' : '#007bff',
                                            color: isDarkMode ? '#ffffff' : '#ffffff',
                                            border: isDarkMode ? '1px solid #007bff' : '1px solid #007bff',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                        }}
                                    >
                                        {t('continue_shopping')}
                                    </Button>,
                                ]}
                                style={{ color: isDarkMode ? '#e6edf3' : '#000000' }}
                            />
                        ) : (
                            <Result
                                status="error"
                                title={t('payment_failed_title')}
                                subTitle={t('payment_failed_message')}
                                extra={[
                                    <Button
                                        key="cart"
                                        variant="primary"
                                        onClick={() => navigate('/cart')}
                                        style={{ backgroundColor: isDarkMode ? '#0d1117' : '#007bff', border: 'none' }}
                                    >
                                        {t('back_to_cart')}
                                    </Button>,
                                ]}
                                style={{ color: isDarkMode ? '#e6edf3' : '#000000' }}
                            />
                        )}

                        {paymentStatus === true && (
                            <Row className="mt-4">
                                <Col md={8} className="mx-auto">
                                    <Card
                                        style={{
                                            backgroundColor: isDarkMode ? '#1c1e21' : '#ffffff',
                                            border: isDarkMode ? 'none' : '1px solid #dcdcdc',
                                            boxShadow: isDarkMode ? 'none' : '0px 2px 10px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <Card.Header
                                            className="bg-primary text-white"
                                            style={{
                                                backgroundColor: isDarkMode ? '#1c1e21' : '#007bff',
                                            }}
                                        >
                                            {t('transaction_details')}
                                        </Card.Header>
                                        <Card.Body
                                            style={{
                                                color: isDarkMode ? '#e6edf3' : '#000000',
                                            }}
                                        >
                                            <Row>
                                                <Col xs={6} className="mb-3">
                                                    <strong>{t('amount')}:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.amount.toLocaleString()} VND
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>{t('bank')}:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.bankCode}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>{t('card_type')}:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.cardType}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>{t('vnp_transaction_no')}:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.transactionNo}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>{t('bank_transaction_no')}:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.bankTranNo}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>{t('payment_date')}:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {formatDateTime(paymentDetails.payDate)}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>{t('reference_code')}:</strong>
                                                </Col>
                                                <Col xs={6} className="mb-3">
                                                    {paymentDetails.txnRef}
                                                </Col>

                                                <Col xs={6} className="mb-3">
                                                    <strong>{t('order_info')}:</strong>
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
        </div>
    );
};

export default ReturnQR;