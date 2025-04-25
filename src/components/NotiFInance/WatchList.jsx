import React, { useState } from 'react';
import { Card, Form, Select, Input, Row, Col, Alert, Button, notification, Modal, Spin } from 'antd';
import { MailOutlined, DiscordOutlined, WhatsAppOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom'; // Cambiar useHistory por useNavigate

const { Option } = Select;

// Opciones de medios de notificación
const notificationOptions = [
  { type: 'email', label: 'Email', icon: <MailOutlined style={{ color: '#faad14', fontSize: 36 }} /> },
  { type: 'discord', label: 'Discord', icon: <DiscordOutlined style={{ color: '#1890ff', fontSize: 36 }} /> },
  { type: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppOutlined style={{ color: 'green', fontSize: 36 }} /> }
];

export const Watchlist = ({ form, cryptoOptions, selectedNotification, selectNotification, setSelectedCrypto, onAlertCreated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Reemplazar useHistory con useNavigate

  // Crear alerta con validaciones
  const handleFinish = async ({ crypto, threshold }) => {
    // Validación de campos
    if (!selectedNotification || !crypto) {
      return notification.error({
        message: 'Error',
        description: !crypto ? 'Selecciona una criptomoneda' : 'Selecciona un medio de notificación',
        placement: 'topRight'
      });
    }

    const payload = {
      cryptoSymbol: crypto,
      targetPrice: threshold,
      condition: true,
      typeNotification: selectedNotification,
      message: `${crypto} ha alcanzado tu objetivo de $${threshold}`,
      notificationData: 'N/A'
    };

    try {
      setLoading(true);
      // Intentar crear la alerta
      await axiosInstance.post('/alert/post', payload);

      // Notificación de éxito
      notification.success({
        message: 'Alerta Creada',
        description: `Alerta para ${crypto} a $${threshold} creada correctamente`,
        placement: 'topRight'
      });
      form.resetFields();
      onAlertCreated();
    } catch (error) {
      const code = error.response?.data?.code;

      // Caso de servicio no registrado
      if (code === 'NO_ALERT_SERVICE') {
        Modal.error({
          title: 'Servicio No Registrado',
          content: 'Ve a Configuración → Registra el servicio deseado.',
          okText: 'Entendido'
        });
      }

      // Caso de límite alcanzado en el plan
      else if (code === 'LIMIT_ERROR' || error.response?.status === 429) {
        Modal.warning({
          title: 'Límite de Alertas Alcanzado',
          content: 'Tu plan actual no permite crear más alertas. Si deseas más alertas, por favor actualiza tu plan.',
          okText: 'Actualizar plan',
          onOk: () => navigate('/payments') // Reemplazar history.push con navigate
        });
      } else {
        // Otro error genérico
        notification.error({
          message: 'Error',
          description: 'Error al crear alerta',
          placement: 'topRight'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Configurar Nueva Alerta de Precio">
      <Spin spinning={loading} size="large">
        <Alert
          message="Instrucciones"
          description="Seleccione una criptomoneda, ingrese un precio umbral y elija un solo medio de notificación."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="crypto" label="Seleccionar Criptomoneda" rules={[{ required: true, message: 'Este campo es requerido' }]}>
            <Select
              placeholder="Selecciona una crypto"
              showSearch
              disabled={loading}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              onChange={setSelectedCrypto}
            >
              {cryptoOptions.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="threshold" label="Precio Umbral" rules={[{ required: true, message: 'Ingresa un precio umbral' }]}>
            <Input prefix="$" placeholder="Ingresa el precio umbral" type="number" disabled={loading} />
          </Form.Item>

          <Form.Item name="notifications" label="Medios de Notificación">
            <Row gutter={[16, 16]}>
              {notificationOptions.map(({ type, label, icon }) => (
                <Col span={8} key={type}>
                  <Card
                    hoverable
                    onClick={() => !loading && selectNotification(type)}
                    style={{
                      textAlign: 'center',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1,
                      border: selectedNotification === type ? '5px solid green' : '1px solid #d9d9d9'
                    }}
                  >
                    {icon}
                    <p style={{ margin: 0 }}>{label}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              Crear Alerta
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};
