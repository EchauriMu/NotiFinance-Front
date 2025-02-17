import axios from 'axios';

// Clave API (reemplázala por seguridad o usa variables de entorno)
const API_KEY = 'e02c4efdc3994bcea6d15a6758f0ca6d';
export const fetchChartData = async (selectedCrypto, currency = "USD", interval = "1h") => {
  if (!selectedCrypto) {
    console.warn("No se seleccionó ninguna criptomoneda.");
    return [];
  }

  const url = `https://api.twelvedata.com/time_series?symbol=${selectedCrypto}/${currency}&interval=${interval}&apikey=${API_KEY}`;
  console.log('URL de la API llamada:', url); // Log para mostrar la URL

  try {
    const response = await axios.get(url);

    // Validar si la API devuelve datos
    if (!response.data.values) {
      console.error("No se recibieron datos válidos:", response.data);
      return [];
    }

    // Transformar datos para el gráfico
    return response.data.values.map(item => ({
      time: item.datetime,
      price: parseFloat(item.close)
    }));
  } catch (error) {
    // Manejo de errores detallado
    if (error.response) {
      console.error('Error en la API:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta de la API:', error.request);
    } else {
      console.error('Error en la solicitud:', error.message);
    }
    return [];
  }
};
