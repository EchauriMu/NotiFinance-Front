import React, { useEffect, useState } from 'react';
import { Modal, Typography, Spin, notification, Switch, Card, Space, Badge, Tag, Divider, } from 'antd';
import axiosInstance from '../../api/axiosInstance'; // Asegúrate de tener esta instancia de axios configurada correctamente

const { Title } = Typography;

const BillingSettingsModal = ({ open, onClose }) => {
  const { Title, Text } = Typography; // Correct way to import Text from Typography

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false); // Estado para la renovación automática

  useEffect(() => {
    if (open) {
      fetchPaymentInfo(); // Cuando el modal se abre, traemos los datos
    }
  }, [open]);

  const fetchPaymentInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/subs/me/active');
      setPaymentInfo(response.data); // Guardamos la suscripción activa en el estado
      setAutoRenew(response.data.autoRenew); // Asignamos el valor de autoRenew desde la API
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error al cargar la suscripción',
        description: error.response?.data?.message || 'Hubo un problema al cargar la información de tu suscripción.',
      });
    }
  };

  const renderStatusBadge = (status) => {
    let color;
    switch (status) {
      case 'active':
        color = 'green';
        break;
      case 'expired':
        color = 'red';
        break;
      case 'canceled':
        color = 'volcano';
        break;
      case 'trial':
        color = 'blue';
        break;
      default:
        color = 'grey';
    }
    return <Badge color={color} text={status} />;
  };

  return (
    <Modal
      title="Configuración de Facturación"
      open={open}
      onCancel={onClose} // Solo habilitamos el cierre por el botón de cancelación
      footer={null} // Eliminamos el pie de página (donde están los botones Ok y Cancel)
      width={600}
    >
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
          </div>
        ) : paymentInfo ? (
          <div>
            {/* Información de la suscripción */}
            <Title level={4}>Detalles de la Suscripción</Title>
            <Card bordered={false} style={{ marginBottom: 20 }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Información del Plan */}
                <div>
                  <Text strong>Plan:</Text> <Text>{paymentInfo.plan}</Text>
                </div>
                <Divider />
                {/* Estado de la Suscripción */}
                <div>
                  <Text strong>Estado:</Text> <Space>{renderStatusBadge(paymentInfo.status)}</Space>
                </div>
              </Space>
            </Card>

            {/* Detalles de la tarjeta de crédito */}
            <Title level={4}>Detalles de Pago</Title>
            <Card bordered={false} style={{ marginBottom: 20 }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Método de Pago:</Text> <Text>Tarjeta de Crédito (TC)</Text>
                </div>
                <div>
                  <Text strong>Últimos 4 dígitos de la tarjeta:</Text> <Tag>{paymentInfo.last4}</Tag>
                </div>
                <div>
                  <Text strong>Fecha de Expiración:</Text> <Tag>{paymentInfo.FC || 'No disponible'}</Tag>
                </div>
              </Space>
            </Card>

            {/* Fechas de la Suscripción */}
            <Title level={4}>Fechas de la Suscripción</Title>
            <Card bordered={false} style={{ marginBottom: 20 }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Fecha de inicio:</Text> <Text>{new Date(paymentInfo.startedAt).toLocaleDateString()}</Text>
                </div>
                <div>
                  <Text strong>Fecha de expiración:</Text> <Text>{new Date(paymentInfo.expiresAt).toLocaleDateString()}</Text>
                </div>
              </Space>
            </Card>

            {/* Renovación Automática */}
            <Title level={4}>Renovación Automática</Title>
            <Card bordered={false} style={{ marginBottom: 20 }}>
              <div style={{ marginBottom: 20 }}>
                <Text strong>¿Activar renovación automática?</Text>
                <Switch 
                  checked={autoRenew} 
                  onChange={(checked) => setAutoRenew(checked)} 
                  style={{ marginLeft: 10 }} 
                />
                {autoRenew ? (
                  <Text style={{ color: 'green', marginLeft: 10 }}>Renovación automática activada</Text>
                ) : (
                  <Text style={{ color: 'red', marginLeft: 10 }}>Renovación automática desactivada</Text>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <Text>No hay información de suscripción activa.</Text>
        )}
      </div>
    </Modal>
  );
};

export default BillingSettingsModal;
