import React, { useEffect, useState } from 'react';
import { Modal, Button, Badge, Alert, Typography, Space } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const SubscriptionExpiredNotice = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userDataStr = sessionStorage.getItem('userData');
    if (!userDataStr) return;

    try {
      const userData = JSON.parse(userDataStr);
      const { subscriptionExpiresAt } = userData;

      if (!subscriptionExpiresAt) return;

      const expirationDate = new Date(subscriptionExpiresAt);
      const today = new Date();

      expirationDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const timeDiff = expirationDate - today;
      const daysRemaining = timeDiff / (1000 * 60 * 60 * 24);

      if (daysRemaining === 0) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error al procesar los datos de la suscripción:', error);
    }
  }, []);

  const handleRedirect = () => {
    setShowModal(false);
    navigate('/subscription');
  };

  return (
    <Modal
    width={700}
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>,
        <Button key="redirect" type="primary" danger icon={<WarningOutlined />} onClick={handleRedirect}>
          Actualizar mi plan
        </Button>,
      ]}
 
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
     
          <Alert
            message="Tu plan venció hoy"
            description="Se han desactivado las funciones premium de tu cuenta."
            type="error"
            showIcon
            style={{margin:0 , fontSize:18}}
          />
   
        <div>
          <Title   style={{margin:0}} level={3}>¿Qué ha pasado?</Title>
          <Text style={{margin:0, fontSize:18}} >    
            Hemos desactivado todas las alertas automáticas, reportes programados y cualquier recurso que exceda el plan Freemium.
          </Text>
        </div>

        <div>
          <Title level={3}>¿Qué puedes hacer?</Title>
          <Text style={{margin:0, fontSize:18}} >
            Puedes seguir usando tu cuenta con funciones básicas. Para evitar interrupciones y recuperar tus beneficios, actualiza tu plan cuanto antes.
          </Text>
        </div>
      </Space>
    </Modal>
  );
};

export default SubscriptionExpiredNotice;
