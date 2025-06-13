// frontend/src/pages/Login.jsx
import { useEffect, useState } from 'react';
import MyInput from '../components/MyInput.jsx';

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
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="container max-w-xs p-6 bg-gray-900 rounded shadow-lg" id="login-container">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">Login</h2>
        <div className="flex flex-col w-full">
          <MyInput
            type="text"
            id="email-input"
            placeholder="Enter your email">
          </MyInput>
          <MyInput
            type="password"
            id="password-input"
            placeholder="Enter your password"
          />
        </div>
        <button className="w-full mt-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleLogin}>Login</button>
        <p className="text-center text-white mt-4 w-full">
          Don't have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;