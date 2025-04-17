import React from 'react';
import { Modal, Row, Col, Card, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const plans = [
  {
    name: 'Freemium',
    description: 'Ideal para empezar. Incluye 1 alerta personalizada por correo electrónico.',
    price: 'Gratis',
    color: '#1668dc',
    alerts: '1 alerta',
    channels: ['Correo electrónico'],
  },
  {
    name: 'Premium',
    description: 'Para usuarios activos. Hasta 5 alertas configurables vía WhatsApp, Discord y correo.',
    price: '$9.99/mes',
    color: '#faad14',
    alerts: 'Hasta 5 alertas',
    channels: ['Correo', 'WhatsApp', 'Discord'],
  },
  {
    name: 'Analista Pro',
    description: 'Ideal para equipos o analistas. Hasta 10 alertas, control de usuarios y múltiples canales.',
    price: '$49.99/mes',
    color: '#d09420',
    alerts: 'Hasta 10 alertas',
    channels: ['Correo', 'WhatsApp', 'Discord', 'Integraciones avanzadas'],
  },
];

const UpdatePlanModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
    >
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={4}>Elige tu nuevo plan</Title>
        <Text type="secondary">Actualiza tu suscripción para obtener más beneficios</Text>
      </div>

      <Row gutter={[32, 32]}>
        {plans.map((plan) => (
          <Col key={plan.name} xs={24} sm={12} md={8}>
            <Card
              style={{ borderLeft: `4px solid ${plan.color}` }}
              size="small"
              bordered
              hoverable
            >
              <Title level={5}>{plan.name}</Title>
              <Text type="secondary" style={{ fontSize: '13px' }}>{plan.description}</Text>
              <ul style={{ paddingLeft: 16, marginTop: 12 }}>
                <li><Text strong>{plan.alerts}</Text></li>
                <li><Text type="secondary" style={{ fontSize: '12px' }}>
                  Notificaciones: {plan.channels.join(', ')}
                </Text></li>
              </ul>
              <div style={{ marginTop: '12px' }}>
                <Text strong style={{ display: 'block' }}>{plan.price}</Text>
              </div>
              <Button
                type="primary"
                block
                size="small"
                style={{ marginTop: '12px', backgroundColor: plan.color }}
              >
                Elegir
              </Button>
              <Button
                block
                size="small"
                style={{ marginTop: '8px' }}
                onClick={() => navigate('/Subscription ')}
              >
                Saber más
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default UpdatePlanModal;
