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
            message="Centro de Configuración"
            description="Gestiona tus medios de notificación, cambia tu nombre de usuario, recupera tu contraseña y administra tus preferencias de cuenta desde esta pestaña."
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
        <Card title='Configuraciones' style={{height:'100%'}}>
      
      <ProfileSettings/>
    
        </Card>
      </Col>
      </Row>
   
  );
};

export default ConfigMain;
