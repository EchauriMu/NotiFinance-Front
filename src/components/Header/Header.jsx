import React, { useState, useEffect } from 'react';
import { Row, Col, Space, Button } from 'antd';
import { DotChartOutlined, TeamOutlined, AppstoreAddOutlined, CalendarOutlined, NotificationOutlined } from '@ant-design/icons';

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
    borderBottom: activeSection === section ? '5px solid orange' : 'none',
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
      <Row justify="space-between" align="middle" gutter={[0, 12]}>
        <Col xs={24} sm={14}>
          <Space
            size={isMobile ? 'small' : 'large'}
            direction={isMobile ? 'vertical' : 'horizontal'}
            wrap
            style={{
              marginLeft: isMobile ? 0 : 40,
              textAlign: isMobile ? 'center' : 'initial',
              width: '100%',
              justifyContent: isMobile ? 'center' : 'flex-start',
              display: 'flex',
            }}
          >
            {sections
              .filter((section) => section !== 'analitics')
              .map((section) => (
                <Button
                  key={section}
                  type="text"
                  block={isMobile}
                  onClick={() => setActiveSection(section)}
                  style={{
                    ...buttonStyle(section),
                    width: isMobile ? '100%' : 'auto',
                    minWidth: 100,
                  }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              ))}
          </Space>
        </Col>
        <Col xs={24} sm={10} style={{ marginTop: isMobile ? 16 : 8 }}>
          <div
            style={{
              paddingLeft: 16,
              background: 'rgba(20,20,20,0.95)',
              borderRadius: 6,
              display: 'inline-block',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <Space
              wrap
              direction={isMobile ? 'vertical' : 'horizontal'}
              style={{
                borderLeft: '3px solid rgba(255,255,255,0.1)',
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'center' : 'flex-start',
                display: 'flex',
              }}
            >
              {renderButton('analitics', 'Analitics', <DotChartOutlined />)}
              {renderButton('calendario', 'Calendario', <CalendarOutlined />)}
              {renderButton('noticias', 'Noticias!', <NotificationOutlined />)}
            </Space>
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default CryptoHeader;
