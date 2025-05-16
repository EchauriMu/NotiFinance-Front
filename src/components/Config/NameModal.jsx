import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import SessionEndingModal from './SessionEndingModal'; // Importa el modal externo

const NameModal = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [isSessionEndingModalOpen, setIsSessionEndingModalOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await axiosInstance.patch('/config/change-username', {
        newUsername: values.name,
      });
      message.success('Nombre actualizado correctamente');
      setIsSessionEndingModalOpen(true); // Abre el modal externo
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al actualizar el nombre';
      if (msg.includes('E11000 duplicate key error')) {
        message.error('Nombre de usuario ya en uso');
      } else {
        message.error(msg);
      }
    }
  };

  return (
    <>
      <Button type="primary" block onClick={() => setOpen(true)}>
        Cambiar Nombre
      </Button>
      <Modal
        title="Cambiar Nombre de Usuario"
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nuevo Nombre"
            name="name"
            rules={[
              { required: true, message: "Ingresa tu usuario" },
              {
                pattern: /^[a-zA-Z0-9_.-]+$/,
                message: "El nombre de usuario solo puede contener letras, números, guiones bajos (_), puntos (.) o guiones (-).",
              },
              {
                max: 20,
                message: "El nombre de usuario no puede tener más de 20 caracteres.",
              },
            ]}
          >
            <Input placeholder="Escribe tu nuevo nombre" />
          </Form.Item>
        </Form>
      </Modal>
      {/* Usa el modal externo y pásale el control de visibilidad */}
      <SessionEndingModal
        isSessionEndingModalOpen={isSessionEndingModalOpen}
        setIsSessionEndingModalOpen={setIsSessionEndingModalOpen}
      />
    </>
  );
};

export default NameModal;