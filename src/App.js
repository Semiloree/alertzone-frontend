import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { IncidentProvider } from './context/IncidentContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast';



function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
  <Route path="/" element={<LandingPage />} />

  <Route path="/map" element={<MapPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  <Route
    path="/report"
    element={
      <ProtectedRoute>
        <ReportPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin"
    element={
      <ProtectedRoute adminOnly>
        <AdminPage />
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<NotFoundPage />} />
</Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
    <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#161B22',
            color: '#F0F4F8',
            border: '0.5px solid #30363D',
            fontSize: '13px',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#00D9B8',
              secondary: '#0D1117'
            }
          },
          error: {
            iconTheme: {
              primary: '#FF3B30',
              secondary: '#0D1117'
            }
          },
        }}
      />
      <AuthProvider>
        <IncidentProvider>
          <AppRoutes />
        </IncidentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;