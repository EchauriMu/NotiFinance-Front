import React from 'react';
import { Space, Typography, Skeleton, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Text } = Typography;

const styles = {
  statsCard: {
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    background: '#141414',
  }
};

const NotificationsStatus = ({ loading, notificationSettings }) => {
  return (
    <div style={styles.statsCard}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space align="center">
            <BellOutlined style={{ color: '#52c41a', fontSize: '22px' }} />
            <Text style={{ color: 'white' }}>Notificaciones</Text>
          </Space>
          <Badge status={notificationSettings.email ? "success" : "error"} text={<Text style={{ color: 'white' }}>Email {notificationSettings.email ? 'Registrado' : 'Sin registrar'}</Text>} />
          <Badge status={notificationSettings.whatsapp ? "success" : "error"} text={<Text style={{ color: 'white' }}>Whatsapp {notificationSettings.whatsapp ? 'Registrado' : 'Sin registrar'}</Text>} />
          <Badge status={notificationSettings.discord ? "success" : "error"} text={<Text style={{ color: 'white' }}>Discord {notificationSettings.discord ? 'Registrado' : 'Sin registrar'}</Text>} />
        </Space>
      )}
    </div>
  );
};

export default NotificationsStatus;
