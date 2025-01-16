import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthCont';
import apiClient from '../api/client';

const SignupPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
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
        login(response.data.token);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: 'Такой пользователь уже существует' });
      } else {
        setErrors({ username: 'Ошибка регистрации. Попробуйте позже.' });
      }
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('signup.validation.username'))
      .max(20, t('signup.validation.username'))
      .required(t('signup.validation.required')),
    password: Yup.string()
      .min(6, t('signup.validation.password'))
      .required(t('signup.validation.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('signup.validation.confirmPassword'))
      .required(t('signup.validation.required')),
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="p-4 bg-light rounded shadow"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h2>Регистрация в Hexlet Chat</h2>

        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
        >
          {({ errors, touched }) => (
            <Form>
              {/* Username Field */}
              <div className="form-floating mb-3 position-relative">
                <label htmlFor="username" className="form-label">
                  Имя пользователя
                </label>
                <Field
                  name="username"
                  id="username"
                  autoComplete="username"
                  placeholder="От 3 до 20 символов"
                  className={`form-control ${
                    touched.username && errors.username ? 'is-invalid' : ''
                  }`}
                />
                {touched.username && errors.username && (
                  <div className="invalid-tooltip">{errors.username}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-floating mb-3 position-relative">
                <Field
                  name="password"
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Не менее 6 символов"
                  className={`form-control ${
                    touched.password && errors.password ? 'is-invalid' : ''
                  }`}
                />
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                {touched.password && errors.password && (
                  <div className="invalid-tooltip">{errors.password}</div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-floating mb-4 position-relative">
                <Field
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Пароли должны совпадать"
                  className={`form-control ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'is-invalid'
                      : ''
                  }`}
                />
                <label htmlFor="confirmPassword" className="form-label">
                  Подтвердите пароль
                </label>
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="invalid-tooltip">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-success w-100 mt-2">
                Зарегистрироваться
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupPage;
