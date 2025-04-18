import React, { useEffect, useState } from 'react';
import { Card, Tag, Typography, Button, Spin, Alert, Tooltip, Skeleton } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import { MailOutlined, WhatsAppOutlined, DiscordOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const getStatus = (isActive, isFulfilled) => {
  if (isFulfilled) return 'Cumplida';
  if (!isActive) return 'Inactiva';
  return 'Activa';
};

const statusColor = {
  Activa: 'green',
  Cumplida: 'blue',
  Inactiva: 'red'
};

const typeIcons = {
  email: <MailOutlined />,
  whatsapp: <WhatsAppOutlined />,
  discord: <DiscordOutlined />
};

const UserAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get('/alert/get/id');
      setAlerts(response.data || []);
    } catch (err) {
      setError('Error al obtener las alertas del usuario.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);


  if (error) return <Alert message={error} type="error" />;

  return (
    <Card title="Alertas del Usuario" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton style={{width:200}} key={index} active loading={loading} paragraph={{ rows: 2}} />
            ))
          : alerts.map((alert, index) => {
              const status = getStatus(alert.isActive, alert.isFulfilled);
              const icon = typeIcons[alert.typeNotification];

              return (
                <Card
                  key={index}
                  size="small"
                  style={{
                    width: 230,
                    padding: 10,
                    borderRadius: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  
                  }}
                  bodyStyle={{ padding: 12 }}
                >
                  <div style={{ marginBottom: 6 }}>
                    <Tag color="gold">{alert.cryptoSymbol}</Tag>{' '}
                    <Text strong>${alert.targetPrice}</Text>
                  </div>
                  <div style={{ fontSize: 16 }}>
                    <Tooltip title={alert.notificationData}>
                      {icon} {alert.typeNotification}
                    </Tooltip>
                  </div>

                  <div style={{ fontSize: 8 }}>
                    <Text type="secondary">Creada el: {dayjs(alert.createdAt).format('DD/MM/YYYY')}</Text>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <Tag color={statusColor[status]} style={{ fontSize: 14 }}>
                      {status}
                    </Tag>
                  </div>
                  <div style={{ marginTop: 6, textAlign:'center' }}>
                  <Button
                    type="link"
                    size="small"
                    href={`#/alerta/${alert.cryptoSymbol.toLowerCase()}`}
                    style={{ padding: 0, fontSize: 12, }}
                  >
                    Ver detalles
                  </Button>
                  </div>
                </Card>
              );
            })}
      </div>
    </Card>
  );
};

export default UserAlerts;
