import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'antd';
import { Watchlist } from './WatchList';
import { Explore } from './Explore';
import { fetchCryptos } from '../../functions/fetchCryptos';
import { fetchNews } from '../../functions/fetchNews'; 
import { StatForum } from './StatForum';
import UserAlerts from './UserAlert';

const CryptoAlertForm = () => {
  const [form] = Form.useForm();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [cryptoOptions, setCryptoOptions] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [errorNews, setErrorNews] = useState(null);

  const [refreshAlerts, setRefreshAlerts] = useState(false);
  const triggerRefresh = () => setRefreshAlerts(prev => !prev);

  useEffect(() => {
    const loadCryptos = async () => {
      const storedCryptos = sessionStorage.getItem('cryptos');
      if (storedCryptos) {
        setCryptoOptions(JSON.parse(storedCryptos));
      } else {
        const cryptosList = await fetchCryptos();
        setCryptoOptions(cryptosList);
        sessionStorage.setItem('cryptos', JSON.stringify(cryptosList));
      }
    };
    loadCryptos();
  }, []);

  useEffect(() => {
    if (!selectedCrypto) return;

    const getNews = async () => {
      setLoadingNews(true);
      setErrorNews(null);
      try {
        const newsData = await fetchNews(selectedCrypto);
        setNews(newsData);
      } catch (error) {
        setErrorNews(error.message);
      } finally {
        setLoadingNews(false);
      }
    };

    getNews();
  }, [selectedCrypto]);

  return (
    <>
      <UserAlerts refresh={refreshAlerts} />

      <Row gutter={[16, 16]}>
        <Col span={24} xs={24} md={12}>
          <Watchlist
            form={form}
            cryptoOptions={cryptoOptions}
            selectedNotification={selectedNotification}
            selectNotification={setSelectedNotification}
            setSelectedCrypto={setSelectedCrypto}
            onAlertCreated={triggerRefresh}
          />
        </Col>
        <Col span={24} xs={24} md={12}>
          <StatForum symbol={selectedCrypto} />
          <Explore news={news} loading={loadingNews} error={errorNews} />
        </Col>
      </Row>
    </>
  );
};

export default CryptoAlertForm;
