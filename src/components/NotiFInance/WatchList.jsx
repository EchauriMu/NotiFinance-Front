import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Form, Select, Input, Row, Col, Alert, Button, notification, Spin,
  Typography, Tag
} from 'antd';
import {
  MailOutlined, DiscordOutlined, WhatsAppOutlined
} from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import LimitReachedModal from './LimitCreate';
import ServiceNotRegisteredModal from './NoData';

const { Option } = Select;
const { Title } = Typography;
const icons = {
  email: <MailOutlined style={{ color: '#faad14', fontSize: 36 }} />,
  discord: <DiscordOutlined style={{ color: '#1890ff', fontSize: 36 }} />,
  whatsapp: <WhatsAppOutlined style={{ color: 'green', fontSize: 36 }} />
};

export const Watchlist = ({
  form,
  cryptoOptions,
  selectedNotification,
  selectNotification,
  setSelectedCrypto,
  onAlertCreated
}) => {
  // =========== ESTADOS ===========
  const [loading, setLoading] = useState(false);
  const [showLimit, setShowLimit] = useState(false);
  const [showService, setShowService] = useState(false);
  const [price, setPrice] = useState(null);
  const [color, setColor] = useState('default');
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // =========== OBTENER PRECIO DE LA CRIPTO SELECCIONADA ===========
  const fetchPrice = async (symbol) => {
    if (!symbol) return;
    try {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`
      );
      const data = await response.json();
      const newPrice = data.USD;
      const storedPrice = sessionStorage.getItem(`price_${symbol}`);
      if (storedPrice) {
        const prevPrice = parseFloat(storedPrice);
        if (newPrice > prevPrice) setColor('green');
        else if (newPrice < prevPrice) setColor('red');
        if (newPrice !== prevPrice) {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setColor('default'), 4000);
        }
      }
      sessionStorage.setItem(`price_${symbol}`, newPrice);
      setPrice(newPrice);
    } catch (error) {
      setPrice(null);
    }
  };

  // =========== EFECTO: ACTUALIZAR PRECIO AL CAMBIAR CRIPTO ===========
  useEffect(() => {
    if (!form.getFieldValue('crypto')) return;
    fetchPrice(form.getFieldValue('crypto'));
    const intervalId = setInterval(() => fetchPrice(form.getFieldValue('crypto')), 10000);
    return () => {
      clearInterval(intervalId);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form.getFieldValue('crypto')]);

  // =========== MANEJADOR DE ENVIO DEL FORMULARIO ===========
  const handleFinish = async ({ crypto, threshold }) => {
    if (!selectedNotification || !crypto) {
      return notification.error({
        message: 'Error',
        description: !crypto
          ? 'Selecciona una criptomoneda'
          : 'Selecciona un medio de notificación',
        placement: 'bottomRight' // <-- bottomRight
      });
    }

    try {
      setLoading(true);
      await axiosInstance.post('/alert/post', {
        cryptoSymbol: crypto,
        targetPrice: threshold,
        condition: true,
        typeNotification: selectedNotification,
        message: `${crypto} ha alcanzado tu objetivo de $${threshold}`,
        notificationData: 'N/A'
      });

      notification.success({
        message: 'Alerta Creada',
        description: `Alerta para ${crypto} a $${threshold} creada correctamente`,
        placement: 'bottomRight' // <-- bottomRight
      });

      form.resetFields();
      onAlertCreated();
    } catch (error) {
      const code = error.response?.data?.code;
      if (code === 'NO_ALERT_SERVICE') setShowService(true);
      else if (code === 'LIMIT_ERROR' || error.response?.status === 429)
        setShowLimit(true);
      else
        notification.error({
          message: 'Error',
          description: 'Error al crear alerta',
          placement: 'bottomRight' // <-- bottomRight
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Configurar Nueva Alerta de Precio">
      <Spin spinning={loading}>
        {/* =========== PRECIO ACTUAL DE LA CRIPTO SELECCIONADA =========== */}
      
        <Alert
          message="Instrucciones"
          description={
            <>
              Seleccione una criptomoneda, ingrese un precio umbral (en $usd) y elija un medio de notificación.{" "}
              ¿No conoces los símbolos? Conoce qué mercados podemos ofrecerte{" "}
              <a
                href="/list"
                target="_blank"
                rel="noopener noreferrer"
              >
                aquí
              </a>
              .
            </>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
          {form.getFieldValue('crypto') && price !== null && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title level={5}>
              Precio actual de {form.getFieldValue('crypto')}: {' '}
              <Tag color={color} style={{ fontSize: '18px', padding: '4px 10px' }}>
                ${price} USD
              </Tag>
            </Title>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="crypto"
            label="Seleccionar Criptomoneda"
            rules={[{ required: true, message: 'Este campo es requerido' }]}
          >
            <Select
              placeholder="Selecciona una crypto"
              showSearch
              disabled={loading}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={setSelectedCrypto}
            >
              {cryptoOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="threshold"
            label="Precio Umbral"
            rules={[
              { required: true, message: 'Ingresa un precio umbral' },
              {
                validator: (_, value) => {
                  const num = Number(value);
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error('Ingresa un precio umbral'));
                  }
                  if (isNaN(num)) {
                    return Promise.reject(new Error('El precio debe ser un número'));
                  }
                  if (num < 0) {
                    return Promise.reject(new Error('El precio no puede ser negativo'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input
              prefix="$"
              placeholder="Ingresa el precio umbral"
              type="number"
              step="any"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item name="notifications" label="Medios de Notificación">
            <Row gutter={[16, 16]}>
              {Object.entries(icons).map(([type, icon]) => (
                <Col xs={12} md={12} lg={8} key={type}>
                  <Card
                    hoverable
                    onClick={() => !loading && selectNotification(type)}
                    style={{
                    
                      textAlign: 'center',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1,
                      border:
                        selectedNotification === type
                          ? '5px solid green'
                          : '1px solid #d9d9d9'
                    }}
                  >
                    {icon}
                    <p >{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={loading}
            >
              Crear Alerta
            </Button>
          </Form.Item>
        </Form>
      </Spin>

      <ServiceNotRegisteredModal
        visible={showService}
        onClose={() => setShowService(false)}
      />
      <LimitReachedModal
        visible={showLimit}
        onClose={() => setShowLimit(false)}
      />
    </Card>
  );
};
