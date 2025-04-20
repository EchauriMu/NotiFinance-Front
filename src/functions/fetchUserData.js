import axiosInstance from '../api/axiosInstance';

// Función para obtener los datos del usuario (perfil)
export const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get('/user/profile');
    const { data } = response.data; 

    console.log('📥 [API] Datos de usuario recibidos:', data);

    const userData = {
      id: data._id,
      username: data.username,
      email: data.email,
      role: data.role,
      lastLogin: data.lastLogin || 'Nunca',
      plan: data.plan || 'Freemium',
      subscriptionExpiresAt: data.subscriptionExpiresAt || null,
    };

    sessionStorage.setItem('userData', JSON.stringify(userData));

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
