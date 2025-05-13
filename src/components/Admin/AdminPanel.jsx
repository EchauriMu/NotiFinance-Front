// src/components/Admin/AdminPanel.jsx
import React from 'react';
import { Layout, Typography, Row, Col, Tabs, Card } from 'antd';
import { UserSwitchOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import LogoutButton from '../Sidebar/Logout';
import AnalystList from './AnalystList';
import UserList from './UserList';
import ApplicationList from './ApplicationList';

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminSettings = () => (
  <Card title="Configuración del Admin">
    <p>Contenido de ejemplo para la configuración del administrador.</p>
  </Card>
);

const AdminPanel = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px', color: 'white' }}>
        <Row justify="space-between">
          <Col>
            <Title level={3} style={{ color: 'white', margin: '16px 0' }}>
              Panel de Administrador
            </Title>
          </Col>
          <Col>
            <LogoutButton />
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab={
              <span>
                <TeamOutlined />
                Analistas
              </span>
            }
            key="1"
          >
            <Card title="Lista de Analistas">
              <AnalystList />
              <div style={{ marginTop: '24px' }}>
                <Card title="Solicitudes de Analista">
                  <ApplicationList />
                </Card>
              </div>
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <UserSwitchOutlined />
                Usuarios
              </span>
            }
            key="2"
          >
            <Card title="Lista de Usuarios">
              <UserList />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <SettingOutlined />
                Configuración
              </span>
            }
            key="3"
          >
            <AdminSettings />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default AdminPanel;