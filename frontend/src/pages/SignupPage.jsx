import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthCont'; // Контекст авторизации

const SignupPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем его на /chat
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (values, { setErrors }) => {
    try {
      const response = await apiClient.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });

      if (response.data?.token) {
        // Вызываем login для обновления глобального состояния
        login(response.data.token);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: 'Имя пользователя уже занято' });
      } else {
        setErrors({ username: 'Ошибка регистрации. Попробуйте позже.' });
      }
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Имя должно содержать от 3 до 20 символов')
      .max(20, 'Имя должно содержать до 20 символов')
      .required('Логин обязателен'),
    password: Yup.string().min(6, 'Пароль от 6 символов').required('Пароль обязателен'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
      .required('Подтверждение пароля обязательно'),
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 bg-light rounded shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Регистрация в Hexlet Chat</h2>

        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-3">
                <Field
                  name="username"
                  placeholder="Логин"
                  className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                />
                {touched.username && errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-3">
                <Field
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                />
                {touched.password && errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Подтвердите пароль"
                  className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>

              <button type="submit" className="btn btn-success w-100 mt-2">
                Зарегистрироваться
              </button>

              <button
                type="button"
                className="btn btn-link mt-2 d-block text-center"
                onClick={() => navigate('/login')}
              >
                Зарегистрированы в Hexlet Chat? Войти
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupPage;
