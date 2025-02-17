import React from 'react';
import { Space, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

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

const LastActivity = () => {
  return (
    <div style={styles.statsCard}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space align="center">
          <ClockCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <Text style={{ color: 'white' }}>Última Actividad</Text>
        </Space>
        <Text type="secondary">Bitcoin alcanzó tu precio objetivo</Text>
        <Text style={{ color: '#1890ff' }}>Hace 2 horas</Text>
      </Space>
    </div>
  );
};

export default LastActivity;
