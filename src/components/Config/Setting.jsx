import React, { useState } from 'react';
import { Button, Space, Modal, Form, Input, message, Spin, notification } from 'antd';
import axiosInstance from '../../api/axiosInstance'; // Tu instancia de Axios

const ProfileSettings = () => {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [formName] = Form.useForm();
  const [formPasswordRecovery] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSessionEndingModalOpen, setIsSessionEndingModalOpen] = useState(false); // Para el modal de aviso de sesión

  const handleNameSubmit = async () => {
    try {
      const values = await formName.validateFields();

      await axiosInstance.patch('/config/change-username', {
        newUsername: values.name, // Solo enviamos el newUsername
      });

      message.success('Nombre actualizado correctamente');
      
      // Mostrar modal de aviso de cierre de sesión
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

        // Mostrar modal de aviso de cierre de sesión
        setIsSessionEndingModalOpen(true);
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
      // Llamada al endpoint de logout para limpiar la cookie
      await axiosInstance.post('/auth/logout');
      
      // Eliminar datos de sessionStorage
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('notificationSettings');
      sessionStorage.removeItem('watchlist');
      
      // Eliminar token de localStorage si existe
      localStorage.removeItem('token');
      
      message.success('Has cerrado sesión correctamente');
      
      // Recargamos la página
      window.location.reload();
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Aún así, limpiamos los datos locales
      sessionStorage.clear();
      localStorage.removeItem('token');
      
      message.error('Error al cerrar sesión');
      
      // Recargamos la página incluso si hubo un error
      window.location.reload();
    }
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 20 }}>
        <Button type="primary" block onClick={() => setIsNameModalOpen(true)}>
          Cambiar Nombre
        </Button>
        <Button type="default" block onClick={() => setIsPasswordModalOpen(true)}>
          Recuperar Contraseña
        </Button>
      </Space>

      {/* Modal para cambiar nombre */}
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
            rules={[{ required: true, message: 'Por favor ingresa tu nuevo nombre' }]}>
            <Input placeholder="Escribe tu nuevo nombre" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para recuperación de contraseña */}
      <Modal
        title="Recuperar Contraseña"
        open={isPasswordModalOpen}
        onOk={handlePasswordRecoverySubmit} // Se ejecuta la misma función
        onCancel={() => {
          setIsPasswordModalOpen(false);
          formPasswordRecovery.resetFields();
        }}
        okText="Enviar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: loading }} // Deshabilitamos el botón mientras cargamos
      >
        <Form form={formPasswordRecovery} layout="vertical">
          <Form.Item
            label="Nombre de Usuario"
            name="username"
            rules={[{ required: true, message: 'Ingresa tu nombre de usuario' }]}>
            <Input placeholder="Tu nombre de usuario" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de aviso de cierre de sesión y recarga de página */}
      <Modal
        title="Aviso"
        open={isSessionEndingModalOpen}
        onOk={() => {
          handleLogout(); // Cerrar sesión y recargar
          setIsSessionEndingModalOpen(false); // Cerrar el modal
        }}
        onCancel={() => setIsSessionEndingModalOpen(false)} // Simplemente cerramos el modal sin hacer nada
        okText="OK"
        cancelButtonProps={{ style: { display: 'none' } }} // Ocultamos el botón de cancelar
      >
        <p>Tu sesión se cerrará y la página se recargará. ¡Gracias por usar la aplicación!</p>
      </Modal>
    </>
  );
};

export default ProfileSettings;
