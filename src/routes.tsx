import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/public/LandingPage';
import { PublicTicketForm } from './pages/public/PublicTicketForm';
import { PublicTicketTracker } from './pages/public/PublicTicketTracker';
import { MyTicketsPage } from './pages/public/MyTicketsPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { OperatorDashboard } from './pages/operator/OperatorDashboard';
import { ProtectedRoute } from './components/auth/AuthGuard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES (Light / Accessible Theme) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/submit" element={<PublicTicketForm />} />
      <Route path="/buat-tiket" element={<PublicTicketForm />} />
      <Route path="/track" element={<PublicTicketTracker />} />
      <Route path="/cek-tiket" element={<PublicTicketTracker />} />

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PUBLIC USER AUTHENTICATED PORTAL */}
      <Route
        path="/my-tickets"
        element={
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        }
      />

      {/* PROTECTED OPERATOR / STAFF DASHBOARD (Dark Glassmorphism Theme) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireStaff={true}>
            <OperatorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback to Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
