import React, { useState } from 'react';
import { Modal, Button, notification } from 'antd';
import axiosInstance from '../../api/axiosInstance';

const PasswordRecoveryModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/reset/send-auth'); //

      if (response.status === 200) {
        notification.success({
          message: 'Correo enviado',
          description: 'Revisa tu correo electrónico para restablecer tu contraseña.',
          placement: 'bottomRight',
        });
        setOpen(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocurrió un error al enviar el correo';
      notification.error({
        message: 'Error',
        description: errorMessage,
        placement: 'bottomRight',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="default" block onClick={() => setOpen(true)}>
        Cambiar Contraseña
      </Button>
      <Modal
        title="Recuperar Contraseña"
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="Enviar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: loading }}
      >
        <p>¿Deseas solicitar el cambio de contraseña? Se enviará un correo a tu cuenta registrada.</p>
      </Modal>
    </>
  );
};

export default PasswordRecoveryModal;