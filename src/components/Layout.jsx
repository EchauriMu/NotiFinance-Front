import React, { useState } from 'react';
import { Layout, Row, Col, Typography } from 'antd';
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
};

const sections = {
  dashboard: <Dashboard/>,
  monedas:<CryptoChart />,
  notifinance:  <CryptoAlertForm/>,
  configuracion: <ConfigTab/>,
};

const CryptoLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <Layout style={styles.layout}>
      <Row gutter={[0, 16]}>
        <Col xs={24} md={5}>
          <Sidebar />
        </Col>

        <Col xs={24} md={19}>
          <CryptoHeader setActiveSection={setActiveSection} />

          <Content style={styles.content}>
            {sections[activeSection]}
          </Content>

          <Footer style={styles.footer}>
            <Text style={{ color: 'rgba(255,255,255,0.45)' }}>NotiFinance beta</Text>
          </Footer>
        </Col>
      </Row>
    </Layout>
  );
};
export default CryptoLayout;