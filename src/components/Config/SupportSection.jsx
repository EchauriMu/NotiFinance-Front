// src/components/SupportSection.js
import React from 'react';
import { Button, Row, Col } from 'antd';
import {
  QuestionCircleOutlined,
  FileTextOutlined,
  ContainerTwoTone,
  QuestionCircleTwoTone,
  MessageTwoTone,
  DollarTwoTone,

} from '@ant-design/icons';

const SupportSection = () => {
  const handleRedirect = (url) => {
    window.open(url, '_blank');
  };

  const buttons = [
    {
      label: 'Centro de ayuda',
      icon: <QuestionCircleTwoTone  style={{ fontSize: '20px',}}/>,
      url: '/ayuda',
    },
    {
      label: 'Contáctanos',
      icon: <MessageTwoTone style={{ fontSize: '20px',}} twoToneColor="#52c41a"/>,
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=notifinance.mx@gmail.com',
    },
    {
      label: 'Condiciones y Políticas',
      icon: <ContainerTwoTone twoToneColor="#eb2f96" style={{ fontSize: '20px',}}/>,
      url: '/terminos',
    },
    {
      label: 'Informacion de mercado',
      icon: <DollarTwoTone style={{ fontSize: '20px',}} twoToneColor="gold"/>,
      url: '/list',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {buttons.map((btn, index) => (
        <Col xs={24} sm={12} key={index}>
          <Button
            icon={btn.icon}
            block
            onClick={() => handleRedirect(btn.url)}
          >
            {btn.label}
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export default SupportSection;
