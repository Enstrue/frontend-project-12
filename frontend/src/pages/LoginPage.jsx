import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5001/login", {
        username,
        password,
      });

      const { token } = data;

      localStorage.setItem("token", token);

      navigate("/");  // Редирект на страницу чата
    } catch (err) {
      setError(err, "Ошибка авторизации. Проверьте логин и пароль.");
    }
  };

  return (
    <div className="p-4">
      <h2>Форма входа</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-2">
          Войти
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
