import React, { useEffect, useState } from 'react';
import { Card, Space, Row, Badge, Button, Typography } from 'antd';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const SystemStatus = () => {
  const [status, setStatus] = useState({
    alertas: 'Cargando...',
    precios: 'Cargando...',
    notificaciones: 'Cargando...',
  });

  // Función para obtener el estado de los servicios
  const fetchServiceStatus = async () => {
    try {
      const response = await axiosInstance.get('/status'); // Realizamos la petición al endpoint
      const serviceStatus = response.data;

      // Actualizamos el estado con la respuesta, si no es operativo, lo marcamos como Caído
      setStatus({
        alertas: serviceStatus.notificaciones === 'Operativo' ? 'Operativo' : 'No disponible',
        precios: serviceStatus.api_precios === 'Operativo' ? 'Operativo' : 'No disponible',
        notificaciones: serviceStatus.notifinance === 'Operativo' ? 'Operativo' : 'No disponible',
      });
    } catch (error) {
      console.error("Error al obtener el estado de los servicios:", error);
      // Si hay un error, los marcamos todos como Caído
      setStatus({
        alertas: 'No disponible',
        precios: 'No disponible',
        notificaciones: 'No disponible',
      });
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
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row justify="space-between">
          <Text>Servicio de Alertas</Text>
          <Badge status={status.alertas === 'Operativo' ? 'success' : 'error'} text={status.alertas} />
        </Row>
        <Row justify="space-between">
          <Text>API de Precios</Text>
          <Badge status={status.precios === 'Operativo' ? 'success' : 'error'} text={status.precios} />
        </Row>
        <Row justify="space-between">
          <Text>Notificaciones</Text>
          <Badge status={status.notificaciones === 'Operativo' ? 'success' : 'error'} text={status.notificaciones} />
        </Row>
        <Button type="primary">Ver estado completooooo</Button>
      </Space>
    </Card>
  );
};

export default SystemStatus;
