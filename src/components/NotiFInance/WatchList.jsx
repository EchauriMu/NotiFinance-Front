import React, { useState } from 'react';
import {
  Card, Form, Select, Input, Row, Col, Alert, Button, notification, Spin
} from 'antd';
import {
  MailOutlined, DiscordOutlined, WhatsAppOutlined
} from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import LimitReachedModal from './LimitCreate';
import ServiceNotRegisteredModal from './NoData';

const { Option } = Select;
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
  const [loading, setLoading] = useState(false);
  const [showLimit, setShowLimit] = useState(false);
  const [showService, setShowService] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async ({ crypto, threshold }) => {
    if (!selectedNotification || !crypto) {
      return notification.error({
        message: 'Error',
        description: !crypto
          ? 'Selecciona una criptomoneda'
          : 'Selecciona un medio de notificación',
        placement: 'topRight'
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
        placement: 'topRight'
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
          placement: 'topRight'
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Configurar Nueva Alerta de Precio">
      <Spin spinning={loading}>
        <Alert
          message="Instrucciones"
          description="Seleccione una criptomoneda, ingrese un precio umbral y elija un medio de notificación."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
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
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('El precio no puede ser negativo')
                      )
              }
            ]}
          >
            <Input
              prefix="$"
              placeholder="Ingresa el precio umbral"
              type="number"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item name="notifications" label="Medios de Notificación">
            <Row gutter={[16, 16]}>
              {Object.entries(icons).map(([type, icon]) => (
                <Col span={8} key={type}>
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
                    <p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
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
