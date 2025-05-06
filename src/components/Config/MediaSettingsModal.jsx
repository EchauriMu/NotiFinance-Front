import React from 'react';
import { Modal } from 'antd';

const MediaSettingsModal = ({ open, onClose }) => {
  return (
    <Modal
      title="Configuración de Medios"
      open={open}
      onOk={onClose}
      onCancel={onClose}
      okText="Cerrar"
    >
      <p>Aquí irá la configuración relacionada a medios (futuro contenido).</p>
    </Modal>
  );
};

export default MediaSettingsModal;
