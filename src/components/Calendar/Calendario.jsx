import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Row, Col, List, Button } from 'antd';
import dayjs from 'dayjs'; // Importamos dayjs

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);

  // Fetch de eventos desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('https://developers.coinmarketcal.com/v1/events?max=5&dateRangeStart=2025-05-01&dateRangeEnd=2025-05-07', {
        headers: {
          'x-api-key': 'SgwTxzBFp6103JuQLwBSJ6Up3zdJeSkI6HHGU6jm',
        },
      });
      console.log(data);
      const data = await response.json();
      setEvents(data.body);
    };

    fetchEvents();
  }, []);

  // Función para manejar la selección de una fecha
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = date.format('YYYY-MM-DD');
    const eventsOnThisDate = events.filter((event) => event.date_event.startsWith(dateStr));
    setEventsOnSelectedDate(eventsOnThisDate);
    setModalVisible(true);
  };

  // Renderizar las celdas del calendario con eventos
  const dateCellRender = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const eventsOnDay = events.filter((event) => event.date_event.startsWith(dateStr));

    return (
      <ul>
        {eventsOnDay.map((event) => (
          <li key={event.id} style={{ cursor: 'pointer', color: '#1890ff' }}>
            {event.title.en}
          </li>
        ))}
      </ul>
    );
  };

  // Render modal con la lista de eventos del día seleccionado
  const renderEventModal = () => {
    return (
      <Modal
        title={`Eventos en ${selectedDate ? selectedDate.format('MMMM D, YYYY') : ''}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={<Button onClick={() => setModalVisible(false)}>Cerrar</Button>}
      >
        <Row gutter={16}>
          <Col span={24}>
            {eventsOnSelectedDate.length === 0 ? (
              <p>No hay eventos para esta fecha.</p>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={eventsOnSelectedDate}
                renderItem={(event) => (
                  <List.Item>
                    <List.Item.Meta
                      title={event.title.en}
                      description={
                        <>
                          <p><strong>Categoría:</strong> {event.categories.map((category) => category.name).join(', ')}</p>
                          <p><strong>Fuente:</strong> <a href={event.source} target="_blank" rel="noopener noreferrer">Ver evento</a></p>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Col>
        </Row>
      </Modal>
    );
  };

  return (
    <div>
      <h2>Calendario de Eventos</h2>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={handleDateSelect}
        fullscreen={false} // Desactivamos fullscreen para un mejor control de tamaño
      />
      {renderEventModal()}
    </div>
  );
};

export default EventCalendar;
