import React from 'react';
import { Card, Row, Col, Typography, Progress, Space } from 'antd';
import { BellOutlined, ApiOutlined } from '@ant-design/icons';
import SystemStatus from './SystemStatus';
import Resources from './Resources'; // 👈 Importamos Resources

const { Title, Text } = Typography;

const Dashboard = () => {
  return (
    <Row gutter={[16, 16]}>
      {/* Panel Principal */}
      <Col xs={24} lg={16}>
        <Card>
          <Title style={{ marginTop: 0 }} level={4}>
            Bienvenido a NotiFInance
          </Title>
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
                  <Text type="secondary">Alertas utilizadas</Text>
                  <Row justify="space-between">
                    <Text style={{ color: '#52c41a' }}>15</Text>
                    <Text type="secondary">/ 50</Text>
                  </Row>
                  <Progress percent={(15 / 50) * 100} showInfo={false} />
                </div>

                <div>
                  <Text type="secondary">Alertas por hora</Text>
                  <Row justify="space-between">
                    <Text style={{ color: '#52c41a' }}>3</Text>
                    <Text type="secondary">/ 10</Text>
                  </Row>
                  <Progress percent={(3 / 10) * 100} showInfo={false} />
                </div>

                <div>
                  <Text type="secondary">Notificaciones enviadas hoy</Text>
                  <Row justify="space-between">
                    <Text style={{ color: '#52c41a' }}>8</Text>
                    <Text type="secondary">/ 100</Text>
                  </Row>
                  <Progress percent={(8 / 100) * 100} showInfo={false} />
                </div>
              </Space>
            </Col>

            {/* Sección de Criptomonedas */}
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <ApiOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Text strong>Monitoreo</Text>
                </Space>

                <div>
                  <Text type="secondary">Criptomonedas monitoreadas</Text>
                  <Row justify="space-between">
                    <Text>5</Text>
                    <Text type="secondary">/ 10</Text>
                  </Row>
                  <Progress percent={(5 / 10) * 100} showInfo={false} />
                </div>

                <div>
                  <Text type="secondary">Condiciones activas</Text>
                  <Row justify="space-between">
                    <Text>3</Text>
                    <Text type="secondary">/ 5</Text>
                  </Row>
                  <Progress percent={(3 / 5) * 100} showInfo={false} />
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
      <Col xs={24} lg={24}>
        {/* Sección de Recursos */}
        <Resources />
        </Col>
    </Row>
  );
};

export default Dashboard;
