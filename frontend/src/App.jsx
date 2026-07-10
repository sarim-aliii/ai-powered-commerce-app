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
import AIChatbot from './components/AIChatbot';
import AdminDashboard from './pages/AdminDashboard';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import FAQ from './pages/FAQ';

function App() {
  return (
  <AuthProvider>
    <Router>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />

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
          <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
              </ProtectedRoute>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={
              <ProtectedRoute>
                  <Profile />
              </ProtectedRoute>
          } />
          <Route path="/offers" element={<Offers />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>

        <AIChatbot />
      </div>
     </Router>
  </AuthProvider>
  );
}

export default App;