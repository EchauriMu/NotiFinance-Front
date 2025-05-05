import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
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

      // Obtener la fecha de expiración solo con el formato YYYY-MM-DD
      const expirationDate = new Date(subscriptionExpiresAt);
      const expirationDateStr = expirationDate.toLocaleDateString('en-CA'); // YYYY-MM-DD

      // Obtener la fecha actual en Tepic en formato YYYY-MM-DD
      const todayInTepic = getDateInTepic();

      // Comparar solo las fechas (sin horas, minutos, segundos)
      if (expirationDateStr === todayInTepic) {
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
          Tu suscripción vence hoy. Las alertas activas se desactivarán al expirar.
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
