import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Use environment variables for credentials
    const adminUsername = process.env.REACT_APP_ADMIN_USERNAME;
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (id === adminUsername && password === adminPassword) {
      // In a real app, you'd get a token from a server.
      // For this mockup, we'll use sessionStorage to simulate being logged in.
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/'); // Navigate to the homepage
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="login-page-container">
      <h1>로그인</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
