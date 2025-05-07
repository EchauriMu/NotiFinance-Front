import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Row, Col, Typography, Skeleton, Divider, Alert, Button, Space } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { Title, Text } = Typography;

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('basic'); // default to basic

  // Cargar userData desde sessionStorage
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

  const fetchEvents = async (date) => {
    const dateFormatted = dayjs(date).utc().format('YYYY-MM-DD');
    console.log('fecha: ' +dateFormatted);
    const url = `https://cors-anywhere.herokuapp.com/https://developers.coinmarketcal.com/v1/events?max=5&dateRangeStart=${dateFormatted}&dateRangeEnd=${dateFormatted}`;
    console.log('url generada: ' + url);
    const response = await fetch(url, {
      headers: {
        'x-api-key': 'SgwTxzBFp6103JuQLwBSJ6Up3zdJeSkI6HHGU6jm',
        'Access-Control-Allow-Origin': '*',
      },
    });
    const data = await response.json();
    console.log('datos traido: ' + response);
    return data.body || [];
  };

  const handleDateClick = async (date) => {
    console.log('fecha clickeada: ' + date)
    setSelectedDate(date);
    setIsModalVisible(true);
    setLoading(true);
    const eventsForSelectedDate = await fetchEvents(date);
    console.log(eventsForSelectedDate);
    setEvents(eventsForSelectedDate);
    setLoading(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEvents([]);
  };

  const handleAddEvent = () => {
    console.log("Añadir evento");
  };

  const handleMyEvents = () => {
    console.log("Ver mis eventos");
  };

  return (
    <div style={{ padding: '0px 24px' }}>
      <Title level={3}>Calendario de Eventos</Title>

      <Alert
        message="Información sobre la Fecha"
        description="La fecha mostrada está en formato UTC. Puede variar respecto a tu fecha local."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* Mostrar botones solo si el usuario NO es básico */}
      {userRole !== 'basic' && (
        <Space style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={handleAddEvent}>Añadir Evento</Button>
          <Button onClick={handleMyEvents}>Mis Eventos</Button>
        </Space>
      )}

      <Calendar
        onSelect={handleDateClick}
        fullscreen={true}
      />

      <Modal
        title={`Eventos para ${selectedDate ? dayjs(selectedDate).utc().format('DD/MM/YYYY'): ''}`}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : events.length === 0 ? (
          <Text>No hay eventos para esta fecha.</Text>
        ) : (
          events.map(event => (
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

              <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                  <img
                    src={event.proof}
                    alt={event.title.en}
                    style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                  />
                </Col>
              </Row>

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
