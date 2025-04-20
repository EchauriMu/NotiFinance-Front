import React from 'react';
import { Modal, Row, Col, Card, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const plans = [
  {
    name: 'Freemium', price: 'Gratis', color: '#1668dc', badge: 'Ideal para comenzar',
    features: [
      '1 alerta personalizada con condiciones básicas',
      'Soporte vía email en horario laboral',
      'Notificaciones por correo electrónico',
      'Acceso a recursos educativos y documentación',
      'Historial de alertas limitado a 7 días'
    ],
    details: {
      incluye: 'Acceso a una alerta activa, visualización básica, uso individual.',
      recomendado: 'Usuarios nuevos o personas que quieran probar el servicio.',
      limitaciones: 'Sin acceso a integraciones externas ni soporte fuera de horario.',
      tecnicos: 'Frecuencia de escaneo: cada 60 minutos.'
    }
  },
  {
    name: 'Premium', price: '$9.99/mes', color: '#faad14', badge: 'Más popular',
    features: [
      'Hasta 5 alertas configurables con múltiples condiciones',
      'Soporte prioritario (respuesta en menos de 12h)',
      'Notificaciones por WhatsApp, Discord y correo',
      'Acceso anticipado a nuevas funciones',
      'Historial de alertas de 30 días',
      'Análisis básico de tendencias'
    ],
    details: {
      incluye: 'Funciones ampliadas, más canales de notificación, soporte rápido.',
      recomendado: 'Usuarios avanzados, pequeños emprendedores.',
      limitaciones: 'No incluye panel de equipo ni integraciones API.',
      tecnicos: 'Frecuencia de escaneo: cada 15 minutos.'
    }
  },
  {
    name: 'NotiFinance Pro', price: '$19.99/mes', color: '#722ed1', badge: 'Nuevo • Para equipos',
    features: [
      'Hasta 10 alertas con condiciones avanzadas',
      'Gestión de usuarios y roles por equipo',
      'Integraciones avanzadas (API, Zapier, Webhooks)',
      'Panel de análisis detallado con exportación de datos',
      'Soporte premium 24/7 con canal dedicado',
      'Historial completo y búsqueda avanzada'
    ],
    details: {
      incluye: 'Herramientas colaborativas, acceso total a funcionalidades y personalización.',
      recomendado: 'Equipos financieros, analistas, startups en crecimiento.',
      limitaciones: 'Ninguna funcionalidad limitada. Acceso completo.',
      tecnicos: 'Frecuencia de escaneo: cada 2 minutos. SLA: 99.9%'
    }
  }
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
              <Text type="secondary" style={{ fontSize: '13px' }}>{plan.badge}</Text>
              <ul style={{ paddingLeft: 16, marginTop: 12 }}>
                {plan.features.slice(0,2).map((feature, idx) => (
                  <li key={idx}><Text type="secondary" style={{ fontSize: '12px' }}>{feature}</Text></li>
                ))}
              </ul>
              <div style={{ marginTop: '12px' }}>
                <Text strong style={{ display: 'block' }}>{plan.price}</Text>
              </div>
              <Button
                type="primary"
                block
                size="small"
                style={{ marginTop: '12px', backgroundColor: plan.color }}
                onClick={() => navigate('/payments', { state: { plan } })}
              >
                Elegir
              </Button>
              <Button
                block
                size="small"
                style={{ marginTop: '8px' }}
                onClick={() => navigate('/Subscription')}
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
