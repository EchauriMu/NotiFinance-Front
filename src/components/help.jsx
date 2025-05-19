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
    <div style={{
      padding: '22px',
      maxWidth: 800,
      margin: '0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>

        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
          <span style={{ color: 'white' }}>Noti</span>
          <span style={{ color: '#ffa500' }}>Finance</span>
        </Title>
      </div>

      <Title >
        Centro de Ayuda y preguntas frecuentes
      </Title>

      <Paragraph style={{ color: '#ccc', marginBottom: 24 }}>
        Aquí encontrarás respuestas a las preguntas más frecuentes sobre el uso de NotiFinance. Si necesitas ayuda personalizada, puedes escribirnos directamente.
      </Paragraph>

      <Collapse accordion
        style={{
          background: '#232323',
          borderRadius: 8,
          border: '1px solid #262626',
          marginBottom: 32
        }}
        expandIconPosition="right"
      >
        <Panel header="¿Qué es NotiFinance?" key="1" style={{ color: '#fff' }}>
          <Paragraph style={{ color: '#ccc' }}>
            Es una plataforma que ofrece notificaciones en tiempo real sobre cambios en el mercado de criptomonedas.
          </Paragraph>
        </Panel>
        <Panel header="¿Cómo configuro mis preferencias de notificación?" key="2" style={{ color: '#fff' }}>
          <Paragraph style={{ color: '#ccc' }}>
            Desde la barra de navegación, accede a la sección de 'NotiFinance' y selecciona las criptos y umbrales que deseas monitorear.
          </Paragraph>
        </Panel>
        <Panel header="¿Es gratis probar NotiFinance?" key="3" style={{ color: '#fff' }}>
          <Paragraph style={{ color: '#ccc' }}>
            Sí, el servicio puede ser gratuito para usuarios registrados con un plan limitado por 12 meses.
          </Paragraph>
        </Panel>
        <Panel header="¿Qué tan seguras están mis notificaciones y datos?" key="4" style={{ color: '#fff' }}>
          <Paragraph style={{ color: '#ccc' }}>
            Aplicamos estándares como ISO/IEC 27001 para garantizar que tus datos estén seguros mediante cifrado y buenas prácticas.
          </Paragraph>
        </Panel>
      </Collapse>

      <div style={{ marginTop: 24 }}>
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
