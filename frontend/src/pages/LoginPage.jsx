import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthCont';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
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
        setGeneralError(t('login.error'));
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className='text-center mb-4'>{t('login.title')}</h1>

        {generalError && <div className="alert alert-danger">{generalError}</div>}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form>
              {/* Username Field */}
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

              {/* Password Field */}
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

        <p className="mt-3 text-center">
          {t('login.noAccount')}{' '}
          <Link to="/signup" className="text-decoration-none">
            {t('login.signup')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
