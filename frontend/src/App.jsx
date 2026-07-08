import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar /> {/* Rendered globally */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={
              <ProtectedRoute>
                  <Cart />
              </ProtectedRoute>
          } />
          <Route path="/products" element={
              <ProtectedRoute>
                  <Products />
              </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;