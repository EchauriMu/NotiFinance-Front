import axios from 'axios';

const API_KEY = 'pub_7127277c30f8e6d3ab54159e2de02e659979f';

export const fetchNews = async (cryptoSymbol) => {
  if (!cryptoSymbol) return [];

  // Verifica si ya tenemos noticias almacenadas en sessionStorage
  const storedNews = sessionStorage.getItem(`news_${cryptoSymbol}`);
  if (storedNews) {
    return JSON.parse(storedNews);
  }

  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${cryptoSymbol}&language=en&size=5`
    );
    const newsData = response.data.results || [];

    // Guarda en sessionStorage para evitar múltiples solicitudes
    sessionStorage.setItem(`news_${cryptoSymbol}`, JSON.stringify(newsData));

    return newsData;
  } catch (error) {
    throw new Error('Error al cargar las noticias');
  }
};
