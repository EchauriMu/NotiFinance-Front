import axios from 'axios';

// Función para obtener la lista de criptomonedas
export const fetchCryptos = async () => {
  try {
    const response = await axios.get(
      'https://api.twelvedata.com/cryptocurrencies?apikey=e02c4efdc3994bcea6d15a6758f0ca6d'
    );

    if (response.data.data) {
      // Filtrar para quedarse solo con los pares cuyo currency_quote sea "US Dollar"
      const filtered = response.data.data.filter(item => item.currency_quote === "US Dollar");

      // Mapear para obtener el símbolo base (antes de la "/")
      const mapped = filtered.map(item => {
        const baseSymbol = item.symbol.split('/')[0]; // Ej: de "OST/USD" extraemos "OST"
        return {
          value: baseSymbol,
          label: baseSymbol
        };
      });

      // Remover duplicados (en caso de que existan)
      const unique = Array.from(new Map(mapped.map(item => [item.value, item])).values());

      return unique;
    }
    return [];
  } catch (error) {
    console.error('Error fetching crypto list:', error);
    return [];
  }
};
