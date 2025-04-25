import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const SubscriptionWarning = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userDataStr = sessionStorage.getItem('userData');
    if (!userDataStr) return;

    try {
      const userData = JSON.parse(userDataStr);
      const { subscriptionExpiresAt } = userData;

      if (!subscriptionExpiresAt) return;

      const expirationDate = new Date(subscriptionExpiresAt);
      const today = new Date();

      // Normalizamos ambas fechas a medianoche para comparar solo fechas
      expirationDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const timeDiff = expirationDate - today;
      const daysRemaining = timeDiff / (1000 * 60 * 60 * 24);

      if (daysRemaining === 1) {
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
      title="⚠️ Tu suscripción está por expirar"
    >
      <div style={{ fontSize: 18 }}>
        <p>
          Tu suscripción vence en menos de 24 horas. Las alertas activas se desactivarán al expirar.
        </p>
        <p>
          Si superas los límites del plan Freemium, tus recursos serán recortados automáticamente.
        </p>
        <p>
          Para evitar interrupciones en el servicio, te recomendamos actualizar tu plan cuanto antes.
        </p>
      </div>
    </Modal>
  );
};

export default SubscriptionWarning;
