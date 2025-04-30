import React, { useEffect, useState } from 'react';
import { Card, Tag, Typography, Button, Alert, Tooltip, Skeleton, message, notification } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import { MailOutlined, WhatsAppOutlined, DiscordOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import LimitAlertModal from './LimitModl';

const { Text } = Typography;

const getStatus = (isActive, isFulfilled) => isFulfilled ? 'Cumplida' : !isActive ? 'Inactiva' : 'Activa';
const statusColor = { Activa: 'green', Cumplida: 'blue', Inactiva: 'red' };
const typeIcons = { email: <MailOutlined />, whatsapp: <WhatsAppOutlined />, discord: <DiscordOutlined /> };

const UserAlerts = ({ refresh }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/alert/get/id');
        setAlerts(response.data);
      } catch (err) {
        const errorCode = err.response?.data?.code;
        let errorMessage = 'Error al cargar alertas.';

        // Manejo de errores por código
        if (errorCode === 'NONE_ALERTS') {
          errorMessage = 'No tienes alertas disponibles en este momento.';
        } else if (errorCode === 'NO_ALERT_SERVICE') {
          errorMessage = 'No tienes un servicio de alerta disponible para este tipo.';
        } else if (errorCode === 'LIMIT_ERROR') {
          errorMessage = 'Ya alcanzaste el límite de alertas activas permitido en tu plan.';
          setModalVisible(true); // Mostrar el modal cuando se alcanza el límite
        }

     

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [refresh]);

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

      // Mostrar notificación de error para cualquier tipo de error
      const errorCode = error.response?.data?.code;
      let errorMessage = 'Error al actualizar la alerta.';

      // Manejo de errores
      if (errorCode === 'LIMIT_ERROR') {
        errorMessage = 'Ya alcanzaste el límite de alertas activas permitido en tu plan.';
        setModalVisible(true); // Mostrar el modal cuando se alcanza el límite
      }
      else if (errorCode === 'INTERNAL_ERROR') {
        errorMessage = 'Ha ocurrido un error interno en el servidor.';
      }


    }
  };

  // Mostrar el Skeleton cuando está cargando
  if (loading) {
    return (
      <Card title="Alertas del Usuario" style={{ marginBottom: 24 }}>
        <Skeleton active />
      </Card>
    );
  }

  // Si hay un error, mostramos el Alert
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
                  <Text type="secondary">
                    Creada el: {dayjs(alert.createdAt).format('DD/MM/YYYY')}
                  </Text>
                </div>

                <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* Tag de estado (Activa/Inactiva/Cumplida) */}
                  <Tag color={statusColor[status]} style={{ fontSize: 14 }}>
                    {status}
                  </Tag>

                  {/* Tag de cumplimiento (Cumplida/No Cumplida) */}
                  <Tag color={alert.isFulfilled ? 'blue' : 'blue'} style={{ fontSize: 14 }}>
                    {alert.isFulfilled ? 'Cumplida' : 'No Cumplida'}
                  </Tag>
                </div>

                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => toggleActiveStatus(alert._id, alert.isActive)}
                    style={{ padding: '0 8px', fontSize: 12 }}
                  >
                    {alert.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Mostrar el modal cuando haya un error de límite de alertas activas */}
      <LimitAlertModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
};

export default UserAlerts;
