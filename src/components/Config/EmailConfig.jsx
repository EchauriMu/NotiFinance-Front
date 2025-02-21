// EmailConfig.js
import React from 'react';
import { Card, Badge } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const EmailConfig = () => {
 // Obtener el email desde sessionStorage
 const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
 const email = userData.email || 'No disponible';
 
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <MailOutlined style={{ fontSize: '24px', color: '#1890FF' }} />
          <strong style={{ marginLeft: '8px' }}>Correo</strong>
        </div>
        <Badge count="Activo" style={{ backgroundColor: '#52c41a' }} />
      </div>
      <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 'bold' }}>{email}</div>
    </Card>
  );
};

export default EmailConfig;
