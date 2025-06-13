// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductsPage from './pages/ProductsPage';
import AdminPage from './pages/AdminPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<div>Orders Page</div>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/payment" element={<div>Payment Page</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
