import React from 'react';
import Rollbar from 'rollbar';
import PropTypes from 'prop-types';

const rollbar = new Rollbar({
  accessToken: '5c280bb4326d4c0ab97160c54e00cf37',
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    rollbar.error('Error caught by ErrorBoundary', error, { errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
