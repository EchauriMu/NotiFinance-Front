import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import axiosInstance from '../../api/axiosInstance';

const SessionEndingModal = ({ isSessionEndingModalOpen, setIsSessionEndingModalOpen }) => {
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      sessionStorage.clear();
      localStorage.removeItem('token');
      message.success('Has cerrado sesión correctamente');
      window.location.reload();
    } catch {
      sessionStorage.clear();
      localStorage.removeItem('token');
      message.error('Error al cerrar sesión');
      window.location.reload();
    }
  };

  return (
    <Modal
      title="Aviso"
      open={isSessionEndingModalOpen}
      onOk={() => {
        handleLogout();
        setIsSessionEndingModalOpen(false);
      }}
      onCancel={() => setIsSessionEndingModalOpen(false)}
      okText="OK"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <p>Tu sesión se cerrará y la página se recargará. ¡Gracias por usar la aplicación!</p>
    </Modal>
  );
};

export default SessionEndingModal;