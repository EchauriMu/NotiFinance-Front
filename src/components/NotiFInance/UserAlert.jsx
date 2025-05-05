import React, { useEffect, useState } from 'react';
import { Card, Tag, Typography, Button, Alert, Tooltip, Skeleton, notification } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import { MailOutlined, WhatsAppOutlined, DiscordOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import LimitAlertModal from './LimitModl';
import io from 'socket.io-client';

const { Text } = Typography;

const getStatus = (isActive, isFulfilled) => isFulfilled ? 'Cumplida' : !isActive ? 'Inactiva' : 'Activa';
const statusColor = { Activa: 'green', Cumplida: 'blue', Inactiva: 'red' };
const typeIcons = { email: <MailOutlined />, whatsapp: <WhatsAppOutlined />, discord: <DiscordOutlined /> };

const UserAlerts = ({ refresh }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userPlan, setUserPlan] = useState('Freemium');

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
      setUserId(userData.id);
      setUserPlan(userData.plan);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io('https://ntwebsocket.onrender.com');
    console.log('conexion a ws correcta!');
    setSocket(newSocket);

    newSocket.emit('subscribeAlerts', userId);

    newSocket.on('alertUpdated', (data) => {

      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert._id === data.alertId
            ? { ...alert, isActive: data.isActive, updatedAt: data.updatedAt ,  isFulfilled: data.isFulfilled }
            : alert
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
  
    fetchAlerts();
  }, [refresh]);

  //traer datois xd
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/alert/get/id');
      setAlerts(response.data);
    } catch (err) {
      const errorCode = err.response?.data?.code;
      let errorMessage = 'Error al cargar alertas.';

      if (errorCode === 'NONE_ALERTS') {
        errorMessage = 'No tienes alertas disponibles en este momento.';
      } else if (errorCode === 'NO_ALERT_SERVICE') {
        errorMessage = 'No tienes un servicio de alerta disponible para este tipo.';
      } else if (errorCode === 'LIMIT_ERROR') {
        errorMessage = 'Ya alcanzaste el límite de alertas activas permitido en tu plan.';
        setModalVisible(true);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (alertId, currentStatus) => {
    try {
      await axiosInstance.patch('/alert/status-change', {
        id: alertId,
        isActive: !currentStatus,
      });
      notification.success({
        message: 'Alerta actualizada correctamente!',
        description: 'La alerta fue cambiada de estado',
        placement: 'bottomRight',
      });

      setAlerts(prev =>
        prev.map(alert =>
          alert._id === alertId ? { ...alert, isActive: !currentStatus } : alert
        )
      );
    } catch (error) {
      console.error(error);
      const errorCode = error.response?.data?.code;
      let errorMessage = 'Error al actualizar la alerta.';

      if (errorCode === 'LIMIT_ERROR') {
        errorMessage = 'Ya alcanzaste el límite de alertas activas permitido en tu plan.';
        setModalVisible(true);
      } else if (errorCode === 'INTERNAL_ERROR') {
        errorMessage = 'Ha ocurrido un error interno en el servidor.';
      }

      notification.error({
        message: 'Error',
        description: errorMessage,
        placement: 'bottomRight',
      });
    }
  };

  const deleteAlert = async(alertId) =>{
    try {
      await axiosInstance.delete(`/alert/delete/${alertId}`);
      notification.success({
        message: 'Alerta Eliminada correctamente!',
        description: 'La alerta fue eliminada',
        placement: 'bottomRight',
      });
      fetchAlerts();
    } catch (error) {
      console.error(error);
      const errorCode = error.response?.data?.code;
      let errorMessage = 'Error al actualizar la alerta.';

      notification.error({
        message: 'Error',
        description: errorMessage,
        placement: 'bottomRight',
      });
    }
    
  }

  if (loading) {
    return (
      <Card title="Alertas del Usuario" style={{ marginBottom: 24 }}>
        <Skeleton active />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        message={error}
        type="info"
        showIcon
        description="Crea tu primer alerta!"
        style={{ fontSize: 14, marginBottom: 15 }}
      />
    );
  }

  return (
    <>
      <Card title="Alertas del Usuario" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {alerts.map((alert, index) => {
            const status = getStatus(alert.isActive);
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
                  position: 'relative'
                }}
                bodyStyle={{ padding: 12 }}
              >
                {/* Botón eliminar (solo si no es Freemium) */}
                {userPlan !== 'Freemium' && (
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="large"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 190,
                      color: '#ff4d4f'
                    }}
                    onClick={() => {deleteAlert(alert._id)}}
                  />
                )}

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
                  <Text type="secondary">
                    Creada el: {dayjs(alert.createdAt).format('DD/MM/YYYY')}
                  </Text>
                </div>

                <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Tag color={statusColor[status]} style={{ fontSize: 14 }}>
                    {status}
                  </Tag>
                  <Tag color={alert.isFulfilled ? 'blue' : 'yellow'} style={{ fontSize: 14 }}>
                    {alert.isFulfilled ? 'Cumplida' : 'No Cumplida'}
                  </Tag>
                </div>

                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => toggleActiveStatus(alert._id, alert.isActive)}
                    style={{
                      padding: '0 8px',
                      fontSize: 12,
                      backgroundColor: alert.isActive ? 'red' : '#6abe39',
                      borderColor: alert.isActive ? 'white' : 'green'
                    }}
                  >
                    {alert.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      <LimitAlertModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
};

export default UserAlerts;
