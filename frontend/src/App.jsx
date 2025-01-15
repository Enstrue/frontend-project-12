import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthCont';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import SignupPage from './pages/SignupPage';
import ErrorBoundary from './ErrorBoundary';

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route
              path="/login"
              element={(
                <ProtectedRoute redirectTo="/chat" inverse>
                  <LoginPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/signup"
              element={(
                <ProtectedRoute redirectTo="/chat" inverse>
                  <SignupPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/chat"
              element={(
                <ProtectedRoute redirectTo="/login">
                  <ChatPage />
                </ProtectedRoute>
              )}
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  </ErrorBoundary>
);

const Header = () => {
  const { logout, isAuthenticated } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          Hexlet Chat
        </a>
        {isAuthenticated && (
          <button
            type="button"
            className="btn btn-outline-danger ml-auto"
            onClick={logout}
          >
            Выйти
          </button>
        )}
      </div>
    </nav>
  );
};

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, redirectTo, inverse = false }) => {
  const { isAuthenticated } = useAuth();
  const shouldRedirect = inverse ? isAuthenticated : !isAuthenticated;

  return shouldRedirect ? <Navigate to={redirectTo} replace /> : children;
};

export default App;
