// frontend/src/pages/Login.jsx
import { useEffect, useState } from 'react';

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
    <div className="conainer" id="login-contatiner">
        <input type="text" id="email-input"placeholder="Enter your email" />
        <input type="password" id="password-input" placeholder="Enter your password" />
        <input type="text" id="name-input" placeholder="Enter your name" />
        <input type="text" id="address-input" placeholder="Enter your address" />
        <input type="text" id="city-input" placeholder="Enter your city" />
        <input type="text" id="postalCode-input" placeholder="Enter your postal code" />
        <input type="text" id="country-input" placeholder="Enter your country" />

        <button onClick={handleRegister}></button>
    </div>
  );
}

export default Register;