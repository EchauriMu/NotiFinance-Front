import React, { useEffect, useState } from 'react';
import { Card, Space, Row, Badge, Button, Typography, Alert } from 'antd';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const SystemStatus = () => {
  const [status, setStatus] = useState({
    'servicio de whatsapp': 'Cargando...',
    'servicio de alertas': 'Cargando...',
    'servicio de correo': 'Cargando...',
    api_precios: 'Cargando...',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Función para obtener el estado de los servicios
  const fetchServiceStatus = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axiosInstance.get('/status');
      if (response && response.data) {
        const serviceStatus = response.data;

        setStatus({
          'servicio de whatsapp': 'Operativo', // Siempre activo
          'servicio de alertas': serviceStatus['servicio de alertas'] || 'No disponible',
          'servicio de correo': serviceStatus['servicio de correo'] || 'No disponible',
          api_precios: serviceStatus.api_precios || 'No disponible',
        });
      } else {
        setStatus({
          'servicio de whatsapp': 'Operativo', // Siempre activo
          'servicio de alertas': 'No disponible',
          'servicio de correo': 'No disponible',
          api_precios: 'No disponible',
        });
      }
    } catch (error) {
      console.error("Error al obtener el estado de los servicios:", error);
      setStatus({
        'servicio de whatsapp': 'Operativo', // Siempre activo
        'servicio de alertas': 'No disponible',
        'servicio de correo': 'No disponible',
        api_precios: 'No disponible',
      });
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceStatus(); // Cargar el estado al montar el componente
  }, []);

  return (
    <Card>
      <Title style={{ marginTop: 0 }} level={4}>
        Estado del Sistema
      </Title>

      {error && (
        <Alert message="Hubo un error al obtener el estado de los servicios" type="error" showIcon />
      )}

      <Space direction="vertical" style={{ width: '100%' }}>
        <Row justify="space-between">
          <Text>Servicio de WhatsApp</Text>
          <Badge
            status={status['servicio de whatsapp'] === 'Cargando...' ? 'processing' : status['servicio de whatsapp'] === 'Operativo' ? 'success' : status['servicio de whatsapp'] === 'Caído' ? 'error' : 'default'}
            text={status['servicio de whatsapp']}
          />
        </Row>

        <Row justify="space-between">
          <Text>Servicio de Alertas</Text>
          <Badge
            status={status['servicio de alertas'] === 'Cargando...' ? 'processing' : status['servicio de alertas'] === 'Operativo' ? 'success' : status['servicio de alertas'] === 'Caído' ? 'error' : 'default'}
            text={status['servicio de alertas']}
          />
        </Row>

        <Row justify="space-between">
          <Text>Servicio de Correo</Text>
          <Badge
            status={status['servicio de correo'] === 'Cargando...' ? 'processing' : status['servicio de correo'] === 'Operativo' ? 'success' : status['servicio de correo'] === 'Caído' ? 'error' : 'default'}
            text={status['servicio de correo']}
          />
        </Row>

        <Row justify="space-between">
          <Text>API de Precios</Text>
          <Badge
            status={status.api_precios === 'Cargando...' ? 'processing' : status.api_precios === 'Operativo' ? 'success' : status.api_precios === 'Caído' ? 'error' : 'default'}
            text={status.api_precios}
          />
        </Row>
      </Space>
    </Card>
  );
};

export default SystemStatus;
