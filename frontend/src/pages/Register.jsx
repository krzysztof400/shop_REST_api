// frontend/src/pages/Login.jsx
import { useEffect, useState } from 'react';
import MyInput from '../components/MyInput.jsx';

function Register() {
  const handleRegister = () => {
    console.log('Regoster button clicked');
    const email = document.querySelector('input[id="email-input"]').value;
    const password = document.querySelector('input[id="password-input"]').value;
    const name = document.querySelector('input[id="name-input"]').value;
    const address = document.querySelector('input[id="address-input"]').value;
    const city = document.querySelector('input[id="city-input"]').value;
    const postalCode = document.querySelector('input[id="postalCode-input"]').value;
    const country = document.querySelector('input[id="country-input"]').value;

    console.log('Email:', email, 'Password:', password, 'Name:', name, 'Address:', address, 'City:', city, 'Postal Code:', postalCode, 'Country:', country);

    fetch('api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, address, city, postalCode, country }),
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
        <h2 className="text-2xl font-bold text-center mb-4 text-white">Register</h2>
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
          <MyInput
            type="text"
            id="name-input"
            placeholder="Enter your name"
          />
          <MyInput
            type="text"
            id="address-input"
            placeholder="Enter your address"
          />
          <MyInput
            type="text"
            id="city-input"
            placeholder="Enter your city"
          />
          <MyInput
            type="text"
            id="postalCode-input"
            placeholder="Enter your postal code"
          />
          <MyInput
            type="text"
            id="country-input"
            placeholder="Enter your country"
          />
        </div>
        <button
          onClick={handleRegister}
          className="w-full mt-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </button>
        <p className="text-center text-white mt-4 w-full">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
        <p>
          <a href="/" className="text-blue-500">Back to main page</a>
        </p>
      </div>
    </div>
  );
}

export default Register;