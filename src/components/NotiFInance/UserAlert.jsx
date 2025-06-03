import React, { useEffect, useState } from 'react';
import {
  Card, Badge, Tag, Typography, Button, Alert, Skeleton, notification, Row, Col
} from 'antd';
import axiosInstance from '../../api/axiosInstance';
import {
  MailOutlined, WhatsAppOutlined, DiscordOutlined, DeleteOutlined
} from '@ant-design/icons';
import LimitAlertModal from './LimitModl';
import io from 'socket.io-client';

// =========== CONSTANTES Y UTILIDADES ===========
const { Text } = Typography;

// Estado textual de la alerta
const getStatus = (isActive, isFulfilled) =>
  isFulfilled ? 'Vendido' : !isActive ? 'Inactiva' : 'Activa';

// Colores para los estados
const statusColor = {
  Activa: 'green',
  Vendido: 'blue',
  Inactiva: 'red'
};

// Iconos por tipo de notificación
const typeIcons = {
  email: <MailOutlined />,
  whatsapp: <WhatsAppOutlined />,
  discord: <DiscordOutlined />
};

// =========== COMPONENTE PRINCIPAL ===========
const UserAlerts = ({ refresh }) => {
  // =========== ESTADOS ===========
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userPlan, setUserPlan] = useState('Freemium');

  // =========== OBTENER DATOS DE USUARIO ===========
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
      setUserId(userData.id);
      setUserPlan(userData.plan);
    }
  }, []);

  // =========== CONEXIÓN WEBSOCKET PARA ALERTAS ===========
  useEffect(() => {
    if (!userId) return;
    const newSocket = io('https://ntwebsocket.onrender.com');
    setSocket(newSocket);
    newSocket.emit('subscribeAlerts', userId);
    newSocket.on('alertUpdated', (data) => {
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert._id === data.alertId
            ? { ...alert, isActive: data.isActive, updatedAt: data.updatedAt, isFulfilled: data.isFulfilled }
            : alert
        )
      );
    });
    return () => { newSocket.disconnect(); };
  }, [userId]);

  // =========== CARGAR ALERTAS ===========
  useEffect(() => { fetchAlerts(); }, [refresh]);

  // =========== FUNCIÓN: CARGAR ALERTAS ===========
  const fetchAlerts = async () => {
    setLoading(true); setError(null);
    try {
      const response = await axiosInstance.get('/alert/get/id');
      setAlerts(response.data);
    } catch (err) {
      const errorCode = err.response?.data?.code;
      let errorMessage = 'Error al cargar alertas.';
      if (errorCode === 'NONE_ALERTS') errorMessage = 'No tienes alertas disponibles en este momento.';
      else if (errorCode === 'NO_ALERT_SERVICE') errorMessage = 'No tienes un servicio de alerta disponible para este tipo.';
      else if (errorCode === 'LIMIT_ERROR') {
        errorMessage = 'Ya alcanzaste el límite de alertas activas permitido en tu plan.';
        setModalVisible(true);
      }
      setError(errorMessage);
    } finally { setLoading(false); }
  };

  // =========== FUNCIÓN: CAMBIAR ESTADO DE ALERTA ===========
  const toggleActiveStatus = async (alertId, currentStatus) => {
    try {
      await axiosInstance.patch('/alert/status-change', { id: alertId, isActive: !currentStatus });
      notification.success({
        message: 'Alerta actualizada correctamente!',
        description: 'La alerta fue cambiada de estado',
        placement: 'bottomRight'
      });
      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === alertId ? { ...alert, isActive: !currentStatus } : alert
        )
      );
    } catch (error) {
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
        placement: 'bottomRight'
      });
    }
  };

  // =========== FUNCIÓN: ELIMINAR ALERTA ===========
  const deleteAlert = async (alertId) => {
    try {
      await axiosInstance.delete(`/alert/delete/${alertId}`);
      notification.success({
        message: 'Alerta Eliminada correctamente!',
        description: 'La alerta fue eliminada',
        placement: 'bottomRight'
      });
      fetchAlerts();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al eliminar la alerta.',
        placement: 'bottomRight'
      });
    }
  };

  // =========== RENDER: CARGANDO O ERROR ===========
  if (loading) {
    return (
      <Card style={{ marginBottom: 24 }}>
        <Skeleton active />
      </Card>
    );
  }
  if (error) {
    return (
      <Card title='Mis alertas' style={{ marginBottom: 24 }}>
        <Alert
          message={error}
          type="info"
          showIcon
          description="Crea tu primer alerta!"
          style={{ fontSize: 14, marginBottom: 15 }}
        />
      </Card>
    );
  }

  // =========== FILTRAR ALERTAS ===========
  const activeAlerts = alerts.filter((alert) => alert.isActive);
  const inactiveAlerts = alerts.filter((alert) => !alert.isActive);

  // =========== RENDER DE CADA ALERTA ===========
  const renderAlertCard = (alert) => {
    const icon = typeIcons[alert.typeNotification];
    return (
      <Card
        key={alert._id}
        size="small"
        style={{
          width: '100%',
          marginBottom: 8,
          borderRadius: 6,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderLeft: alert.isFulfilled ? '3px solid #1890ff' : 'none'
        }}
        bodyStyle={{ padding: '8px 12px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Tag color="gold" style={{ margin: 0 }}>{alert.cryptoSymbol}</Tag>
              <Text style={{ fontSize: '0.8rem', marginTop: 2, marginLeft: 4 }} strong>Objetivo: ${alert.targetPrice}</Text>
            </div>
            <div style={{ fontSize: '1rem', marginTop: 2 }}>
              Medio: {alert.typeNotification} {icon}
            </div>
          </div>
          <Badge
            color={alert.isFulfilled ? 'blue' : 'yellow'}
            text={alert.isFulfilled ? 'Vendido' : 'No Cumplido'}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            <Button
              type="text"
              size="small"
              onClick={() => toggleActiveStatus(alert._id, alert.isActive)}
              style={{
                fontSize: '1rem',
                padding: '0 6px',
                color: alert.isActive ? 'red' : 'green',
                borderColor: alert.isActive ? 'red' : 'green'
              }}
            >
              {alert.isActive ? 'Desactivar' : 'Activar'}
            </Button>
            {userPlan !== 'Freemium' && (
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                style={{ color: '#ff4d4f', padding: 0 }}
                onClick={() => deleteAlert(alert._id)}
              />
            )}
          </div>
        </div>
      </Card>
    );
  };

  // =========== RENDER PRINCIPAL ===========
  return (
    <Card
      title="Mis Alertas"
      style={{
        borderRadius: 8,
        margin: '0px 0px 30px 0px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Row gutter={12}>
          {/* =========== ALERTAS ACTIVAS =========== */}
          <Col xs={24} sm={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: 12, height: 12, backgroundColor: 'green',
                    borderRadius: '50%', marginRight: 6
                  }}></div>
                  <span>Activas</span>
                  <span style={{ marginLeft: 6, color: '#888' }}>{activeAlerts.length}</span>
                </div>
              }
              style={{
                borderRadius: 6,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
              bodyStyle={{
                maxHeight: '65vh',
                overflowY: 'auto',
                padding: '8px'
              }}
              headStyle={{ padding: '8px 12px' }}
              bordered={false}
            >
              {activeAlerts.length > 0 ? (
                activeAlerts.map(renderAlertCard)
              ) : (
                <Alert
                  message="No hay alertas activas"
                  type="info"
                  showIcon
                  style={{ fontSize: 13 }}
                />
              )}
            </Card>
          </Col>
          {/* =========== ALERTAS INACTIVAS =========== */}
          <Col xs={24} sm={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: 12, height: 12, backgroundColor: 'red',
                    borderRadius: '50%', marginRight: 6
                  }}></div>
                  <span>Inactivas</span>
                  <span style={{ marginLeft: 6, color: '#888' }}>{inactiveAlerts.length}</span>
                </div>
              }
              style={{
                borderRadius: 6,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
              bodyStyle={{
                maxHeight: '65vh',
                overflowY: 'auto',
                padding: '8px'
              }}
              headStyle={{ padding: '8px 12px' }}
              bordered={false}
            >
              {inactiveAlerts.length > 0 ? (
                inactiveAlerts.map(renderAlertCard)
              ) : (
                <Alert
                  message="No hay alertas inactivas"
                  type="info"
                  showIcon
                  style={{ fontSize: 13 }}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
      {/* =========== MODAL DE LÍMITE DE ALERTAS =========== */}
      <LimitAlertModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </Card>
  );
};

export default UserAlerts;