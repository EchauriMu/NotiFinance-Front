import React, { useState } from 'react';
import { Space, Divider, Button, Row, Col } from 'antd';
import NameModal from './NameModal';
import PasswordRecoveryModal from './PasswordRecoveryModal';
import MediaSettingsModal from './MediaSettingsModal';
import BillingSettingsModal from './BillingSettingsModal';
import SupportSection from './SupportSection';
import SessionEndingModal from './SessionEndingModal';

const ProfileSettings = () => {
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 0 }}>
        {/* Configuración de Perfil */}
        <Divider style={{ margin: 0 }} orientation="left">Configuración de Perfil</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <NameModal />
          </Col>
          <Col xs={24} sm={12} md={12}>
            <PasswordRecoveryModal />
          </Col>
        </Row>

        {/* Configuración de Facturación */}
        <Divider style={{ margin: 0 }} orientation="left">Configuración de Plan</Divider>
           <Button type="default" block onClick={() => setIsBillingModalOpen(true)}>
          Abrir Configuración de Plan
        </Button>
        <BillingSettingsModal
          open={isBillingModalOpen}
          onClose={() => setIsBillingModalOpen(false)}
        />

        <Divider style={{ margin: 0 }} orientation="left">Soporte</Divider>
        <SupportSection />
      </Space>

      {/* Modales externos */}
      <MediaSettingsModal />
      <SessionEndingModal />
    </>
  );
};

export default ProfileSettings;