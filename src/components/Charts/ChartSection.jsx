// CryptoChart.js
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Select, Alert, Button, Space } from 'antd';
import { fetchCryptos } from '../../functions/fetchCryptos';
import { fetchChartData } from '../../functions/fetchChartData';
import PriceChart from './PriceChart';
import PriceDisplay from './PriceDisplay';

const styles = {
  card: {
    border: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '20px',
    padding: '20px',
  },
  buttonGroup: {
    marginBottom: '20px',
  }
};

const CryptoChart = () => {
  const [cryptos, setCryptos] = useState([]);
  const [symbolsLoading, setSymbolsLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [interval, setInterval] = useState('1h');

  const loadCryptos = async () => {
    setSymbolsLoading(true);
    const storedCryptos = sessionStorage.getItem('cryptos');
    if (storedCryptos) {
      setCryptos(JSON.parse(storedCryptos));
      setSymbolsLoading(false);
    } else {
      const cryptosList = await fetchCryptos();
      setCryptos(cryptosList);
      sessionStorage.setItem('cryptos', JSON.stringify(cryptosList));
      setSymbolsLoading(false);
    }
  };

  const loadChartData = async () => {
    if (!selectedCrypto) return;
    setLoadingChart(true);
    const data = await fetchChartData(selectedCrypto, 'USD', interval);
    setChartData(data.reverse());
    setLoadingChart(false);
  };

  useEffect(() => {
    loadCryptos();
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      loadChartData();
    }
  }, [selectedCrypto, interval]);

  return (
    <Card style={styles.card}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          {!selectedCrypto && !loadingChart && (
            <Alert
              message="¡Importante!"
              description="Por favor, selecciona una criptomoneda para ver el gráfico."
              type="warning"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}
          
          <Select
            showSearch
            style={{ width: '100%', marginBottom: '20px' }}
            value={selectedCrypto}
            onChange={(value) => setSelectedCrypto(value)}
            placeholder="Selecciona una criptomoneda"
            loading={symbolsLoading}
          >
            {cryptos.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>

          <PriceDisplay selectedCrypto={selectedCrypto} />

          <Space style={{ ...styles.buttonGroup, display: 'flex', flexWrap: 'wrap' }}>
            {['1min', '5min', '15min', '30min', '45min', '1h', '2h', '4h', '8h', '1day', '1week', '1month'].map(intervalOption => (
              <Button
                key={intervalOption}
                type={interval === intervalOption ? 'primary' : 'default'}
                onClick={() => setInterval(intervalOption)}
                style={{ margin: '5px' }}
              >
                {intervalOption}
              </Button>
            ))}
          </Space>

          <PriceChart 
            chartData={chartData}
            loadingChart={loadingChart}
            selectedCrypto={selectedCrypto}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CryptoChart;