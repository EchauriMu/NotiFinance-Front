import React, { useState } from 'react';
import { Space, Typography, Badge, Button, Card, Skeleton } from 'antd';
import UpdatePlanModal from '../Subscriptions/UpdatePlanModal';

const { Text } = Typography;

const SubscriptionInfo = ({ userData, loading }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card style={{ border: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text style={{ color: '#8c8c8c' }}>Plan Actual</Text>

            <Badge
              status="success"
              text={
                <Text style={{ color: 'white' }}>
                  {userData?.role === 'basic'
                    ? 'Plan Freemium'
                    : userData?.role === 'premium'
                    ? 'Plan Premium'
                    : 'Plan Organization'}
                </Text>
              }
            />

            <Text type="secondary" style={{ fontSize: '12px' }}>
              Válido hasta: {new Date(userData?.subscriptionEndDate || '2025-03-15').toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>

            <Button type="link" size="small" block onClick={() => setModalOpen(true)}>
              Actualizar Plan
            </Button>
          </Space>
        )}
      </Card>

      <UpdatePlanModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default SubscriptionInfo;
