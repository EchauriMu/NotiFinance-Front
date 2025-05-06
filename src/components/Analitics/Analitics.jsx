// src/components/Analitics/Analitics.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  notification,
  Spin,
  Alert,
  Dropdown,
  Menu,
  Popconfirm,
  Tag,
  Typography,
  Row,
  Col,
  Avatar,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  UserOutlined,
  CalendarOutlined,
  SearchOutlined, // Icono para el filtro/buscador
} from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { fetchCryptos } from '../../functions/fetchCryptos';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

const { TextArea } = Input;
const { Option } = Select;
const { Text, Paragraph, Title } = Typography;

// --- Componente PredictionCard (Sin cambios respecto a la versión anterior) ---
const PredictionCard = ({ prediction, isAnalystUser, onEdit, onDelete }) => {
    const menu = (
      <Menu>
        <Menu.Item
          key="edit"
          icon={<EditOutlined />}
          onClick={() => onEdit(prediction)}
        >
          Editar
        </Menu.Item>
        <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
          <Popconfirm
            title="¿Estás seguro?"
            onConfirm={() => onDelete(prediction._id)}
            okText="Sí"
            cancelText="No"
          >
            Eliminar
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );

    const cardExtra = (
      <Space size="small">
        <Text type="secondary" style={{ fontSize: '0.8em' }}>
          <CalendarOutlined style={{ marginRight: 4 }} />{dayjs(prediction.createdAt).fromNow()}
        </Text>
        {isAnalystUser && (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<MoreOutlined />} type="text" shape="circle" size="small" />
          </Dropdown>
        )}
      </Space>
    );

    const cardTitle = (
      <Space>
        <Tag color="gold" style={{ fontSize: '1em' }}>
          {prediction.cryptoSymbol}
        </Tag>
        <Space align="center" size={4}>
           <Avatar
              size="small"
              style={{ backgroundColor: '#87d068', marginRight: 4 }}
              icon={<UserOutlined />}
            />
          <Text strong>{prediction.analystUsername}</Text>
        </Space>
      </Space>
    );

    return (
        // Ajuste del tamaño de columna para que se vean mejor 2 por fila en pantallas medianas
      <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex' }}> {/* Responsive Grid */}
        <Card
          title={cardTitle}
          extra={cardExtra}
          hoverable
          style={{ borderRadius: '8px', width: '100%', display: 'flex', flexDirection: 'column' }} // Ocupa todo el ancho de Col y flex column
          bodyStyle={{ paddingTop: '12px', flexGrow: 1 }} // El cuerpo crece para llenar espacio
        >
          <Paragraph
            ellipsis={{ rows: 4, expandable: true, symbol: 'leer más' }}
          >
            {prediction.predictionText}
          </Paragraph>
           {dayjs(prediction.updatedAt).diff(dayjs(prediction.createdAt), 'minute') > 1 && (
              <Text type="secondary" style={{ fontSize: '0.75em', display: 'block', marginTop: 'auto', paddingTop: '8px' }}> {/* marginTop: auto empuja hacia abajo */}
                Actualizado: {dayjs(prediction.updatedAt).format('DD/MM/YY HH:mm')}
              </Text>
            )}
        </Card>
      </Col>
    );
  };

