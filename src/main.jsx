import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import './index.css'
import App from './App.jsx'

// Configuración del tema oscuro manteniendo el color naranja
const darkTheme = {
  algorithm: theme.darkAlgorithm, // Activa el modo oscuro
  token: {
    colorPrimary: '#ffa500', // Mantiene el color naranja como color principal
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={darkTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>
)
