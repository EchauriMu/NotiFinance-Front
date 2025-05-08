import React, { useEffect, useState } from 'react';
import { Input, List, Typography, Spin } from 'antd';

const { Search } = Input;
const { Text , Title} = Typography;

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCryptos = async () => {
    try {
      const response = await fetch(
        'https://api.twelvedata.com/cryptocurrencies?apikey=e02c4efdc3994bcea6d15a6758f0ca6d'
      );
      const data = await response.json();

      // Filtrar solo los pares con cotización en USD
      const usdPairs = data.data.filter(
        (crypto) => crypto.currency_quote === 'US Dollar'
      );

      setCryptos(usdPairs);
      setFiltered(usdPairs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
  }, []);

  const onSearch = (value) => {
    const term = value.toLowerCase();
    const results = cryptos.filter(
      (crypto) =>
        crypto.symbol.toLowerCase().includes(term) ||
        crypto.currency_base.toLowerCase().includes(term) ||
        crypto.currency_quote.toLowerCase().includes(term)
    );
    setFiltered(results);
  };

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
           <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 , fontWeight:700}}>
            <span style={{ color: 'white' }}>Noti</span>
            <span style={{ color: '#fa8c16' }}>Finance</span>
          </Title>
        </div>

    <Title>Cryptomonedas dispibles en nuestra plataforma: </Title>
      <Search
        placeholder="Buscar símbolo o nombre"
        onSearch={onSearch}
        allowClear
        enterButton
        style={{ marginBottom: 24 }}
      />

{loading ? (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <Spin size="large" />
  </div>
) : (

        <List
          bordered
          itemLayout="vertical"
          dataSource={filtered}
          pagination={{ pageSize: 10 }}
          renderItem={(crypto) => (
            <List.Item key={crypto.symbol}>
              <List.Item.Meta
                title={<Text strong>Simbolo: {crypto.symbol}</Text>}
                description={
                  <>
                    <div>
                      <Text type="primary">Nombre:</Text> {crypto.currency_base}
                    </div>
                    <div>
                      <Text type="primary">Tipo de cambio:</Text> {crypto.currency_quote}
                    </div>
                    <div>
                      <Text type="primary">Lugares de cambio:</Text>{' '}
                      {crypto.available_exchanges.join(', ')}
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default CryptoList;
