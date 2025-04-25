import React, { useEffect, useState } from 'react';
import { Space, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const styles = {
  statsCard: {
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    background: '#141414',
  }
};

const LastActivity = () => {
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('trackedSymbols');

    if (storedData) {
      const trackedSymbols = JSON.parse(storedData);
      const fulfilledAlerts = trackedSymbols.filter(symbol => symbol.isFulfilled === true);

      if (fulfilledAlerts.length > 0) {
        // Puedes ordenar por fecha si tienes timestamp, aquí solo tomo la primera
        const lastFulfilledAlert = fulfilledAlerts[0];
        setLastActivity(`El símbolo ${lastFulfilledAlert.symbol} alcanzó tu objetivo.`);
      } else {
        setLastActivity('No hay alertas cumplidas aún.');
      }
    } else {
      setLastActivity('No hay actividad por el momento.');
    }
  }, []);

  return (
    <div style={styles.statsCard}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space align="center">
          <ClockCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <Text style={{ color: 'white' }}>Última Actividad</Text>
        </Space>

        <Space style={{ marginTop: '8px' }} direction="vertical" align="center">
          {lastActivity && lastActivity.includes('alcanzó tu objetivo') ? (
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {lastActivity}
            </Text>
          ) : lastActivity === 'No hay alertas cumplidas aún.' ? (
            <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
          No hay actividad por el momento.
            </Text>
          ) : (
            <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
              No hay actividad por el momento.
            </Text>
          )}
        </Space>
      </Space>
    </div>
  );
};

export default LastActivity;
