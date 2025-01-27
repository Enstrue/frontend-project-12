import axios from 'axios';

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    const newConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
    return newConfig;
  }
  return config;
});

// Интерсептор для обработки ответа
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Токен невалиден, перенаправляем на страницу авторизации
      localStorage.removeItem('token');
      window.location.href = '/login'; // Замените на вашу страницу авторизации
    }
    return Promise.reject(error);
  },
);

export default apiClient;
