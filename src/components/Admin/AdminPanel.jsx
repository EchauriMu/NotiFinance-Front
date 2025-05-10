// src/components/Admin/AdminPanel.jsx
import React from 'react';
import { Layout, Menu, Typography, Row, Col, Button, Divider } from 'antd';
import { UserSwitchOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, Routes, Route, Outlet, useNavigate } from 'react-router-dom'; // Necesitarás Outlet y Routes/Route si tienes subsecciones
import ApplicationList from './ApplicationList'; // Asegúrate de crear este componente
import LogoutButton from '../Sidebar/Logout';
import AnalystList from './AnalystList';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

// Componente Placeholder para otras secciones del admin si las necesitas
const AdminDashboard = () => <Title level={3}>Dashboard del Administrador</Title>;
const AdminSettings = () => <Title level={3}>Configuración del Admin</Title>;


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

             <LogoutButton/>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Title level={4}>Solicitudes Pendientes de Analista</Title>
        <ApplicationList />
        <Divider/>
        <AnalystList/>
      </Content>
    </Layout>
  );
};

export default AdminPanel;