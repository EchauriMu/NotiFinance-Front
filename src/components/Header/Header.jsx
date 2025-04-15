import React, { useState, useEffect } from 'react';
import { Row, Col, Space, Button } from 'antd';
import { DotChartOutlined,TeamOutlined, AppstoreAddOutlined, CalendarOutlined, NotificationOutlined } from '@ant-design/icons';

const sections = ['dashboard', 'monedas', 'notifinance', 'configuracion'];

const CryptoHeader = ({ setActiveSection, activeSection }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // Comprobar al principio

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const buttonStyle = (section) => ({
    borderBottom: activeSection === section ? '4px solid orange' : 'none',
  });

  const renderButton = (section, label, icon) => (
    <Button
      key={section}
      type="text"
      onClick={() => setActiveSection(section)}
      icon={icon}
      style={buttonStyle(section)}
    >
      {label}
    </Button>
  );

  return (
    <header
      style={{
        backgroundColor: '#141414',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        height: 'auto',
      }}
    >
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={16}>
          <Space
            size="large"
            wrap
            style={{
              marginLeft: isMobile ? 0 : 40,
              textAlign: isMobile ? 'center' : 'initial',
            }}
          >
            {sections
              .filter((section) => section !== 'analitics')
              .map((section) => (
                <Button
                  key={section}
                  type="text"
                  onClick={() => setActiveSection(section)}
                  style={buttonStyle(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              ))}
          </Space>
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: 'center', marginTop: '8px' }}>
          <Space wrap>
            {renderButton('analitics', 'Analitics', <DotChartOutlined />)}
            {renderButton('calendario', 'Calendario', <CalendarOutlined />)}
            {renderButton('noticias', 'Noticias!', <NotificationOutlined />)}
          </Space>
        </Col>
      </Row>
    </header>
  );
};

export default CryptoHeader;
