// components/ServiceNotRegisteredModal.jsx
import React from 'react';
import { Modal, Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ServiceNotRegisteredModal = ({ visible, onClose }) => (
  <Modal
    title="Servicio No Registrado"
    open={visible}
    onCancel={onClose}
    footer={[
      <Button key="ok" type="primary" onClick={onClose}>
        Entendido
      </Button>
    ]}
    centered
  >
    <Title level={4}>Aún no has registrado un servicio de notificación.</Title>
    <Paragraph>Ve a Configuración y registra el servicio deseado antes de crear alertas.</Paragraph>
  </Modal>
);

export default ServiceNotRegisteredModal;
