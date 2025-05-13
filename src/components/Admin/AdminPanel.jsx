// src/components/Admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Tabs, Card } from 'antd';
import { UserSwitchOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import LogoutButton from '../Sidebar/Logout';
import AnalystList from './AnalystList';
import UserList from './UserList';
import ApplicationList from './ApplicationList';
import ExpiredSessionModal from '../../ExpiredSessionModal';
import AdminSettings from './AdminSettings'; // Importar el nuevo componente
import { io } from 'socket.io-client';
import { fetchUserData, fetchSettings } from '../../functions/fetchUserData';

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminPanel = () => {
  const [userData, setUserData] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: false,
    whatsapp: false,
    discord: false,
  });
  const [watchlist, setWatchlist] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const newSocket = io('https://ntlogout.onrender.com');
    setSocket(newSocket);

    const fetchData = async () => {
      try {
        const userDataResponse = await fetchUserData();
        setUserData(userDataResponse);

        newSocket.emit('subscribeUserChanges', userDataResponse.id);
        console.log('✅ Suscrito a cambios del usuario:', userDataResponse.id);

        const { notificationSettings, watchlist } = await fetchSettings();
        setNotificationSettings(notificationSettings);
        setWatchlist(watchlist);

        setDataReady(true);
      } catch (error) {
        console.error('❌ Error al obtener los datos:', error);
      } finally {
        setLoadingUserData(false);
        setLoadingSettings(false);
      }
    };

    fetchData();

    newSocket.on('userUpdated', (data) => {
      console.log('⚠️ Cambio detectado, mostrando modal');
      setModalVisible(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px', color: 'white' }}>
        <Row justify="space-between">
          <Col>
            <Title level={3} style={{ color: 'white', margin: '16px 0' }}>
              Panel Admin
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
            <AdminSettings userData={userData} /> {/* Pasar los datos del administrador */}
          </Tabs.TabPane>
        </Tabs>



        {isModalVisible && (
          <ExpiredSessionModal
            socket={socket}
            setIsAuthenticated={() => {
              console.log('Sesión expirada, cerrando sesión...');
            }}
            setModalVisible={setModalVisible}
          />
        )}
      </Content>
    </Layout>
  );
};

export default AdminPanel;