import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import Rollbar from 'rollbar';
import { useTranslation } from 'react-i18next';

const rollbar = new Rollbar({
  accessToken: import.meta.env.VITE_ACCESS_TOKEN,
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation();
  return (
    <div role="alert">
      <p>{t('errorBoundary.wrong')}</p>
      <pre>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        {t('errorBoundary.try')}
      </button>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

const FunctionalErrorBoundary = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      rollbar.error('Error caught by FunctionalErrorBoundary', error, { errorInfo });
    }}
  >
    {children}
  </ErrorBoundary>
);

FunctionalErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FunctionalErrorBoundary;
