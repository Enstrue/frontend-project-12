import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthCont';

const LoginPage = () => {
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  const validationSchema = Yup.object({
    username: Yup.string().required(t('validation.required')),
    password: Yup.string().required(t('validation.required')),
  });

  const handleLogin = async (values, { resetForm }) => {
    try {
      const response = await apiClient.post('/api/v1/login', {
        username: values.username,
        password: values.password,
      });

      login(response.data.token);
      dispatch(setUser({ username: values.username }));
      resetForm();
      navigate('/chat');
    } catch (error) {
      if (error.response?.status === 401) {
        setGeneralError(t('login.error'));
      } else {
        setGeneralError(t('login.generalError'));
      }
    }
  };

  return (
    <div className="h-100 bg-light">
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <div className="container-fluid h-100">
              <div className="row justify-content-center align-content-center h-100">
                <div className="col-12 col-md-8 col-xxl-6">
                  <div className="card shadow-sm">
                    <div className="card-body row p-5">
                      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                        <img
                          src="./src/assets/avatar.jpg"
                          className="rounded-circle"
                          alt={t('login.title')}
                        />
                      </div>
                      <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleLogin}
                      >
                        {({ errors, touched }) => (
                          <Form className="col-12 col-md-6 mt-3 mt-md-0">
                            <h1 className="text-center mb-4">{t('login.title')}</h1>
                            {generalError && (
                              <div className="alert alert-danger">{generalError}</div>
                            )}
                            <div className="form-floating mb-3">
                              <Field
                                name="username"
                                id="username"
                                autoComplete="username"
                                placeholder={t('login.username')}
                                className={`form-control ${
                                  touched.username && errors.username ? 'is-invalid' : ''
                                }`}
                              />
                              <label htmlFor="username">{t('login.username')}</label>
                              {touched.username && errors.username && (
                                <div className="invalid-feedback">{errors.username}</div>
                              )}
                            </div>
                            <div className="form-floating mb-4">
                              <Field
                                name="password"
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder={t('login.password')}
                                className={`form-control ${
                                  touched.password && errors.password ? 'is-invalid' : ''
                                }`}
                              />
                              <label htmlFor="password">{t('login.password')}</label>
                              {touched.password && errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                              )}
                            </div>
                            <button type="submit" className="w-100 mb-3 btn btn-outline-primary">
                              {t('login.login')}
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="card-footer p-4">
                      <div className="text-center">
                        <span>{t('login.noAccount')}</span>
                        {' '}
                        <Link to="/signup">{t('login.signup')}</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="Toastify" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
