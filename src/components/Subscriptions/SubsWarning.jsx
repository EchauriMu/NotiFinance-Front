import React, { useEffect, useState } from 'react';
import { Modal, Button , Alert} from 'antd';
import { useNavigate } from 'react-router-dom';

const SubscriptionWarning = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Función para obtener la fecha actual en Tepic (GMT-6)
  const getDateInTepic = () => {
    const date = new Date();
    // Formato YYYY-MM-DD (sin horas, minutos ni segundos)
    return date.toLocaleDateString('en-CA'); // Este formato es YYYY-MM-DD
  };

  useEffect(() => {
    const userDataStr = sessionStorage.getItem('userData');
    if (!userDataStr) return;

    try {
      const userData = JSON.parse(userDataStr);
      const { subscriptionExpiresAt } = userData;

      if (!subscriptionExpiresAt) return;

      console.log('subscriptionExpiresAt raw:', subscriptionExpiresAt);

      // Obtener la fecha de expiración en formato Date
      const expirationDate = new Date(subscriptionExpiresAt);
      const expirationDateStr = expirationDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
      console.log('expirationDateStr:', expirationDateStr);

      // Calcular un día antes de la expiración
      const dayBefore = new Date(expirationDate);
      dayBefore.setDate(dayBefore.getDate() - 1);
      const dayBeforeStr = dayBefore.toLocaleDateString('en-CA');
      console.log('dayBeforeExpirationStr:', dayBeforeStr);

      // Fecha actual en Tepic
      const todayInTepic = getDateInTepic();
      console.log('todayInTepic:', todayInTepic);

      // Mostrar modal si es un día antes de la expiración
      if (dayBeforeStr === todayInTepic) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error al procesar los datos de la suscripción:', error);
    }
  }, []);

  const handleRedirect = () => {
    setShowModal(false);
    navigate('/subscription');
  };

  return (
    <Modal
    width={700}
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>,
        <Button key="redirect" type="primary" onClick={handleRedirect}>
          Ajustar mi plan
        </Button>,
      ]}
    
    >
          <Alert
          message="⚠️ Tu suscripción expira mañana"
          description="Se han desactivado las funciones premium de tu cuenta."
          type="warning"
          showIcon
          style={{ margin: 0, fontSize: 18 }}
        />
      <div style={{ fontSize: 18 }}>
        <p>
          Tu suscripción vence mañana. Las alertas activas se desactivarán al expirar.
        </p>
        <p>
          Si superas los límites del plan Freemium, tus recursos serán recortados automáticamente.
        </p>
        <p>
          Para evitar interrupciones en el servicio, te recomendamos actualizar tu plan cuanto antes o activa la auto renovacion en el apartado de configuraciones.
        </p>
      </div>
    </Modal>
  );
};

export default SubscriptionWarning;