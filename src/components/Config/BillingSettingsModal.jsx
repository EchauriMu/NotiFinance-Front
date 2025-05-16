import React, { useEffect, useState } from 'react';
import { Modal, Typography, Spin, notification, Switch, Card, Space, Badge, Tag, Divider, Select, Button } from 'antd';
import axiosInstance from '../../api/axiosInstance'; 
import dayjs from 'dayjs'; // Si no tienes dayjs, puedes usar new Date()
const { Title, Text } = Typography;
const { Option } = Select;

const BillingSettingsModal = ({ open, onClose }) => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [changingPlan, setChangingPlan] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const allowedPlans = ['Freemium', 'Premium', 'NotiFinance Pro'];

  useEffect(() => {
    if (open) {
      fetchPaymentInfo();
    }
  }, [open]);

  const fetchPaymentInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/subs/me/active');
      setPaymentInfo(response.data);
      setAutoRenew(response.data.autoRenew);
      console.log('Payment Info:', response.data.plan);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error al cargar la suscripción',
        description: error.response?.data?.message || 'Hubo un problema al cargar la información de tu suscripción.',
        placement: 'bottomRight',
      });
    }
  };

  const handleChangePlan = async () => {
    setChangingPlan(true);
    try {
      const effectiveDate = dayjs().add(1, 'day').toISOString();
      const response = await axiosInstance.post('/subs/changeplan', {
        newRequestedPlan: selectedPlan,
        effectiveDate,
      });
      if (response.data.success) {
        notification.success({
          message: 'Solicitud enviada',
          description: 'El cambio de plan ha sido solicitado correctamente.',
          placement: 'bottomRight',
        });
        setConfirmModalVisible(false);
        fetchPaymentInfo();
      } else {
        notification.error({
          message: 'Error',
          description: response.data.message || 'No se pudo solicitar el cambio de plan.',
          placement: 'bottomRight',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'No se pudo solicitar el cambio de plan.',
        placement: 'bottomRight',
      });
    }
    setChangingPlan(false);
  };

  const renderStatusBadge = (status) => {
    let color;
    switch (status) {
      case 'active':
        color = 'green';
        break;
      case 'expired':
        color = 'red';
        break;
      case 'canceled':
        color = 'volcano';
        break;
      case 'trial':
        color = 'blue';
        break;
      default:
        color = 'grey';
    }
    return <Badge color={color} text={status} />;
  };

  return (
    <>
      <Modal
        title="Configuración de Facturación"
        open={open}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
            </div>
          ) : paymentInfo ? (
            <div>
              <Title level={4}>Detalles de la Suscripción</Title>
              <Card bordered={false} style={{ marginBottom: 20 }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Plan:</Text> <Text>{paymentInfo.plan}</Text>
                  </div>
                  <Divider />
                  <div>
                    <Text strong>Estado:</Text> <Space>{renderStatusBadge(paymentInfo.status)}</Space>
                  </div>
                </Space>
              </Card>

              {paymentInfo.planChangeRequested ? (
                // Mostrar información del cambio de plan pendiente
                <Card bordered={false} style={{ marginBottom: 20 }}>
                  <Title style={{margin:0}} level={4}>Cambio de Plan</Title>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{marginTop:10}}>
                      <Text strong>Nuevo Plan Solicitado:</Text>{' '}
                      <Tag color="blue" style={{ fontSize: '14px', padding: '5px 10px' }}>
                        {paymentInfo.newRequestedPlan}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>Fecha Efectiva del Cambio:</Text>{' '}
                      <Tag color="green" style={{ fontSize: '14px', padding: '5px 10px' }}>
                        {new Date(paymentInfo.planChangeEffectiveDate).toLocaleDateString()}
                      </Tag>
                    </div>
                    <div>
                      <Badge
                        status="processing"
                        text="Cambio pendiente"
                        style={{ fontSize: '14px', marginTop: '10px' }}
                      />
                    </div>
                  </Space>
                </Card>
              ) : (
                // Mostrar opción para cambiar de plan si no hay solicitud pendiente
                <>
                  <Title level={4}>Cambio de Plan</Title>
                  <Card bordered={false} style={{ marginBottom: 20 }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      {paymentInfo.plan && paymentInfo.plan.toLowerCase() === 'freemium' ? (
                        <Button
                          type="primary"
                          block
                          onClick={() => window.open('https://notifinance-es.netlify.app/subscription')}
                        >
                          Comprar un plan en notifinance.es
                        </Button>
                      ) : (
                        <>
                          <div>
                            <Text strong>Selecciona un nuevo plan:</Text>
                            <Select
                              style={{ width: '100%', marginTop: 10 }}
                              placeholder="Selecciona un plan"
                              value={selectedPlan}
                              onChange={(value) => setSelectedPlan(value)}
                            >
                              {['Premium', 'NotiFinance Pro']
                                .filter((plan) => plan !== paymentInfo.plan)
                                .map((plan) => (
                                  <Option key={plan} value={plan}>
                                    {plan}
                                  </Option>
                                ))}
                            </Select>
                          </div>
                          <Button
                            type="primary"
                            onClick={() => setConfirmModalVisible(true)}
                            loading={changingPlan}
                            disabled={!selectedPlan || selectedPlan === paymentInfo.plan}
                          >
                            Cambiar Plan
                          </Button>
                        </>
                      )}
                    </Space>
                  </Card>
                </>
              )}

              {paymentInfo.plan && paymentInfo.plan.toLowerCase() !== 'freemium' && (
                <Card bordered={false} style={{ marginBottom: 20 }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Text strong>Renovación automática:</Text>
                      <Switch
                        checked={autoRenew}
                        onChange={async (checked) => {
                          setAutoRenew(checked);
                          try {
                            await axiosInstance.patch('/subs/autorenew', { autoRenew: checked });
                            notification.success({
                              message: 'Auto-renovación actualizada',
                              description: checked
                                ? 'La auto-renovación está activada.'
                                : 'La auto-renovación está desactivada.',
                              placement: 'bottomRight',
                            });
                          } catch (error) {
                            notification.error({
                              message: 'Error',
                              description: error.response?.data?.error || 'No se pudo actualizar la auto-renovación.',
                              placement: 'bottomRight',
                            });
                            setAutoRenew(!checked); // Revertir en caso de error
                          }
                        }}
                        style={{ marginLeft: 10, marginRight: 10 }}
                      />
                      <Badge
                        status={autoRenew ? 'success' : 'default'}
                        text={autoRenew ? 'Activada' : 'Desactivada'}
                      />
                    </div>
                  </Space>
                </Card>
              )}

              {paymentInfo.plan && paymentInfo.plan.toLowerCase() !== 'freemium' ? (
                <>
                  <Title level={4}>Detalles de Pago</Title>
                  <Card bordered={false} style={{ marginBottom: 20 }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Método de Pago:</Text> <Text>Tarjeta de Crédito (TC)</Text>
                      </div>
                      <div>
                        <Text strong>Últimos 4 dígitos de la tarjeta:</Text> <Tag>{paymentInfo.last4}</Tag>
                      </div>
                      <div>
                        <Text strong>Fecha de Expiración:</Text> <Tag>{paymentInfo.FC || 'No disponible'}</Tag>
                      </div>
                    </Space>
                  </Card>
                </>
              ) : (
                <Text>Este plan no incluye opciones de pago ni renovación automática.</Text>
              )}
            </div>
          ) : (
            <Text>No hay información de suscripción activa.</Text>
          )}
        </div>
      </Modal>
      {confirmModalVisible && (
        <Modal
          title="Confirmar cambio de plan"
          open={confirmModalVisible}
          onOk={handleChangePlan}
          onCancel={() => setConfirmModalVisible(false)}
          okText="Confirmar"
          cancelText="Cancelar"
          confirmLoading={changingPlan}
        >
          <p>
            ¿Estás seguro de que deseas solicitar el cambio al plan <b>{selectedPlan}</b>?
          </p>
        </Modal>
      )}
    </>
  );
};

export default BillingSettingsModal;
