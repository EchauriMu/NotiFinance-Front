import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Row, Col, Typography, Skeleton, Divider, Alert, Button, Space, Badge } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { Title, Text } = Typography;

const Calendario = () => {
  const [eventsByDate, setEventsByDate] = useState({});  // { 'YYYY-MM-DD': [event, ...], ... }
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('basic');

  // 1️⃣ Leer role de sessionStorage
  useEffect(() => {
    const userDataRaw = sessionStorage.getItem('userData');
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        setUserRole(userData.role || 'basic');
      } catch (e) {
        console.error('Error al parsear userData:', e);
      }
    }
  }, []);

  // 2️⃣ Fetch de todos los eventos de hoy a +7 días, al montar
  useEffect(() => {
    const fetchWeekEvents = async () => {
      setLoading(true);
      const start = dayjs().startOf('day').utc().format('YYYY-MM-DD');
      const end = dayjs().startOf('day').add(7, 'day').utc().format('YYYY-MM-DD');
      const url = `https://cors-anywhere.herokuapp.com/https://developers.coinmarketcal.com/v1/events?max=100&dateRangeStart=${start}&dateRangeEnd=${end}`;
      try {
        const resp = await fetch(url, {
          headers: {
            'x-api-key': 'SgwTxzBFp6103JuQLwBSJ6Up3zdJeSkI6HHGU6jm',
            'Access-Control-Allow-Origin': '*',
          },
        });
        const json = await resp.json();
        const allEvents = json.body || [];
        // Agrupar por fecha
        const grouped = {};
        allEvents.forEach(evt => {
          const dateKey = dayjs(evt.date_event).utc().format('YYYY-MM-DD');
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(evt);
        });
        setEventsByDate(grouped);
      } catch (err) {
        console.error('Error cargando eventos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeekEvents();
  }, []);

  // 3️⃣ Render de cada celda: hasta 2 eventos como badges
  const dateCellRender = (value) => {
    const dateKey = dayjs(value).utc().format('YYYY-MM-DD');
    const events = eventsByDate[dateKey] || [];

    if (loading) {
      // Mostrar Skeleton mientras se cargan los datos
      return (
        <div style={{ padding: '8px' }}>
          <Skeleton active title={false} paragraph={{ rows: 1, width: '100%' }} />
        </div>
      );
    }

    return (
      <ul className="events-list" style={{ padding: 0, listStyle: 'none' }}>
        {events.slice(0, 2).map(evt => (
          <li key={evt.id}>
            <Badge status="success" text={evt.coins[0].symbol + ': ' + evt.title.en} />
          </li>
        ))}
        {events.length > 2 && (
          <li>
            <Text type="secondary">+{events.length - 2} más</Text>
          </li>
        )}
      </ul>
    );
  };

  // 4️⃣ Al clicar, mostrar modal con todos los eventos de ese día
  const handleDateClick = (date) => {
    setSelectedDate(dayjs(date).utc().format('YYYY-MM-DD'));
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  const handleAddEvent = () => {
    console.log("Añadir evento");
  };

  const handleMyEvents = () => {
    console.log("Ver mis eventos");
  };

  const eventsForSelectedDate = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  return (
    <div style={{ padding: '0px 4px' }}>
      <Title style={{ margin:'10px 0px'}}level={3}>Calendario de Eventos</Title>

      <Alert
        message="Seleccione una fecha para ver los evento relevantes"
        type="info"
        description="La fecha mostrada está en formato UTC. Puede variar respecto a tu fecha local."
        showIcon
        style={{ marginBottom: 16 }}
      />

      {userRole !== 'basic' && (
        <Space style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={handleAddEvent}>Añadir Evento</Button>
          <Button onClick={handleMyEvents}>Mis Eventos</Button>
        </Space>
      )}

      <Calendar
        onSelect={handleDateClick}
        dateCellRender={dateCellRender}
        fullscreen
      />

      <Modal
        title={`Eventos para ${selectedDate ? dayjs(selectedDate).utc().format('DD/MM/YYYY') : ''}`}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : eventsForSelectedDate.length === 0 ? (
          <Text>No hay eventos para esta fecha.</Text>
        ) : (
          eventsForSelectedDate.map(event => (
            <div key={event.id}>
              <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                  <Title level={4}>{event.title.en}</Title>
                  <Text>Fecha: {dayjs(event.date_event).utc().format('DD/MM/YYYY')}</Text>
                </Col>
              </Row>

              <Divider />

              <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                  <Text><strong>Coin: </strong>{event.coins[0].name} ({event.coins[0].symbol})</Text>
                </Col>
              </Row>

              <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                  <Text><strong>Descripción: </strong>{event['-']}</Text>
                </Col>
              </Row>

              <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                  <Text><strong>Categorías: </strong>{event.categories.map(cat => cat.name).join(', ')}</Text>
                </Col>
              </Row>

              {event.proof && (
                <Row style={{ marginBottom: 16 }}>
                  <Col span={24}>
                    <img
                      src={event.proof}
                      alt={event.title.en}
                      style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                    />
                  </Col>
                </Row>
              )}

              <Divider />

              <Row>
                <Col span={24}>
                  <Text><strong>Fuente: </strong>
                    <a href={event.source} target="_blank" rel="noopener noreferrer">{event.source}</a>
                  </Text>
                </Col>
              </Row>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
};

export default Calendario;
