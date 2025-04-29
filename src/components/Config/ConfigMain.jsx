// ConfigMain.js
import React, { useState } from 'react';
import { Row, Col, Card, Alert,Space,Typography } from 'antd';
import EmailConfig from './EmailConfig';
import WhatsAppConfig from './WhatsAppConfig';
import DiscordConfig from './DiscordConfig';
import {SettingOutlined}  from '@ant-design/icons';
import ProfileSettings from './Setting';


const { Title, Text } = Typography;

const ConfigMain = () => {
  return (
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Alert
            message="Configuración"
            description="Administra la verificación de tus medios de notificación."
            type="info"
            showIcon
          />
        </Col>
        <Col xs={24} md={12}>
          <Card title="Medios de Notificación" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={24}><EmailConfig /></Col>
              <Col span={24}><WhatsAppConfig /></Col>
              <Col span={24}><DiscordConfig /></Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}  xs={24} md={12}>
        <Card title='Configuracion del perfil' style={{height:'100%'}}>
        <SettingOutlined style={{ fontSize: '24px', color: '#1890FF' }} />
      <ProfileSettings/>
    
        </Card>
      </Col>
      </Row>
   
  );
};

export default ConfigMain;
