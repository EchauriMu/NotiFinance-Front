import React from 'react';
import { Row, Col, Space, Button } from 'antd';
import { TeamOutlined, ShareAltOutlined } from '@ant-design/icons';

const sections = ['dashboard', 'monedas', 'notifinance', 'configuracion'];

const CryptoHeader = ({ setActiveSection }) => {
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
          <Space size="large" wrap style={{marginLeft:40}}>
            {sections.map((section) => (
              <Button key={section} type="text" onClick={() => setActiveSection(section)}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Button>
            ))}
          </Space>
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: 'right', marginTop: '8px' }}>
          <Space wrap>
            <Button icon={<TeamOutlined />}>Analitics</Button>
            <Button icon={<ShareAltOutlined />} />
            <Button type="primary">Nose</Button>
          </Space>
        </Col>
      </Row>
    </header>
  );
};

export default CryptoHeader;
