import React from 'react';
import { Button, message, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const LogoutButton = () => {
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
      
      // Simplemente recargamos la página en lugar de usar navigate
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
    <div style={{ 
      marginTop: '20px', 
      padding: '15px 0', 
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
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