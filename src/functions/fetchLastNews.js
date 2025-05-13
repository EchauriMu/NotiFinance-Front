import axiosInstance from '../api/axiosInstance'; // Usar la instancia de Axios configurada

export const fetchNews = async () => {
  try {
    const response = await axiosInstance.get('/news'); // Nuevo endpoint

    // Verificar si la respuesta es exitosa
    if (response.data.success) {
      // Retornar las noticias en el formato esperado
      return response.data.data.map((article) => ({
        title: article.title,
        description: article.description,
        link: article.link,
        image_url: article.image_url,
      }));
    } else {
      throw new Error('Error al cargar las noticias: Respuesta no exitosa');
    }
  } catch (error) {
    console.error('❌ Error al cargar las noticias:', error);
    throw new Error('Error al cargar las noticias');
  }
};
