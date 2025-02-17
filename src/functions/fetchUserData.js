import axiosInstance from '../api/axiosInstance';

// Función para obtener los datos del usuario (perfil)
export const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get('/user/profile');  // Usando la ruta correcta para los datos del usuario

    console.log('📥 [API] Datos de usuario recibidos:', response.data);

    const userData = {
      id: response.data.data._id,
      username: response.data.data.username,
      email: response.data.data.email,
      role: response.data.data.role,
      lastLogin: response.data.data.lastLogin || 'Nunca',  // Si no tiene último login, mostramos "Nunca"
    };

    return userData;
  } catch (error) {
    console.error('❌ [API] Error al obtener los datos del usuario:', error);
    throw error;
  }
};

// Función para obtener configuración y lista de seguimiento
export const fetchSettings = async () => {
  try {
    const response = await axiosInstance.get('/setting/get');  // Ruta para configuración y lista de seguimiento

    console.log('📥 [API] Datos de configuración y watchlist recibidos:', response.data);

    const notificationSettings = response.data.notificationSettings || {
      email: false,
      whatsapp: false,
      discord: false,
    };
    const watchlist = response.data.watchlist || [];

    return { notificationSettings, watchlist };
  } catch (error) {
    console.error('❌ [API] Error al obtener la configuración y watchlist:', error);
    throw error;
  }
};
