import React from 'react';
import {
  Row, Col, Card, Typography, Button, Divider,
  Collapse, Badge, Space, Layout
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const plans = [
  {
    name: 'Freemium',
    price: 'Gratis',
    color: '#1668dc',
    badge: 'Ideal para comenzar',
    features: [
      'Hasta 3 alertas en total (sin posibilidad de eliminar o cambiarla)',
      'Solo 1 alerta activa a la vez',
      'Notificaciones por correo electrónico',
    ],
    details: {
      incluye: 'Crea hasta 3 alertas, con solo una activa a la vez. Solo notificaciones por correo electrónico.',
      recomendado: 'Usuarios nuevos o quienes quieren probar el servicio.',
      limitaciones: 'No permite eliminar alertas, solo modificarlas. No puedes crear más de 3 alertas. Solo una alerta activa a la vez.',
    }
  },
  {
    name: 'Premium',
    price: '$9.99/mes',
    color: '#faad14',
    badge: 'Más popular',
    features: [
      'Hasta 10 alertas configurables',
      'Hasta 5 alertas activas a la vez',
      'Notificaciones por correo electrónico, WhatsApp y Discord',
    ],
    details: {
      incluye: 'Crea hasta 5 alertas y mantén hasta 3 activas. Recibe notificaciones por correo, WhatsApp y Discord.',
      recomendado: 'Usuarios avanzados o pequeños emprendedores.',
      limitaciones: 'No incluye panel de equipo ni integraciones API.',
    }
  },
  {
    name: 'NotiFinance Pro',
    price: '$19.99/mes',
    color: '#722ed1',
    badge: 'Nuevo • Para profesionales',
    features: [
      'Hasta 20 alertas configurables',
      'Hasta 10 alertas activas a la vez',
      'Notificaciones por correo electrónico, WhatsApp y Discord',
    ],
    details: {
      incluye: 'Crea hasta 10 alertas y mantén todas activas. Recibe notificaciones por correo, WhatsApp y Discord.',
      recomendado: 'Equipos financieros, analistas, startups en crecimiento.',
      limitaciones: 'Acceso completo, sin restricciones.',
    }
  }
];

const Subscription = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const currentPlan = userData?.plan || 'Freemium';
  const isPlanChangeable = currentPlan === 'Freemium';

  return (
    <div style={{ padding: '0px 60px', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <Title>Mejora tu experiencia con nuestros planes</Title>
        <Paragraph type="secondary" style={{ maxWidth: 700, margin: '0 auto' }}>
          Desde alertas simples hasta análisis profundos y gestión de equipos, nuestros planes están diseñados para escalar contigo.
        </Paragraph>
      </div>

      {!isPlanChangeable && (
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Text type="secondary">
            Ya tienes un plan activo. Para cambiarlo, ve a Configuración &gt; Facturación.
          </Text>
        </div>
      )}

      <Row gutter={[32, 32]} justify="center" style={{ marginBottom: 80 }}>
        {plans.map(plan => {
          const planColor = plan.color;
          const isCurrentPlan = plan.name === currentPlan;
          const badgeColor = plan.name === 'NotiFinance Pro' ? 'purple' : plan.name === 'Premium' ? 'volcano' : 'blue';
          const badgeText = isCurrentPlan ? `${plan.badge} • Plan actual` : plan.badge;

          return (
            <Col key={plan.name} xs={24} sm={12} md={8}>
              <Badge.Ribbon text={badgeText} color={badgeColor}>
                <Card
                  bordered
                  hoverable={isPlanChangeable && !isCurrentPlan}
                  style={{
                    borderTop: `8px solid ${planColor}`,
                    borderRadius: 16,
                    transition: '0.3s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
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
                  </Collapse>

                  <Button
                    type="primary"
                    block
                    disabled={!isPlanChangeable || isCurrentPlan}
                    style={{
                      marginTop: 20,
                      backgroundColor: planColor,
                      borderColor: planColor,
                      opacity: (!isPlanChangeable || isCurrentPlan) ? 0.6 : 1,
                      cursor: (!isPlanChangeable || isCurrentPlan) ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => {
                      if (isPlanChangeable && !isCurrentPlan) {
                        navigate('/payments', { state: { plan } });
                      }
                    }}
                  >
                    {isCurrentPlan ? 'Plan actual' : 'Elegir este plan'}
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
          <Panel header="¿Puedo cambiar de plan más adelante?" key="1">
            <Paragraph>Sí, puedes cambiar o cancelar tu plan en cualquier momento desde tu perfil. No hay penalizaciones.</Paragraph>
          </Panel>
          <Panel header="¿Qué métodos de pago aceptan?" key="2">
            <Paragraph>Aceptamos tarjetas de crédito, débito y pagos vía PayPal. También puedes solicitar factura para pagos empresariales.</Paragraph>
          </Panel>
          <Panel header="¿Qué pasa si excedo el número de alertas?" key="3">
            <Paragraph>Recibirás una notificación y tendrás la opción de actualizar tu plan o eliminar alertas antiguas.</Paragraph>
          </Panel>
          <Panel header="¿Puedo compartir mi cuenta con otros?" key="4">
            <Paragraph>Para garantizar una experiencia segura y personalizada, las cuentas de NotiFinance son de uso individual. Si deseas más beneficios, 
              te recomendamos explorar nuestro plan Premium.</Paragraph>
          </Panel>
        </Collapse>
      </div>

      <Footer style={{ background: '#18171c', borderTop: '2px solid #fff', textAlign: 'center', marginTop: 30 }}>
        <Text style={{ color: 'rgba(255,255,255,0.45)' }}>NotiFinance beta</Text>
      </Footer>
    </div>
  );
};

export default Subscription;
