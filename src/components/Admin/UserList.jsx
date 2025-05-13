import React, { useState, useEffect } from 'react';
import { Table, Spin, Empty, Typography, notification, Tag, Button, Popconfirm, Select, Input, Row, Col, Tooltip } from 'antd';
import { DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'; // Importar iconos
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // =========== FETCH A LA API ===========
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/user/all');
      setUsers(response.data.data);
    } catch (error) {
      notification.error({
        message: 'Error al cargar usuarios',
        description: error.response?.data?.message || 'No se pudieron cargar los usuarios.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  // =========== CAMBIAR ROL ===========
  const changeRole = async (userId, newRole) => {
    try {
      await axiosInstance.patch(`/user/role/${userId}`, { role: newRole });
      notification.success({
        message: 'Rol actualizado',
        description: `El rol del usuario ha sido cambiado a ${newRole}.`,
        placement: 'topRight',
      });
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      notification.error({
        message: 'Error al cambiar rol',
        description: error.response?.data?.message || 'No se pudo cambiar el rol del usuario.',
        placement: 'topRight',
      });
    }
  };

  // =========== BLOQUEAR USUARIO ===========
  const blockUser = async (userId) => {
    try {
      await axiosInstance.patch(`/user/delete/soft/${userId}`);
      notification.success({
        message: 'Usuario bloqueado',
        description: 'El usuario ha sido bloqueado exitosamente.',
        placement: 'topRight',
      });
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      notification.error({
        message: 'Error al bloquear usuario',
        description: error.response?.data?.message || 'No se pudo bloquear el usuario.',
        placement: 'topRight',
      });
    }
  };

  // =========== REACTIVAR USUARIO ===========
  const reactivateUser = async (userId) => {
    try {
      await axiosInstance.patch(`/user/reactivate/${userId}`);
      notification.success({
        message: 'Usuario reactivado',
        description: 'El usuario ha sido reactivado exitosamente.',
        placement: 'topRight',
      });
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      notification.error({
        message: 'Error al reactivar usuario',
        description: error.response?.data?.message || 'No se pudo reactivar el usuario.',
        placement: 'topRight',
      });
    }
  };

  // =========== ELIMINAR USUARIO ===========
  const deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/user/delete/hard/${userId}`);
      notification.success({
        message: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado exitosamente.',
        placement: 'topRight',
      });
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      notification.error({
        message: 'Error al eliminar usuario',
        description: error.response?.data?.message || 'No se pudo eliminar el usuario.',
        placement: 'topRight',
      });
    }
  };

  // =========== CICLO DE VIDA ===========
  useEffect(() => {
    fetchUsers();
  }, []);

  // =========== FILTROS ===========
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter !== '' ? user.isActive === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // =========== COLUMNAS DE LA TABLA ===========
  const columns = [
    {
      title: 'Nombre de Usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Select
          defaultValue={role}
          style={{ width: 120 }}
          onChange={(newRole) => changeRole(record._id, newRole)}
        >
          <Option value="admin">Admin</Option>
          <Option value="analist">Analista</Option>
          <Option value="basic">Básico</Option>
        </Select>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'volcano'}>
          {isActive ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip title={record.isActive ? 'Bloquear usuario' : 'Reactivar usuario'}>
            <Popconfirm
              title={`¿Estás seguro de ${record.isActive ? 'bloquear' : 'reactivar'} este usuario?`}
              onConfirm={() => (record.isActive ? blockUser(record._id) : reactivateUser(record._id))}
              okText="Sí"
              cancelText="No"
            >
              <Button
                shape=""
                icon={record.isActive ? <LockOutlined /> : <UnlockOutlined />}
                style={{
                  backgroundColor: record.isActive ? 'ffa500' : '',
                  borderColor: record.isActive ? 'red' : '#52c41a',
                  color: '#fff',
                }}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Eliminar usuario">
            <Popconfirm
              title="¿Estás seguro de eliminar este usuario?"
              onConfirm={() => deleteUser(record._id)}
              okText="Sí"
              cancelText="No"
            >
              <Button
                shape=""
                icon={<DeleteOutlined />}
                style={{
                  backgroundColor: 'red',
                  borderColor: '#ff4d4f',
                  color: '#fff',
                }}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  // =========== CARGANDO ===========
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Cargando usuarios..." />
      </div>
    );
  }

  // =========== RENDER PRINCIPAL ===========
  return (
    <div>
     
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col span={8}>
          <Search
            placeholder="Buscar por nombre"
            onSearch={(value) => setSearchText(value)}
            enterButton
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Filtrar por rol"
            style={{ width: '100%' }}
            onChange={(value) => setRoleFilter(value)}
            allowClear
          >
            <Option value="admin">Admin</Option>
            <Option value="analist">Analista</Option>
            <Option value="basic">Básico</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Select
            placeholder="Filtrar por estado"
            style={{ width: '100%' }}
            onChange={(value) => setStatusFilter(value)}
            allowClear
          >
            <Option value={true}>Activo</Option>
            <Option value={false}>Inactivo</Option>
          </Select>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        locale={{ emptyText: <Empty description="No hay usuarios registrados." /> }}
        size="middle"
        bordered
      />
    </div>
  );
};

export default UserList;
