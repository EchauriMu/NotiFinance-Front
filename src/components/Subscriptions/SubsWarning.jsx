import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

const SubscriptionWarning = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
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
      const { subscriptionExpiresAt, autoRenew } = userData;

      if (!subscriptionExpiresAt) return;

      // Obtener la fecha de expiración en formato Date
      const expirationDate = new Date(subscriptionExpiresAt);
      const expirationDateStr = expirationDate.toLocaleDateString('en-CA'); // YYYY-MM-DD

      // Calcular un día antes de la expiración
      const dayBefore = new Date(expirationDate);
      dayBefore.setDate(dayBefore.getDate() - 1);
      const dayBeforeStr = dayBefore.toLocaleDateString('en-CA');

      // Fecha actual en Tepic
      const todayInTepic = getDateInTepic();

      // Verificar si es un día antes de la expiración
      if (dayBeforeStr === todayInTepic) {
        if (autoRenew) {
          setShowRenewalModal(true); // Mostrar el modal de renovación
        } else {
          setShowModal(true); // Mostrar el modal de expiración
        }
      }
    } catch (error) {
      console.error('Error al procesar los datos de la suscripción:', error);
    }
  }, []);

  const handleRedirect = () => {
    setShowModal(false);
    navigate('/subscription');
  };

  const handleRenewalRedirect = () => {
    setShowRenewalModal(false);
    navigate('/settings'); // Redirigir a configuración
  };

  return (
    <>
      {/* Modal de advertencia por expiración */}
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

      {/* Modal de aviso de renovación automática */}
      <Modal
        width={700}
        open={showRenewalModal}
        onCancel={() => setShowRenewalModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowRenewalModal(false)}>
            Cerrar
          </Button>,
          <Button key="redirect" type="primary" onClick={handleRenewalRedirect}>
            Ir a Configuración
          </Button>,
        ]}
      >
        <Alert
          message="⚠️ Tu suscripción se renovará automáticamente mañana"
          description="El cobro se realizará debido a la renovación automática activa."
          type="info"
          showIcon
          style={{ margin: 0, fontSize: 18 }}
        />
        <div style={{ fontSize: 18 }}>
          <p>
            Mañana se realizará el cobro de la renovación automática de tu suscripción.
          </p>
          <p>
            Si deseas desactivar la renovación automática, puedes hacerlo en el apartado de configuraciones.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default SubscriptionWarning;
