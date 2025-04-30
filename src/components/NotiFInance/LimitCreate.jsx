// components/LimitReachedModal.jsx
import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const LimitReachedModal = ({ visible, onClose }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/subscription');
    onClose();
  };

  return (
    <Modal
      title="Límite de Alertas Alcanzado"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cerrar</Button>,
        <Button key="changePlan" type="primary" onClick={handleRedirect}>
          Cambiar mi plan
        </Button>
      ]}
      centered
    >
      <Title level={4}>Has alcanzado el número máximo de alertas permitidas.</Title>
      <Paragraph>Tu plan actual no permite crear más alertas. Para obtener más alertas, actualiza tu plan.</Paragraph>
    </Modal>
  );
};

export default LimitReachedModal;
