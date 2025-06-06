import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  Space,
  Divider,
  Spin,
  notification,
} from 'antd';
import {
  SmileOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  NumberOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ThankYou = () => {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const storedPaymentInfo = localStorage.getItem('paymentInfo');

    if (storedPaymentInfo) {
      const parsed = JSON.parse(storedPaymentInfo);
      setPaymentInfo(parsed);

      // Agrega marca de tiempo y número de transacción simulado
      const now = new Date();
      const formattedDate = now.toLocaleString();
      const fakeTransactionId = 'TX-' + Math.floor(100000000 + Math.random() * 900000000);
      setTimestamp(formattedDate);
      setTransactionId(fakeTransactionId);

      setLoading(false);
    } else {
      notification.error({
        message: 'Acceso no autorizado',
        description:
          'No encontramos información de un pago reciente. Por favor realiza una compra primero.',
        placement: 'topRight',
      });
      setTimeout(() => navigate('/'), 1500);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '15%' }}>
        <Spin size="large" />
        <Title level={3}>Cargando detalles del pago...</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: 600, margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ textAlign: 'center' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
          <Title level={2}>¡Gracias por tu compra!</Title>
          <Paragraph>
            Tu suscripción fue procesada con éxito. A continuación, te mostramos
            un resumen del pago:
          </Paragraph>
        </div>

        <Card bordered style={{ borderRadius: 12 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">Plan adquirido</Text>
              <Title level={4} style={{ margin: 0 }}>
                {paymentInfo.planName}
              </Title>
            </div>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Método de pago</Text>
              <Space>
                <CreditCardOutlined />
                <Text>{paymentInfo.paymentMethod}</Text>
              </Space>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Total</Text>
              <Text>{paymentInfo.planPrice}</Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>
                <NumberOutlined /> Transacción
              </Text>
              <Text>{transactionId}</Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>
                <ClockCircleOutlined /> Fecha y hora
              </Text>
              <Text>{timestamp}</Text>
            </div>
          </Space>
        </Card>

        <Button
          type="primary"
          size="large"
          block
          onClick={() => {
            localStorage.removeItem('paymentInfo');
            navigate('/home');
          }}
          icon={<SmileOutlined />}
        >
          Volver al inicio
        </Button>
      </Space>
    </div>
  );
};

export default ThankYou;
