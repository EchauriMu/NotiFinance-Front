import React from 'react';
import { Card, Form, Select, Input, Row, Col, Alert, Button, notification, Modal } from 'antd';
import { MailOutlined, DiscordOutlined, WhatsAppOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const { Option } = Select;

export const Watchlist = ({ form, cryptoOptions, selectedNotification, selectNotification, setSelectedCrypto }) => {
  const handleFinish = async (values) => {
    if (!selectedNotification) {
      notification.error({ 
        message: "Error", 
        description: "Selecciona un medio de notificación", 
        placement: "topRight" 
      });
      return;
    }
    if (!values.crypto) {
      notification.error({ 
        message: "Error", 
        description: "Selecciona una criptomoneda", 
        placement: "topRight" 
      });
      return;
    }
    
    const payload = {
      cryptoSymbol: values.crypto,
      targetPrice: values.threshold,
      condition: true,
      typeNotification: selectedNotification,
      message: `${values.crypto} ha alcanzado tu objetivo de $${values.threshold}`,
      notificationData: "N/A"
    };

    try {
      await axiosInstance.post("/alert/post", payload);
      notification.success({
        message: "Alerta Creada",
        description: `Alerta creada correctamente para ${values.crypto} a $${values.threshold}`,
        placement: "topRight"
      });
      form.resetFields();
    } catch (error) {
      console.error("Error al crear alerta:", error);

      if (error.response?.data?.code === "NO_ALERT_SERVICE") {
        Modal.error({
          title: "Servicio No Registrado",
          content: "No tienes el servicio registrado. Ve a Configuración → Registra el servicio deseado.",
          okText: "Entendido"
        });
      } else {
        notification.error({
          message: "Error",
          description: "Error al crear alerta",
          placement: "topRight"
        });
      }
    }
  };

  return (
    <Card title="Configurar Alerta de Precio">
      <Alert
        message="Instrucciones"
        description="Seleccione una criptomoneda, ingrese un precio umbral y elija un solo medio de notificación."
        type="info"
        showIcon
        style={{ marginBottom: '16px' }}
      />
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="crypto" label="Seleccionar Criptomoneda" rules={[{ required: true, message: 'Este campo es requerido' }]}>
          <Select
            placeholder="Selecciona una crypto"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => setSelectedCrypto(value)}
          >
            {cryptoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="threshold" label="Precio Umbral" rules={[{ required: true, message: 'Ingresa un precio umbral' }]}>
          <Input prefix="$" placeholder="Ingresa el precio umbral" type="number" />
        </Form.Item>

        <Form.Item name="notifications" label="Medios de Notificación">
          <Row gutter={[16, 16]}>
            {[
              { type: 'email', label: 'Email', icon: <MailOutlined style={{ color: '#faad14', fontSize: '36px' }} /> },
              { type: 'discord', label: 'Discord', icon: <DiscordOutlined style={{ color: '#1890ff', fontSize: '36px' }} /> },
              { type: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppOutlined style={{ color: 'green', fontSize: '36px' }} /> },
            ].map(({ type, label, icon }) => (
              <Col span={8} key={type}>
                <Card
                  hoverable
                  onClick={() => selectNotification(type)}
                  style={{
                    textAlign: 'center',
                    border: selectedNotification === type ? '5px solid green' : '1px solid #d9d9d9',
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
          <Button type="primary" htmlType="submit" block>
            Crear Alerta
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
