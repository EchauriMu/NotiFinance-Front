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
  SearchOutlined,
  SolutionOutlined, // Icono para el botón de aplicar
  TwitterSquareFilled,
  LinkOutlined,
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

// --- Componente PredictionCard (Sin cambios) ---
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
      <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex' }}>
        <Card
          title={cardTitle}
          extra={cardExtra}
          hoverable
          style={{ borderRadius: '8px', width: '100%', display: 'flex', flexDirection: 'column' }}
          bodyStyle={{ paddingTop: '12px', flexGrow: 1 }}
        >
          <Paragraph
            ellipsis={{ rows: 4, expandable: true, symbol: 'leer más' }}
          >
            {prediction.predictionText}
          </Paragraph>
           {dayjs(prediction.updatedAt).diff(dayjs(prediction.createdAt), 'minute') > 1 && (
              <Text type="secondary" style={{ fontSize: '0.75em', display: 'block', marginTop: 'auto', paddingTop: '8px' }}>
                Actualizado: {dayjs(prediction.updatedAt).format('DD/MM/YY HH:mm')}
              </Text>
            )}
        </Card>
      </Col>
    );
  };


// --- Componente Principal Analitics ---
const Analitics = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal de Crear/Editar Predicción
  const [isPredictionModalVisible, setIsPredictionModalVisible] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState(null);
  const [predictionModalLoading, setPredictionModalLoading] = useState(false);
  const [predictionForm] = Form.useForm();

  // Modal de Aplicar para Analista
  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
  const [applyFormLoading, setApplyFormLoading] = useState(false);
  const [applyForm] = Form.useForm();


  const [cryptoOptions, setCryptoOptions] = useState([]);
  const [selectedCryptoFilter, setSelectedCryptoFilter] = useState(null);

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
  const isBasicUser = userRole === 'basic';


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

  const loadCryptos = async () => {
    const storedCryptos = sessionStorage.getItem('cryptos');
    const baseOptions = storedCryptos ? JSON.parse(storedCryptos) : await fetchCryptos().catch(() => []);
    if (!storedCryptos && baseOptions.length > 0) {
        sessionStorage.setItem('cryptos', JSON.stringify(baseOptions));
    }
    setCryptoOptions([{ value: null, label: 'Todas las Criptomonedas' }, ...baseOptions]);
  };

  useEffect(() => {
    fetchPredictions();
    loadCryptos();
  }, []);

  const filteredPredictions = useMemo(() => {
    if (!selectedCryptoFilter) {
      return predictions;
    }
    return predictions.filter(p => p.cryptoSymbol === selectedCryptoFilter);
  }, [predictions, selectedCryptoFilter]);

  // --- Manejadores de Modal de Predicción ---
  const showCreatePredictionModal = () => {
    setEditingPrediction(null);
    predictionForm.resetFields();
    setIsPredictionModalVisible(true);
  };

  const showEditPredictionModal = (prediction) => {
    setEditingPrediction(prediction);
    predictionForm.setFieldsValue({
      cryptoSymbol: prediction.cryptoSymbol,
      predictionText: prediction.predictionText,
    });
    setIsPredictionModalVisible(true);
  };

  const handlePredictionModalCancel = () => {
    setIsPredictionModalVisible(false);
    setEditingPrediction(null);
    predictionForm.resetFields();
  };

  const handlePredictionFormSubmit = async (values) => {
    setPredictionModalLoading(true);
    const endpoint = editingPrediction
      ? `/prediction/update/${editingPrediction._id}`
      : '/prediction/create';
    const method = editingPrediction ? 'patch' : 'post';
    const successMessage = editingPrediction ? 'Predicción actualizada' : 'Predicción creada';
    const errorMessage = editingPrediction ? 'Error al actualizar' : 'Error al crear';

    try {
      await axiosInstance[method](endpoint, values);
      notification.success({ message: successMessage });
      setIsPredictionModalVisible(false);
      setEditingPrediction(null);
      predictionForm.resetFields();
      fetchPredictions();
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.response?.data?.message || errorMessage,
      });
    } finally {
      setPredictionModalLoading(false);
    }
  };

  const handleDeletePrediction = async (predictionId) => {
    try {
      await axiosInstance.delete(`/prediction/delete/${predictionId}`);
      notification.success({ message: 'Predicción eliminada' });
      fetchPredictions();
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.response?.data?.message || 'Error al eliminar',
      });
    }
  };

  // --- Manejadores de Modal de Aplicación para Analista ---
  const showApplyModal = () => {
    applyForm.resetFields();
    setIsApplyModalVisible(true);
  };

  const handleApplyModalCancel = () => {
    setIsApplyModalVisible(false);
  };

  const handleApplyFormSubmit = async (values) => {
    setApplyFormLoading(true);
    
    try {
      const response = await axiosInstance.post('/user/apply-for-analyst', values);
  
      notification.success({
        message: 'Solicitud Enviada',
        description: response.data.message || 'Hemos recibido tu solicitud para ser analista. Nos pondremos en contacto contigo pronto.',
      });
      setIsApplyModalVisible(false);
      applyForm.resetFields(); // Resetea el formulario
    } catch (err) {
      notification.error({
        message: 'Error al Enviar Solicitud',
        description: err.response?.data?.message || 'No se pudo enviar tu solicitud en este momento.',
      });
    } finally {
      setApplyFormLoading(false);
    }
  };


  // --- Renderizado ---
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
           <Title level={3} style={{ margin: 0 }}>Predicciones de Analistas</Title>
        </Col>
        <Col>
            <Space>
                {isBasicUser && (
                    <Button
                    type="default"
                    icon={<SolutionOutlined />}
                    onClick={showApplyModal}
                    >
                    Quiero ser Analista
                    </Button>
                )}
                {isAnalystUser && (
                    <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreatePredictionModal}
                    >
                    Nueva Predicción
                    </Button>
                )}
            </Space>
        </Col>
      </Row>

      <Row style={{ marginBottom: 24 }}>
          <Col xs={24} md={8} lg={6}>
             <Select
                showSearch
                placeholder="Filtrar por Criptomoneda"
                optionFilterProp="children"
                onChange={(value) => setSelectedCryptoFilter(value)}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
                allowClear
                value={selectedCryptoFilter}
                options={cryptoOptions.map(crypto => ({
                    value: crypto.value,
                    label: crypto.label
                }))}
                suffixIcon={<SearchOutlined />}
            />
          </Col>
      </Row>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : filteredPredictions.length > 0 ? (
        <Row gutter={[16, 24]}>
          {filteredPredictions.map((prediction) => (
            <PredictionCard
              key={prediction._id}
              prediction={prediction}
              isAnalystUser={isAnalystUser}
              onEdit={showEditPredictionModal}
              onDelete={handleDeletePrediction}
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

      {/* --- Modal Crear/Editar Predicción --- */}
       <Modal
        title={editingPrediction ? 'Editar Predicción' : 'Crear Nueva Predicción'}
        open={isPredictionModalVisible}
        onCancel={handlePredictionModalCancel}
        confirmLoading={predictionModalLoading}
        footer={[
          <Button key="back" onClick={handlePredictionModalCancel} disabled={predictionModalLoading}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={predictionModalLoading}
            onClick={() => predictionForm.submit()}
          >
            {editingPrediction ? 'Guardar Cambios' : 'Crear Predicción'}
          </Button>,
        ]}
      >
        <Spin spinning={predictionModalLoading}>
          <Form form={predictionForm} layout="vertical" onFinish={handlePredictionFormSubmit}>
            <Form.Item
              name="cryptoSymbol"
              label="Criptomoneda"
              rules={[{ required: true, message: 'Selecciona una criptomoneda' }]}
            >
               <Select
                showSearch
                placeholder="Selecciona o busca una criptomoneda"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                loading={!cryptoOptions.filter(opt => opt.value !== null).length}
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

      {/* --- Modal Aplicar para ser Analista --- */}
      <Modal
        title="Aplicar para ser Analista de NotiFinance"
        open={isApplyModalVisible}
        onCancel={handleApplyModalCancel}
        confirmLoading={applyFormLoading}
        footer={[
            <Button key="cancelApply" onClick={handleApplyModalCancel} disabled={applyFormLoading}>
                Cancelar
            </Button>,
            <Button
                key="submitApply"
                type="primary"
                loading={applyFormLoading}
                onClick={() => applyForm.submit()}
            >
                Enviar Solicitud
            </Button>,
        ]}
        width={600}
      >
        <Spin spinning={applyFormLoading}>
            <Form form={applyForm} layout="vertical" onFinish={handleApplyFormSubmit}>
                <Paragraph>
                    Completa el siguiente formulario para que podamos evaluar tu perfil.
                    Buscamos personas con conocimiento demostrable en el análisis de criptomonedas.
                </Paragraph>
                <Form.Item
                    name="motivation"
                    label="Motivo"
                    rules={[{ required: true, message: 'Cuéntanos por qué quieres ser analista.' }]}
                >
                    <TextArea rows={3} placeholder="Explica tu interés en ser analista en NotiFinance..." />
                </Form.Item>
                <Form.Item
                    name="experience"
                    label="Experiencia y Conocimiento"
                    rules={[{ required: true, message: 'Describe tu experiencia y conocimientos.' }]}
                >
                    <TextArea rows={4} placeholder="Detalla tu experiencia en análisis de criptomonedas, mercados financieros, etc." />
                </Form.Item>

                <Title level={5}>Redes Sociales y Perfiles Públicos</Title>
                <Paragraph type="secondary">
                    Proporciona enlaces a perfiles donde muestres tu actividad o conocimientos (opcional pero recomendado).
                </Paragraph>
                <Form.Item
                    name="twitterURL"
                    label="Perfil de Twitter/X"
                    rules={[{ type: 'url', message: 'Por favor, introduce una URL válida.' }]}
                >
                    <Input prefix={<TwitterSquareFilled />} placeholder="https://x.com/tu-usuario" />
                </Form.Item>
                <Form.Item
                    name="otherPublicProfileURL"
                    label="Otro Perfil Público (Ej. TradingView, Blog, etc.)"
                    rules={[{ type: 'url', message: 'Por favor, introduce una URL válida.' }]}
                >
                    <Input prefix={<LinkOutlined />} placeholder="URL a tu perfil o contenido relevante" />
                </Form.Item>
                 <Form.Item
                    name="additionalInfo"
                    label="Información Adicional (Opcional)"
                >
                    <TextArea rows={2} placeholder="Cualquier otra información que consideres relevante." />
                </Form.Item>
            </Form>
        </Spin>
      </Modal>

    </div>
  );
};

export default Analitics;