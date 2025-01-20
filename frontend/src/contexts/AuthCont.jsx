import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const navigate = useNavigate(); // Используем navigate для редиректа

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));

    const requestInterceptor = axios.interceptors.request.use((config) => {
      const newConfig = { ...config };
      const token = localStorage.getItem('token');
      if (token) {
        newConfig.headers.Authorization = `Bearer ${token}`;
      }
      return newConfig;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
          setRedirectToLogin(true); // Устанавливаем редирект в true
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Когда нужно редиректить, выполняем редирект
  useEffect(() => {
    if (redirectToLogin) {
      navigate('/login'); // Используем navigate для редиректа
    }
  }, [redirectToLogin, navigate]);

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
