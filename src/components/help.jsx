// src/components/HelpAndFAQ.js
import React from 'react';
import { Typography, Collapse, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpAndFAQ = () => {
  const handleEmailRedirect = () => {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=notifinance.mx@gmail.com');
  };

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto', backgroundColor: '#1f1f1f', color: 'white', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
          <span style={{ color: 'white' }}>Centro de</span>{' '}
          <span style={{ color: '#fa8c16' }}>Ayuda</span>
                    <span style={{ color: 'white' }}> y preguntas frecuentes</span>{' '}
        </Title>
      </div>

      <Paragraph style={{ color: '#ccc' }}>
        Aquí encontrarás respuestas a las preguntas más frecuentes sobre el uso de NotiFinance. Si necesitas ayuda personalizada, puedes escribirnos directamente.
      </Paragraph>

      <Collapse accordion>
        <Panel header="¿Qué es NotiFinance?" key="1">
          <Paragraph>Es una plataforma que ofrece notificaciones en tiempo real sobre cambios en el mercado de criptomonedas.</Paragraph>
        </Panel>
        <Panel header="¿Cómo configuro mis preferencias de notificación?" key="2">
          <Paragraph>Desde la barra de navegacion, accede a la sección de 'NotiFinance' y selecciona las criptos y umbrales que deseas monitorear.</Paragraph>
        </Panel>
        <Panel header="¿Es gratis probar NotiFinance?" key="3">
          <Paragraph>Sí, el servicio puede ser gratuito para usuarios registrados con un plan limitado por 12 meses.</Paragraph>
        </Panel>
        <Panel header="¿Qué tan seguras están mis notificaciones y datos?" key="4">
          <Paragraph>Aplicamos estándares como ISO/IEC 27001 para garantizar que tus datos estén seguros mediante cifrado y buenas prácticas.</Paragraph>
        </Panel>
      </Collapse>

      <div style={{ marginTop: 32 }}>
        <Title level={4} style={{ color: '#fa8c16' }}>¿Necesitas ayuda personalizada?</Title>
        <Paragraph style={{ color: '#ccc' }}>
          Contáctanos directamente por correo electrónico. Estaremos encantados de ayudarte.
        </Paragraph>
        <Button
          type="primary"
          icon={<MailOutlined />}
          onClick={handleEmailRedirect}
        >
          Escribir a notifinance.mx@gmail.com
        </Button>
      </div>
    </div>
  );
};

export default HelpAndFAQ;
