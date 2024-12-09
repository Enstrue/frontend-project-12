import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/chat" replace />} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/chat" replace />} />
          <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Обновляем страницу для очистки состояния
  };

  const isAuth = !!localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">Hexlet Chat</a>
        {isAuth && (
          <button className="btn btn-outline-danger ml-auto" onClick={handleLogout}>
            Выйти
          </button>
        )}
      </div>
    </nav>
  );
};

export default App;