// --- Componente Principal Analitics ---
const Analitics = () => {
  const [predictions, setPredictions] = useState([]); // Todas las predicciones originales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [cryptoOptions, setCryptoOptions] = useState([]);
  const [form] = Form.useForm();
  const [selectedCryptoFilter, setSelectedCryptoFilter] = useState(null); // Estado para el filtro

  const userRole = useMemo(() => {
    const userDataString = sessionStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.role;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  }, []);

  const isAnalystUser = userRole === 'analist';

  // Fetch predictions (igual que antes)
  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/prediction/get/all');
      const sortedPredictions = (response.data || []).sort((a, b) =>
        dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
      );
      setPredictions(sortedPredictions);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError(err.response?.data?.message || 'Error al cargar las predicciones.');
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cryptos (igual que antes)
  const loadCryptos = async () => {
    const storedCryptos = sessionStorage.getItem('cryptos');
    if (storedCryptos) {
        setCryptoOptions(JSON.parse(storedCryptos));
    } else {
        try {
            const cryptosList = await fetchCryptos();
            // Añadir opción "Todas" al principio si aún no existe
            const optionsWithAll = [{ value: null, label: 'Todas las Criptomonedas' }, ...cryptosList];
            setCryptoOptions(optionsWithAll);
            sessionStorage.setItem('cryptos', JSON.stringify(cryptosList)); // Guardar solo las cryptos, no la opción "Todas"
        } catch (error) {
            console.error("Error loading crypto options:", error);
             // Setear al menos la opción "Todas" en caso de error
            setCryptoOptions([{ value: null, label: 'Todas las Criptomonedas' }]);
            notification.error({ message: "Error al cargar lista de criptomonedas." });
        }
    }
  };


  useEffect(() => {
    fetchPredictions();
    loadCryptos();
  }, []);

  // --- Filtrar Predicciones ---
  const filteredPredictions = useMemo(() => {
    if (!selectedCryptoFilter) {
      return predictions; // Si no hay filtro, mostrar todas
    }
    return predictions.filter(p => p.cryptoSymbol === selectedCryptoFilter);
  }, [predictions, selectedCryptoFilter]); // Recalcular solo si cambian las predicciones o el filtro

  // --- Manejadores de Modal y CRUD (sin cambios) ---
   const showCreateModal = () => {
    setEditingPrediction(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (prediction) => {
    setEditingPrediction(prediction);
    form.setFieldsValue({
      cryptoSymbol: prediction.cryptoSymbol,
      predictionText: prediction.predictionText,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPrediction(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    setModalLoading(true);
    const endpoint = editingPrediction
      ? `/prediction/update/${editingPrediction._id}`
      : '/prediction/create';
    const method = editingPrediction ? 'patch' : 'post';
    const successMessage = editingPrediction
      ? 'Predicción actualizada'
      : 'Predicción creada';
    const errorMessage = editingPrediction
      ? 'Error al actualizar'
      : 'Error al crear';

    try {
      await axiosInstance[method](endpoint, values);
      notification.success({ message: successMessage });
      setIsModalVisible(false);
      setEditingPrediction(null);
      form.resetFields();
      fetchPredictions(); // Recargar predicciones después de crear/editar
    } catch (err) {
      console.error(errorMessage, err);
      notification.error({
        message: 'Error',
        description: err.response?.data?.message || errorMessage,
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (predictionId) => {
    try {
      await axiosInstance.delete(`/prediction/delete/${predictionId}`);
      notification.success({ message: 'Predicción eliminada' });
      fetchPredictions(); // Recargar predicciones después de eliminar
    } catch (err) {
      console.error('Error deleting prediction:', err);
      notification.error({
        message: 'Error',
        description: err.response?.data?.message || 'Error al eliminar',
      });
    }
  };

  // --- Renderizado ---
  return (
    <div>
      {/* --- Cabecera con Título y Botón Crear --- */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
           <Title level={3} style={{ margin: 0 }}>Predicciones de Analistas</Title>
        </Col>
        <Col>
          {isAnalystUser && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              Nueva Predicción
            </Button>
          )}
        </Col>
      </Row>

      {/* --- Filtro por Criptomoneda --- */}
      <Row style={{ marginBottom: 24 }}>
          <Col xs={24} md={8} lg={6}> {/* Ajusta el tamaño según necesites */}
             <Select
                showSearch
                placeholder="Filtrar por Criptomoneda"
                optionFilterProp="children"
                onChange={(value) => setSelectedCryptoFilter(value)} // Actualiza el estado del filtro
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
                allowClear // Permite limpiar la selección
                value={selectedCryptoFilter} // Valor controlado
                options={cryptoOptions.map(crypto => ({ // Usar formato de options para Select
                    value: crypto.value,
                    label: crypto.label
                }))}
                suffixIcon={<SearchOutlined />} // Icono de búsqueda
            />
          </Col>
      </Row>


      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : filteredPredictions.length > 0 ? ( // Usar filteredPredictions aquí
        <Row gutter={[16, 24]}> {/* Aumentar gutter vertical */}
          {filteredPredictions.map((prediction) => ( // Usar filteredPredictions aquí
            <PredictionCard
              key={prediction._id}
              prediction={prediction}
              isAnalystUser={isAnalystUser}
              onEdit={showEditModal}
              onDelete={handleDelete}
            />
          ))}
        </Row>
      ) : (
         <Empty description={
            selectedCryptoFilter
             ? `No hay predicciones para ${selectedCryptoFilter}.`
             : "No hay predicciones disponibles."
            }
        />
      )}

      {/* --- Modal (sin cambios) --- */}
       <Modal
        title={editingPrediction ? 'Editar Predicción' : 'Crear Nueva Predicción'}
        open={isModalVisible}
        onCancel={handleCancel}
        confirmLoading={modalLoading}
        footer={[
          <Button key="back" onClick={handleCancel} disabled={modalLoading}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={modalLoading}
            onClick={() => form.submit()}
          >
            {editingPrediction ? 'Guardar Cambios' : 'Crear Predicción'}
          </Button>,
        ]}
      >
        <Spin spinning={modalLoading}>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              name="cryptoSymbol"
              label="Criptomoneda"
              rules={[{ required: true, message: 'Selecciona una criptomoneda' }]}
            >
              {/* Usar options en lugar de mapear Option directamente */}
               <Select
                showSearch
                placeholder="Selecciona o busca una criptomoneda"
                optionFilterProp="label" // Filtrar por etiqueta visible
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                loading={!cryptoOptions.length}
                // Quitar la opción "Todas" del modal
                options={cryptoOptions.filter(opt => opt.value !== null).map(crypto => ({
                    value: crypto.value,
                    label: crypto.label
                }))}
              />
            </Form.Item>
            <Form.Item
              name="predictionText"
              label="Texto de la Predicción"
              rules={[
                { required: true, message: 'Escribe el texto de la predicción' },
                { min: 10, message: 'La predicción debe tener al menos 10 caracteres' }
              ]}
            >
              <TextArea rows={5} placeholder="Describe tu predicción detalladamente..." />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default Analitics;