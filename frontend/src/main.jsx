import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'; // 1. Ensure this import is present

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap App in AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)