import React, { useState } from 'react';
import { Button, Space, Modal, Form, Input, message, notification, Divider, Row, Col } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import MediaSettingsModal from './MediaSettingsModal';
import BillingSettingsModal from './BillingSettingsModal';
import SupportSection from './SupportSection';

const ProfileSettings = () => {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [formName] = Form.useForm();
  const [formPasswordRecovery] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSessionEndingModalOpen, setIsSessionEndingModalOpen] = useState(false);

  const handleNameSubmit = async () => {
    try {
      const values = await formName.validateFields();
      await axiosInstance.patch('/config/change-username', {
        newUsername: values.name,
      });
      message.success('Nombre actualizado correctamente');
      setIsSessionEndingModalOpen(true);
    } catch (error) {
      console.error('Error actualizando nombre:', error);
      message.error(error.response?.data?.message || 'Error al actualizar el nombre');
    }
  };

  const handlePasswordRecoverySubmit = async () => {
    try {
      const values = await formPasswordRecovery.validateFields();
      setLoading(true);
      const response = await axiosInstance.post('/reset/send', {
        username: values.username,
      });

      if (response.status === 200) {
        notification.success({
          message: 'Correo enviado',
          description: 'Revisa tu correo electrónico para restablecer tu contraseña.',
          placement: 'bottomRight',
        });
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

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      sessionStorage.clear();
      localStorage.removeItem('token');
      message.success('Has cerrado sesión correctamente');
      window.location.reload();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      sessionStorage.clear();
      localStorage.removeItem('token');
      message.error('Error al cerrar sesión');
      window.location.reload();
    }
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 0 }}>
        {/* Configuración de Perfil */}
        <Divider style={{ margin: 0 }} orientation="left">Configuración de Perfil</Divider>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Button type="primary" block onClick={() => setIsNameModalOpen(true)}>
              Cambiar Nombre
            </Button>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Button type="default" block onClick={() => setIsPasswordModalOpen(true)}>
              Recuperar Contraseña
            </Button>
          </Col>
        </Row>


        {/* Configuración de Facturación */}
        <Divider style={{ margin: 0 }} orientation="left">Configuración de Plan</Divider>
        <Button type="default" block onClick={() => setIsBillingModalOpen(true)}>
          Abrir Configuración de Plan
        </Button>
        <Divider style={{ margin: 0 }} orientation="left">Soporte</Divider>
        <SupportSection />
      </Space>

      {/* Modales */}
      <Modal
        title="Cambiar Nombre"
        open={isNameModalOpen}
        onOk={handleNameSubmit}
        onCancel={() => {
          setIsNameModalOpen(false);
          formName.resetFields();
        }}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={formName} layout="vertical">
          <Form.Item
            label="Nuevo Nombre"
            name="name"
            rules={[{ required: true, message: 'Por favor ingresa tu nuevo nombre' }]}
          >
            <Input placeholder="Escribe tu nuevo nombre" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Recuperar Contraseña"
        open={isPasswordModalOpen}
        onOk={handlePasswordRecoverySubmit}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          formPasswordRecovery.resetFields();
        }}
        okText="Enviar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: loading }}
      >
        <Form form={formPasswordRecovery} layout="vertical">
          <Form.Item
            label="Nombre de Usuario"
            name="username"
            rules={[{ required: true, message: 'Ingresa tu nombre de usuario' }]}
          >
            <Input placeholder="Tu nombre de usuario" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de sesión */}
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

      {/* Modales externos */}
      <MediaSettingsModal open={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} />
      <BillingSettingsModal open={isBillingModalOpen} onClose={() => setIsBillingModalOpen(false)} />
    </>
  );
};

export default ProfileSettings;

