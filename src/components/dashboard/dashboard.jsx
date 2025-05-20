import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Progress, Space, Divider, Skeleton } from 'antd';
import { BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SystemStatus from './SystemStatus';
import Resources from './Resources';
import axiosInstance from '../../api/axiosInstance';
import { fetchUserData } from '../../functions/fetchUserData';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [alertCountActive, setAlertCountActive] = useState(0);
  const [alertCountTotal, setAlertCountTotal] = useState(0);
  const [userPlan, setUserPlan] = useState('Freemium');
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setUserPlan(userData.plan || 'Freemium');
      }

      fetchAlerts();
    };

    fetchData();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get('/alert/get/id');
      const alertData = response.data;

      const trackedSymbols = alertData.map(alert => ({
        symbol: alert.cryptoSymbol,
        status: alert.isActive,
        isFulfilled: alert.isFulfilled,
      }));
      sessionStorage.setItem('trackedSymbols', JSON.stringify(trackedSymbols));
      window.dispatchEvent(new Event('trackedSymbolsUpdated'));

      const activeAlerts = alertData.filter(alert => alert.isActive);
      setAlertCountActive(activeAlerts.length);

      if (alertData.length > 0) {
        setAlertCountTotal(alertData[0].totalAlerts);
      } else {
        setAlertCountTotal(0);
      }

      setAlerts(alertData);
      setError(null);
    } catch (error) {
      const errorCode = error.response?.data?.code;
      let errorMessage = 'Error al cargar alertas.';
      if (errorCode === 'NONE_ALERTS') {
        errorMessage = 'No tienes alertas disponibles en este momento.';
      }
      setError(errorMessage);
      setAlerts([]);

    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  const planLimits = {
    Freemium: { active: 1, total: 3 },
    Premium: { active: 5, total: 10 },
    'NotiFinance Pro': { active: 10, total: 20 },
  };

  const { active: activeLimit, total: totalLimit } = planLimits[userPlan] || planLimits['Freemium'];

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card>
          <Title style={{ marginTop: 0 }} level={4}>Bienvenido a NotiFinance</Title>
          <Text type="secondary">Resumen de tus alertas de criptomonedas</Text>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Text strong>Alertas Activas</Text>
                </Space>

                {loading ? (
                  <Skeleton active paragraph={{ rows: 2 }} />
                ) : (
                  <>
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
                  </>
                )}
              </Space>
            </Col>

            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Text strong>Alertas Detalladas</Text>
                </Space>

                <div style={{ maxHeight: 150, overflowY: 'auto', paddingRight: 8 }}>
                  {loading ? (
                    <>
                      <Skeleton active paragraph={{ rows: 2 }} />
                      <Skeleton active paragraph={{ rows: 2 }} />
                    </>
                  ) : error ? (
                    <Card style={{ marginTop: 0 }} bordered={false}>
                      <Text type="secondary">{error}</Text>
                    </Card>
                  ) : (
                    alerts.map((alert) => (
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
                    ))
                  )}
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <SystemStatus />
      </Col>

      <Col xs={24} lg={24}>
        <Resources />
      </Col>
    </Row>
  );
};

export default Dashboard;
