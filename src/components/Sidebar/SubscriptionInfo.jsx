import React from 'react';
import { Space, Typography, Badge, Button, Card, Skeleton } from 'antd';

const { Text } = Typography;

const SubscriptionInfo = ({ userData, loading }) => {
  return (
    <Card style={{ border: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text style={{ color: '#8c8c8c' }}>Plan Actual</Text>
          
          {/* Dependiendo del role, se muestra el plan correspondiente */}
          <Badge
            status="success"
            text={<Text style={{ color: 'white' }}>{userData?.role === 'basic' ? 'Plan Básico' : 'Plan Pro'}</Text>}
          />
          
          <Text type="secondary" style={{ fontSize: '12px' }}>Válido hasta: 15 Mar 2025</Text>
          <Button type="link" size="small" block>Actualizar Plan</Button>
        </Space>
      )}
    </Card>
  );
};

export default SubscriptionInfo;
