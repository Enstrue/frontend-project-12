import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuthenticated() ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
