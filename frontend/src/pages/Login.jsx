// frontend/src/pages/Login.jsx
import { useEffect, useState } from 'react';

function Login() {
  const handleLogin = () => {
    console.log('Login button clicked');
    const email = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    console.log('Email:', email, 'Password:', password);

    fetch('api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log('Login successful:', data);
        } else {
          console.error('Login failed:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred.');
      });
  };


  return (
    <div className="conainer" id="login-contatiner">
      <input type="text" placeholder="Enter your email" />
      <input type="password" placeholder="Enter your password" />
      <button onClick={handleLogin}></button>
    </div>
  );
}

export default Login;