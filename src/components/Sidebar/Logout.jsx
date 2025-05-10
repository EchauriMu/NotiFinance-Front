import React from 'react';
import { Button, message, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const LogoutButton = ({ containerStyle = {}}) => {
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
      localStorage.removeItem('userRole');
      
      message.success('Has cerrado sesión correctamente');
      
      // Simplemente recargamos la página en lugar de usar navigate
      window.location.reload();
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Aún así, limpiamos los datos locales
      sessionStorage.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      message.error('Error al cerrar sesión');
      
      // Recargamos la página incluso si hubo un error
      window.location.reload();
    }
  };

  return (
    <div style={{ ...containerStyle }}>
      <Button 
        type="primary" 
        danger 
        icon={<LogoutOutlined />} 
        onClick={handleLogout}
        block
        style={{ background: '#141414', borderColor: '#ff4d4f' }}
      >
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default LogoutButton;