import React, { useEffect, useState, useRef } from 'react';
import { Typography, Tag } from 'antd';

const { Title } = Typography;

const PriceDisplay = ({ selectedCrypto }) => {
  const [price, setPrice] = useState(null);
  const [color, setColor] = useState('default'); // 'success' (verde), 'error' (rojo), 'default' (gris)
  const timerRef = useRef(null);

  const fetchPrice = async () => {
    if (!selectedCrypto) return;
    
    try {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${selectedCrypto}&tsyms=USD`
      );
      const data = await response.json();
      const newPrice = data.USD;
      console.log('precio: '+ newPrice );
      // Obtener el precio anterior de sessionStorage
      const storedPrice = sessionStorage.getItem(`price_${selectedCrypto}`);
      if (storedPrice) {
        const prevPrice = parseFloat(storedPrice);

        if (newPrice > prevPrice) {
          setColor('green'); // Verde si sube
        } else if (newPrice < prevPrice) {
          setColor('red'); // Rojo si baja
        }

        // Restablecer a gris después de 3 segundos si hubo cambio
        if (newPrice !== prevPrice) {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setColor('default'), 4000);
        }
      }

      // Guardar el nuevo precio en sessionStorage
      sessionStorage.setItem(`price_${selectedCrypto}`, newPrice);
      setPrice(newPrice);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  // Efecto para actualizar el precio cada 10 segundos
  useEffect(() => {
    if (!selectedCrypto) return;

    fetchPrice(); // Llamada inicial
    const intervalId = setInterval(fetchPrice, 10000);

    return () => {
      clearInterval(intervalId);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [selectedCrypto]);

  if (!selectedCrypto || price === null) return null;

  return (
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <Title level={4}>
        Precio actual de {selectedCrypto}:  {'  '}
        <Tag color={color} style={{ fontSize: '22px', padding: '5px 10px' }}>
          ${price} USD
        </Tag>
      </Title>
    </div>
  );
};

export default PriceDisplay;
