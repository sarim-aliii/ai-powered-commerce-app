import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
  <AuthProvider>
    <Router>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar /> {/*  */}
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
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
     </Router>
  </AuthProvider>
  );
}

export default App;