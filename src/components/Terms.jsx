// src/components/TermsAndConditions.js
import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const TermsAndConditions = () => {
  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto', backgroundColor: '#1f1f1f', color: 'white', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
          <span style={{ color: 'white' }}>Noti</span>
          <span style={{ color: '#ffa500' }}>Finance</span>
        </Title>
      </div>

      <Title level={3} style={{ color: '#ffa500' }}>Términos y Condiciones de Uso</Title>
      <Paragraph><strong>Fecha de entrada en vigor:</strong> 04 de marzo de 2025</Paragraph>

      <Paragraph><strong>1. Aceptación de los Términos:</strong> El uso del servicio web <strong>NotiFinance</strong> implica la aceptación plena de estos Términos y Condiciones.</Paragraph>

      <Paragraph><strong>2. Descripción del Servicio:</strong> NotiFinance proporciona notificaciones personalizadas en tiempo real sobre variaciones en el mercado de criptomonedas.</Paragraph>

      <Paragraph><strong>3. Uso Permitido:</strong> Está prohibido manipular, interferir o usar el sistema para fines ilícitos.</Paragraph>

      <Paragraph><strong>4. Protección de Datos y Seguridad:</strong> Aplicamos la norma <em>ISO/IEC 27001</em> y cifrado de datos para proteger tu información.</Paragraph>

      <Paragraph><strong>5. Disponibilidad y Rendimiento:</strong> Garantizamos un tiempo de actividad superior al 99.5% y tiempos de respuesta menores a 2000 ms.</Paragraph>

      <Paragraph><strong>6. Calidad y Funcionalidad:</strong> NotiFinance sigue estándares como ISO 21500, 25010 y 29119 para garantizar funcionalidad, precisión (&gt;95%) y satisfacción (&gt;80%).</Paragraph>

      <Paragraph><strong>7. Responsabilidades del Usuario:</strong> El usuario es responsable de sus datos y la configuración de sus notificaciones.</Paragraph>

      <Paragraph><strong>8. Limitación de Responsabilidad:</strong> NotiFinance no es responsable por pérdidas económicas derivadas del uso del servicio.</Paragraph>

      <Paragraph><strong>9. Modificaciones:</strong> Los términos pueden cambiar. Se informará con antelación por los canales oficiales.</Paragraph>

      <Paragraph><strong>10. Ley Aplicable:</strong> Este acuerdo se rige bajo la legislación mexicana.</Paragraph>
    </div>
  );
};

export default TermsAndConditions;
