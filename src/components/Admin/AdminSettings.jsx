import React from 'react';
import { Typography, Card } from 'antd';


const { Title , Text} = Typography;


const AdminSettings = ({ userData }) => (
  <Card title="Configuración del Admin">
    {/* Mostrar los datos del administrador logueado */}
        {userData && (
          <Card style={{ marginTop: '4px' }} title="Datos del Administrador">
            <p>
              <Text strong>Nombre de usuario:</Text> {userData.username}
            </p>
            <p>
              <Text strong>Email:</Text> {userData.email}
            </p>
            <p>
              <Text strong>Rol:</Text> {userData.role}
            </p>
         
          </Card>
        )}
  </Card>
);

export default AdminSettings;