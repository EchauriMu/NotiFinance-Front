// src/components/Admin/ApplicationList.jsx
import React, { useState, useEffect } from 'react';
// Importa Modal como componente y notification directamente desde 'antd'
// Si notification directamente no funciona sin el wrapper <App>, necesitarías una alternativa o pasarla por props.
import { Table, Tag, Button, Space, Modal as AntdModal, notification, Spin, Empty, Typography, Tooltip, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';

const { Paragraph } = Typography;

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // Para la carga de la tabla
  const [actionLoading, setActionLoading] = useState(false); // Para la carga de la acción del modal

  // Estados para el Modal de Detalles
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Estados para el Modal de Confirmación de Acción
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [currentActionInfo, setCurrentActionInfo] = useState({
    applicationId: null,
    action: '', // 'approve' o 'reject'
    actionText: '',
    title: '',
    content: '',
  });

  // --- Funciones para el Modal de Detalles ---
  const showDetailsModal = (record) => {
    setSelectedApplicationDetails(record);
    setIsDetailModalVisible(true);
  };
  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
  };

  // --- Funciones para el Modal de Confirmación de Acción ---
  const showConfirmModal = (applicationId, actionType) => {
    const actionText = actionType === 'approve' ? 'aprobar' : 'rechazar';
    setCurrentActionInfo({
      applicationId,
      action: actionType,
      actionText,
      title: `Confirmar ${actionText}`,
      content: `¿Estás seguro de que quieres ${actionText} esta solicitud?` +
               (actionType === 'approve' ? ' Esto cambiará el rol del usuario a "analist".' : ''),
    });
    setIsConfirmModalVisible(true);
  };

  const handleConfirmModalCancel = () => {
    setIsConfirmModalVisible(false);
  };

  const handleConfirmModalOk = async () => {
    const { applicationId, action, actionText } = currentActionInfo;
    if (!applicationId || !action) return;

    const endpoint = `/admin/applications/${applicationId}/${action}`;
    setActionLoading(true); // Inicia loading para la acción
    try {
      const response = await axiosInstance.patch(endpoint);
      // Usar notification directamente importada de 'antd'
      notification.success({
        message: `Solicitud ${actionText === 'aprobar' ? 'Aprobada' : 'Rechazada'}`,
        description: response.data.message,
        placement: 'topRight',
      });
      fetchApplications(); // Recargar lista
    } catch (error) {
      console.error(`Error al ${actionText} la solicitud:`, error);
      notification.error({
        message: `Error al ${actionText}`,
        description: error.response?.data?.message || 'Intente de nuevo más tarde.',
        placement: 'topRight',
      });
    } finally {
      setActionLoading(false); // Finaliza loading para la acción
      setIsConfirmModalVisible(false); // Cierra el modal de confirmación
    }
  };

  // --- Carga de datos ---
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/applications');
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      notification.error({
        message: 'Error al Cargar Solicitudes',
        description: error.response?.data?.message || 'No se pudieron cargar las solicitudes.',
        placement: 'topRight',
      });
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- Columnas de la Tabla ---
  const columns = [
    { title: 'Usuario', dataIndex: ['userId', 'username'], key: 'username', render: (username, record) => username || record.username },
    { title: 'Email', dataIndex: ['userId', 'email'], key: 'email', render: (email, record) => email || record.email },
    { title: 'Fecha', dataIndex: 'createdAt', key: 'createdAt', render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'), sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(), defaultSortOrder: 'descend' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver Detalles">
            <Button icon={<EyeOutlined />} size="small" onClick={() => showDetailsModal(record)} />
          </Tooltip>
          <Tooltip title="Aprobar Solicitud">
            {/* Llama a showConfirmModal en lugar de handleAction directamente */}
            <Button style={{background:'green'}} icon={<CheckCircleOutlined />} size="small" onClick={() => showConfirmModal(record._id, 'approve')} />
          </Tooltip>
          <Tooltip title="Rechazar Solicitud">
            {/* Llama a showConfirmModal en lugar de handleAction directamente */}
            <Button type="primary" danger icon={<CloseCircleOutlined />} size="small" onClick={() => showConfirmModal(record._id, 'reject')} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading && applications.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" tip="Cargando solicitudes..." /></div>;
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={applications}
        rowKey="_id"
        loading={loading} // Loading para la tabla
        locale={{ emptyText: <Empty description="No hay solicitudes pendientes." /> }}
        size="small"
      />

      {/* Modal de Confirmación de Acción */}
      <AntdModal
        title={currentActionInfo.title}
        open={isConfirmModalVisible}
        onOk={handleConfirmModalOk}
        onCancel={handleConfirmModalCancel}
        confirmLoading={actionLoading} // Loading para el botón OK del modal de confirmación
        okText={`Sí, ${currentActionInfo.actionText}`}
        cancelText="No"
        okType={currentActionInfo.action === 'approve' ? 'primary' : 'danger'}
      >
        <p>{currentActionInfo.content}</p>
      </AntdModal>

      {/* Modal de Detalles */}
      <AntdModal
        title="Detalles de la Solicitud de Analista"
        open={isDetailModalVisible}
        onCancel={handleDetailModalCancel}
        footer={[ <Button key="close" onClick={handleDetailModalCancel}> Cerrar </Button> ]}
        width={700}
      >
        {selectedApplicationDetails && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ID Solicitud">{selectedApplicationDetails._id}</Descriptions.Item>
            <Descriptions.Item label="ID Usuario">{selectedApplicationDetails.userId?._id || selectedApplicationDetails.userId}</Descriptions.Item>
            {/* ... más items de descripción ... */}
            <Descriptions.Item label="Nombre Usuario">{selectedApplicationDetails.userId?.username || selectedApplicationDetails.username}</Descriptions.Item>
            <Descriptions.Item label="Email Usuario">{selectedApplicationDetails.userId?.email || selectedApplicationDetails.email}</Descriptions.Item>
            <Descriptions.Item label="Fecha Solicitud">{dayjs(selectedApplicationDetails.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="Motivación">
              <Paragraph ellipsis={{ rows: 5, expandable: true, symbol: 'más' }}>
                {selectedApplicationDetails.motivation}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Experiencia">
               <Paragraph ellipsis={{ rows: 5, expandable: true, symbol: 'más' }}>
                {selectedApplicationDetails.experience}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Twitter/X">{selectedApplicationDetails.twitterUrl || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Otro Perfil Público">{selectedApplicationDetails.otherPublicProfileUrl || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Info Adicional">{selectedApplicationDetails.additionalInfo || 'N/A'}</Descriptions.Item>
             <Descriptions.Item label="Estado"><Tag color="blue">{selectedApplicationDetails.status}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </AntdModal>
    </>
  );
};

export default ApplicationList;