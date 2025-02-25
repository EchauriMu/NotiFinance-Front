import React, { useState } from 'react';
import { Layout, Row, Col, Typography, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar/SidebarMain';
import CryptoHeader from './Header/Header';
import CryptoChart from './Charts/ChartSection';
import PriceTrackerCard from './PriceTrackerCard';
import Dashboard from './dashboard/dashboard';
import CryptoAlertForm from './NotiFInance/CryptoAlertForm';
import ConfigTab from './Config/ConfigMain';

const { Content, Footer } = Layout;
const { Text } = Typography;

const styles = {
  layout: {
    minHeight: '100vh',
  },
  content: {
    padding: '24px',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
  },
};

const sections = {
  dashboard: <Dashboard />,
  monedas: <CryptoChart />,
  notifinance: <CryptoAlertForm />,
  configuracion: <ConfigTab />,
};

const CryptoLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarSize, setSidebarSize] = useState(5);
  const [contentSize, setContentSize] = useState(19);

  const toggleSidebar = () => {
    if (sidebarSize === 5) {
      setSidebarSize(1);
      setContentSize(23);
    } else {
      setSidebarSize(5);
      setContentSize(19);
    }
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Layout style={styles.layout}>
      <Button 
        type="primary" 
        icon={<MenuOutlined />} 
        style={styles.menuButton} 
        onClick={toggleSidebar}
      />
      
      <Row gutter={[0, 16]}>
        <Col xs={24} md={sidebarSize}>
          <Sidebar />
        </Col>

        <Col xs={24} md={contentSize}>
          <CryptoHeader setActiveSection={setActiveSection} />

          <Content style={styles.content}>{sections[activeSection]}</Content>

          <Footer style={styles.footer}>
            <Text style={{ color: 'rgba(255,255,255,0.45)' }}>NotiFinance beta</Text>
          </Footer>
        </Col>
      </Row>
    </Layout>
  );
};

export default CryptoLayout;
