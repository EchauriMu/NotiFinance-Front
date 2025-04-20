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
                  {(() => {
                    switch (userData?.plan?.toLowerCase()) {
                      case 'freemium':
                        return 'Plan Freemium';
                      case 'premium':
                        return 'Plan Premium';
                      case 'notifinance pro':
                        return (
                          <Space>
                            Plan Pro
                            {/* Aquí insertamos el GIF cuando el plan es Pro */}
                            <img
                              src="https://i.gifer.com/origin/18/1881d8691bd9ff18bea62c0a275e1da6_w200.webp"
                              alt="Fuego"
                              style={{ width: 30, height: 40, marginLeft: 0 }}
                            />
                          </Space>
                        );
                      default:
                        return 'Plan Desconocido';
                    }
                  })()}
                </Text>
              }
            />

            <Text type="secondary" style={{ fontSize: '14px' }}>
              Válido hasta:{' '}
              {userData?.subscriptionExpiresAt
                ? new Date(userData.subscriptionExpiresAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Sin fecha'}
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
