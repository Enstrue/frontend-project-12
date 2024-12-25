import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import SignupPage from './pages/SignupPage';

const isAuthenticated = !!localStorage.getItem('token');

const App = () => {

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/chat" replace />}
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <SignupPage /> : <Navigate to="/chat" replace />}
          />
          <Route
            path="/chat"
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />}
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const Header = () => {
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const isAuth = !!localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          {t('header.brand')}
        </a>
        {isAuth && (
          <button className="btn btn-outline-danger ml-auto" onClick={handleLogout}>
            {t('header.logout')}
          </button>
        )}
      </div>
    </nav>
  );
};

export default App;
