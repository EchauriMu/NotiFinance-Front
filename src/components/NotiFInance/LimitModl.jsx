import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const LimitAlertModal = ({ visible, onClose }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    // Redirige al usuario a la página de suscripciones
    navigate('/subscription');
    onClose(); // Cierra el modal
  };

  return (
    <Modal
      title="Límite de Alertas Activadas"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cerrar
        </Button>,
        <Button key="changePlan" type="primary" onClick={handleRedirect}>
          Cambiar mi plan
        </Button>,
      ]}
      centered
    >
      <Typography>
        <Title level={4}>Has alcanzado el límite de alertas activas.</Title>
        <Paragraph>
          Para seguir agregando alertas activas, necesitas cambiar a un plan superior. Haz clic en el botón para gestionar tu suscripción y obtener más alertas activas.
        </Paragraph>
      </Typography>
    </Modal>
  );
};

export default LimitAlertModal;
