import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/v1/login', {
        username: 'admin',
        password: 'admin',
      });
  
      console.log('Server response:', response.data);
  
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error.message);
      console.error('Server response:', error.response?.data);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
