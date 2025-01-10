import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthCont';

const LoginPage = () => {
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
      if (isAuthenticated) {
        navigate('/chat');
      }
    }, [isAuthenticated, navigate]);

  const validationSchema = Yup.object({
    username: Yup.string().required('Введите имя пользователя'),
    password: Yup.string().required('Введите пароль'),
  });

  const handleLogin = async (values, { resetForm }) => {
    try {
      const response = await apiClient.post('/api/v1/login', {
        username: values.username,
        password: values.password,
      });

      localStorage.setItem('token', response.data.token);
      resetForm();

      // Перенаправляем пользователя на /chat
      navigate('/chat');
    } catch (error) {
      if (error.response?.status === 401) {
        setGeneralError('Неправильный логин или пароль');
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Вход в Hexlet Chat</h2>

        {generalError && <div className="alert alert-danger">{generalError}</div>}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-3">
                <Field
                  name="username"
                  placeholder="Имя пользователя"
                  className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                />
                {errors.username && touched.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-3">
                <Field
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-2">
                Войти
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-3 text-center">
          Нет аккаунта в Hexlet Chat?{' '}
          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate('/signup')}
          >
            Регистрация
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
