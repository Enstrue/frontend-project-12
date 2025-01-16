import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import Rollbar from 'rollbar'; // Исправлено: добавлен импорт Rollbar

const rollbar = new Rollbar({
  accessToken: '5c280bb4326d4c0ab97160c54e00cf37', // Замените токен на актуальный
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button type="button" onClick={resetErrorBoundary}>
      Try again
    </button>
  </div>
);

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
