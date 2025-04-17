import React from 'react';
import { Row, Col, Card, Typography, Button, Divider, Collapse, Badge, Space, Layout } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Footer } = Layout;
const { Title, Paragraph, Text } = Typography, { Panel } = Collapse;

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
    name: 'NotiFinance Enterpise', price: '$49.99/mes', color: '#722ed1', badge: 'Nuevo • Para equipos',
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

const Subscription = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding:'0px 60px', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <Title>Mejora tu experiencia con nuestros planes</Title>
        <Paragraph type="secondary" style={{ maxWidth: 700, margin: '0 auto' }}>
          Desde alertas simples hasta análisis profundos y gestión de equipos, nuestros planes están diseñados para escalar contigo.
        </Paragraph>
      </div>

      <Row gutter={[32, 32]} justify="center" style={{ marginBottom: 80 }}>
        {plans.map(plan => {
          const planColor = plan.color;
          const badgeColor = plan.name === 'NotiFinance Enterpise' ? 'purple' : plan.name === 'Premium' ? 'volcano' : 'blue';

          return (
            <Col key={plan.name} xs={24} sm={12} md={8}>
              <Badge.Ribbon text={plan.badge} color={badgeColor}>
                <Card
                  bordered hoverable
                  style={{ borderTop: `8px solid ${planColor}`, borderRadius: 16, transition: '0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  bodyStyle={{ minHeight: 350 }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${planColor}, 0 0 30px ${planColor}66`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={4} style={{ color: planColor }}>{plan.name}</Title>
                    <Text strong style={{ fontSize: 18 }}>{plan.price}</Text>
                  </Space>
                  <Divider />
                  <ul style={{ paddingLeft: 20 }}>
                    {plan.features.map((f, i) => (
                      <li key={i}><CheckCircleOutlined style={{ color: planColor, marginRight: 8 }} /><Text>{f}</Text></li>
                    ))}
                  </ul>

                  <Collapse ghost size="small" style={{ marginTop: 16 }}>
                    <Panel header="¿Qué incluye?" key="1"><Text>{plan.details.incluye}</Text></Panel>
                    <Panel header="Recomendado para..." key="2"><Text>{plan.details.recomendado}</Text></Panel>
                    <Panel header="Limitaciones" key="3"><Text>{plan.details.limitaciones}</Text></Panel>
                    <Panel header="Detalles técnicos" key="4"><Text>{plan.details.tecnicos}</Text></Panel>
                  </Collapse>

                  <Button type="primary" block style={{ marginTop: 20, backgroundColor: planColor, borderColor: planColor }} 
                  onClick={() => navigate('/payments', { state: { plan } })}
                  >
                    Elegir este plan
                  </Button>
                </Card>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Title level={3}>Preguntas frecuentes</Title>
        <Collapse accordion>
          <Panel header="¿Puedo cambiar de plan más adelante?" key="1"><Paragraph>Sí, puedes cambiar o cancelar tu plan en cualquier momento desde tu perfil. No hay penalizaciones.</Paragraph></Panel>
          <Panel header="¿Qué métodos de pago aceptan?" key="2"><Paragraph>Aceptamos tarjetas de crédito, débito y pagos vía PayPal. También puedes solicitar factura para pagos empresariales.</Paragraph></Panel>
          <Panel header="¿Qué pasa si excedo el número de alertas?" key="3"><Paragraph>Recibirás una notificación y tendrás la opción de actualizar tu plan o eliminar alertas antiguas.</Paragraph></Panel>
          <Panel header="¿Puedo compartir mi cuenta con otros?" key="4"><Paragraph>Solo el plan NotiFinance Enterpise permite gestión de usuarios y roles. Para uso individual, recomendamos Premium.</Paragraph></Panel>
        </Collapse>
      </div>

      <Footer style={{ background:'#18171c', borderTop: '2px solid #fff', textAlign: 'center', marginTop:30 }}>
        <Text style={{ color: 'rgba(255,255,255,0.45)' }}>NotiFinance beta</Text>
      </Footer>
    </div>
  );
};

export default Subscription;
