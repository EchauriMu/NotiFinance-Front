import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Progress, Space, Badge, Divider } from 'antd';
import { BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SystemStatus from './SystemStatus';
import Resources from './Resources';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [alertCountActive, setAlertCountActive] = useState(0);
  const [alertCountTotal, setAlertCountTotal] = useState(0);
  const [userPlan, setUserPlan] = useState('Freemium');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
      setUserPlan(userData.plan || 'Freemium');
    }

    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get('/alert/get/id');
      const alertData = response.data;
   
//FILTRAR DATOS
    const trackedSymbols = alertData.map(alert => ({
      symbol: alert.cryptoSymbol,
      status: alert.isActive ,
      isFulfilled: alert.isFulfilled
    }));

    // Guardar solo lo que necesitas en sessionStorage
    sessionStorage.setItem('trackedSymbols', JSON.stringify(trackedSymbols));


      const activeAlerts = alertData.filter(alert => alert.isActive);
      setAlertCountActive(activeAlerts.length);

      if (alertData.length > 0) {
        setAlertCountTotal(alertData[0].totalAlerts);
      } else {
        setAlertCountTotal(0);
      }

      setAlerts(alertData);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  // Límites según el plan
  const planLimits = {
    Freemium: { active: 1, total: 3 },
    Premium: { active: 5, total: 10 },
    'NotiFinance Pro': { active: 10, total: 20 },
  };

  const { active: activeLimit, total: totalLimit } = planLimits[userPlan] || planLimits['Freemium'];

  return (
    <Row gutter={[16, 16]}>
      {/* Panel Principal */}
      <Col xs={24} lg={16}>
        <Card>
          <Title style={{ marginTop: 0 }} level={4}>Bienvenido a NotiFInance</Title>
          <Text type="secondary">Resumen de tus alertas de criptomonedas</Text>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {/* Sección de Alertas */}
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Text strong>Alertas Activas</Text>
                </Space>

                <div>
                  <Text type="secondary">Activas</Text>
                  <Row justify="space-between">
                    <Text style={{ color: '#52c41a' }}>{alertCountActive}</Text>
                    <Text type="secondary">/ {activeLimit}</Text>
                  </Row>
                  <Progress
                    percent={(alertCountActive / activeLimit) * 100}
                    showInfo={false}
                    status={alertCountActive >= activeLimit ? 'exception' : 'active'}
                  />
                </div>

                <div>
                  <Text type="secondary">Creadas</Text>
                  <Row justify="space-between">
                    <Text style={{ color: '#1890ff' }}>{alertCountTotal}</Text>
                    <Text type="secondary">/ {totalLimit}</Text>
                  </Row>
                  <Progress
                    percent={(alertCountTotal / totalLimit) * 100}
                    showInfo={false}
                    status={alertCountTotal >= totalLimit ? 'exception' : 'active'}
                  />
                </div>
              </Space>
            </Col>

            {/* Alertas detalladas */}
         {/* Alertas detalladas */}
<Col xs={24} md={12}>
  <Space direction="vertical" style={{ width: '100%' }}>
    <Space>
      <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
      <Text strong>Alertas Detalladas</Text>
    </Space>

    <div style={{ maxHeight: 150, overflowY: 'auto', paddingRight: 8 }}>
      {alerts.map((alert) => (
        <Card key={alert._id} style={{ marginTop: 0 }} bordered={false}>
          <Row justify="space-between">
            <Col>
              <Text strong>{alert.cryptoSymbol}</Text>
              <Text type="secondary"> ({alert.isFulfilled ? 'Cumplida' : 'Pendiente'})</Text>
            </Col>
            <Col>
              <Text strong>${alert.targetPrice}</Text>
              <Text type="secondary"> Objetivo</Text>
            </Col>
          </Row>
          <Divider style={{ margin: 5 }} />
        </Card>
      ))}
    </div>
  </Space>
</Col>

          </Row>
        </Card>
      </Col>

      {/* Estado del Sistema */}
      <Col xs={24} lg={8}>
        <SystemStatus />
      </Col>

      {/* Recursos */}
      <Col xs={24} lg={24}>
        <Resources />
      </Col>
    </Row>
  );
};

export default Dashboard;
