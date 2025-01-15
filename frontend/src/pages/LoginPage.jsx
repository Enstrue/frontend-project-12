import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux'; // Импортируем useDispatch
import { setUser } from '../store/userSlice'; // Импортируем экшен для обновления имени пользователя в Redux
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthCont';

const LoginPage = () => {
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Используем login и isAuthenticated из контекста
  const dispatch = useDispatch(); // Получаем доступ к dispatch
  const { t } = useTranslation();

  // Если пользователь уже авторизован, перенаправляем на /chat
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  // Валидация для полей формы
  const validationSchema = Yup.object({
    username: Yup.string().required(t('validation.required')),
    password: Yup.string().required(t('validation.required')),
  });

  // Обработчик логина
  const handleLogin = async (values, { resetForm }) => {
    try {
      // Отправляем запрос на сервер для авторизации
      const response = await apiClient.post('/api/v1/login', {
        username: values.username,
        password: values.password,
      });

      // Сохраняем токен в локальное хранилище и обновляем состояние авторизации через контекст
      login(response.data.token);
      dispatch(setUser({ username: values.username })); // Сохраняем имя пользователя в Redux
      resetForm();

      // Перенаправляем пользователя на страницу чата
      navigate('/chat');
    } catch (error) {
      // Обрабатываем ошибки при логине
      if (error.response?.status === 401) {
        setGeneralError(t('login.error'));
      } else {
        setGeneralError(t('login.generalError'));
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center mb-4">{t('login.title')}</h1>

        {/* Отображаем общую ошибку */}
        {generalError && <div className="alert alert-danger">{generalError}</div>}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form>
              {/* Поле для имени пользователя */}
              <div className="form-floating mb-3 position-relative">
                <Field
                  name="username"
                  id="username"
                  autoComplete="username"
                  placeholder={t('login.username')}
                  className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                />
                <label htmlFor="username" className="form-label">
                  {t('login.username')}
                </label>
                {touched.username && errors.username && (
                  <div className="invalid-tooltip">
                    {errors.username}
                  </div>
                )}
              </div>

              {/* Поле для пароля */}
              <div className="form-floating mb-3 position-relative">
                <Field
                  name="password"
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder={t('login.password')}
                  className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                />
                <label htmlFor="password" className="form-label">
                  {t('login.password')}
                </label>
                {touched.password && errors.password && (
                  <div className="invalid-tooltip">
                    {errors.password}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-2">
                {t('login.login')}
              </button>
            </Form>
          )}
        </Formik>

        {/* Ссылка на страницу регистрации */}
        <p className="mt-3 text-center">
          {t('login.noAccount')}
          {' '}
          <Link to="/signup" className="text-decoration-none">
            {t('login.signup')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
