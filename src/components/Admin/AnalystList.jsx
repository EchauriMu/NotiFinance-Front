// src/components/Admin/AnalystList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Spin, Empty, Typography, Tooltip, notification, Button, Space, Modal as AntdModal } from 'antd'; // Modal añadido para confirmación
import { DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
// dayjs ya no es necesario si no muestras fechas
// import dayjs from 'dayjs'; 

const { Title } = Typography;

const AnalystList = () => {
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Para el botón de revocar

  // Estados para el modal de confirmación de revocación
  const [isRevokeModalVisible, setIsRevokeModalVisible] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState(null); // Guardará el ID y nombre del usuario

  const fetchAnalysts = async () => {
    setLoading(true);
    try {
      // Asegúrate que el backend devuelva al menos _id, username, email para cada analista
      const response = await axiosInstance.get('/admin/analysts');
      setAnalysts(response.data);
    } catch (error) {
      console.error("Error fetching analysts:", error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'No se pudo cargar la lista de analistas.',
        placement: 'topRight',
      });
      setAnalysts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysts();
  }, []);

  const showRevokeConfirmModal = (user) => {
    setUserToRevoke(user); // Guardamos el objeto completo del usuario o al menos su _id y username
    setIsRevokeModalVisible(true);
  };

  const handleCancelRevoke = () => {
    setIsRevokeModalVisible(false);
    setUserToRevoke(null);
  };

  const handleConfirmRevokeRole = async () => {
    if (!userToRevoke) return;
    const userIdToRevoke = userToRevoke._id; 

    setActionLoading(true);
    try {
      // Llamada real al backend
      const response = await axiosInstance.patch(`/admin/users/${userIdToRevoke}/revoke-analyst-role`);
      
      notification.success({ 
        message: 'Rol Revocado', 
        description: response.data.message || `El rol de analista para ${userToRevoke.username} ha sido revocado.`, // Usar mensaje del backend
        placement: 'topRight',
      });
      fetchAnalysts(); // Recargar la lista para reflejar el cambio
    } catch (error) {
      console.error("Error al revocar rol:", error);
      notification.error({ 
        message: 'Error al Revocar Rol', 
        description: error.response?.data?.message || 'No se pudo revocar el rol del analista.',
        placement: 'topRight',
      });
    } finally {
      setActionLoading(false);
      setIsRevokeModalVisible(false);
      setUserToRevoke(null);
    }
};


  const columns = [
    { 
      title: 'Nombre de Usuario', 
      dataIndex: 'username', 
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Rol',
      key: 'role',
      render: () => <Tag color="blue">Analista</Tag>, // Todos en esta lista son analistas
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Revocar rol de analista">
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => showRevokeConfirmModal(record)} // Pasar el 'record' completo o al menos el _id y username
              disabled={actionLoading} // Comentado para que esté habilitado para pruebas
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading && analysts.length === 0) { // Muestra Spin solo si está cargando y no hay datos previos
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" tip="Cargando analistas..." /></div>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
  
      <Table
        columns={columns}
        dataSource={analysts}
        rowKey="_id" // Asegúrate que tu backend devuelva _id para cada analista
        loading={loading}
        locale={{ emptyText: <Empty description="No hay analistas registrados." /> }}
        size="small"
        style={{overflowY: 'auto'}} // Estilo para scroll
      />

      {/* Modal de Confirmación para Revocar Rol */}
      <AntdModal
        title="Confirmar Revocación de Rol"
        open={isRevokeModalVisible}
        onOk={handleConfirmRevokeRole}
        onCancel={handleCancelRevoke}
        confirmLoading={actionLoading}
        okText="Sí, revocar rol"
        cancelText="No, cancelar"
        okButtonProps={{ danger: true }}
      >
        <p>
          ¿Estás seguro de que quieres revocar el rol de analista para el usuario 
          <strong> {userToRevoke?.username || 'seleccionado'}</strong>?
        </p>
        <p>Esta acción cambiará su rol a 'basic' y perderá los privilegios de analista.</p>
      </AntdModal>
    </div>
  );
};

export default AnalystList;