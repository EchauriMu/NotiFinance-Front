import React, { useState, useEffect } from 'react';
import { Row, Col, Space, Button } from 'antd';
import {
  DotChartOutlined,
  CalendarOutlined,
  NotificationOutlined,
} from '@ant-design/icons';

// =========== SECCIONES PRINCIPALES ===========
const sections = ['dashboard', 'monedas', 'notifinance', 'configuracion'];

const CryptoHeader = ({ setActiveSection, activeSection }) => {
  // =========== ESTADO: DETECCIÓN MÓVIL ===========
  const [isMobile, setIsMobile] = useState(false);

  // =========== EFECTO PARA REVISAR TAMAÑO DE PANTALLA ===========
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Considerar móvil si es <= 768px
    };

    checkMobile(); // Comprobación inicial

    window.addEventListener('resize', checkMobile); // Añadir listener
    return () => window.removeEventListener('resize', checkMobile); // Limpiar listener
  }, []);

  // =========== ESTILO PARA BOTÓN ACTIVO ===========
  const buttonStyle = (section) => ({
    borderBottom: activeSection === section ? '5px solid orange' : 'none',
  });

  // =========== TRADUCCIÓN DE SECCIONES ===========
  const sectionLabels = {
    dashboard: 'Panel Principal',
    monedas: 'Monedas',
    notifinance: 'Notificaciones',
    configuracion: 'Configuración',
    analitics: 'Analistas',
    calendario: 'Calendario',
    noticias: 'Noticias',
  };

  // =========== RENDER DE BOTÓN ===========
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

  // =========== RENDER PRINCIPAL ===========
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
        {/* SECCIÓN DE NAVEGACIÓN IZQUIERDA */}
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
            {sections.map((section) => (
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
                {sectionLabels[section] || section}
              </Button>
            ))}
          </Space>
        </Col>

        {/* SECCIÓN DE ACCIONES DERECHA */}
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
              {renderButton('analitics', sectionLabels['analitics'], <DotChartOutlined />)}
              {renderButton('calendario', sectionLabels['calendario'], <CalendarOutlined />)}
              {renderButton('noticias', sectionLabels['noticias'], <NotificationOutlined />)}
            </Space>
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default CryptoHeader;
