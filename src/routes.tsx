import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PublicTicketForm } from './pages/public/PublicTicketForm';
import { PublicTicketTracker } from './pages/public/PublicTicketTracker';
import { MyTicketsPage } from './pages/public/MyTicketsPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { OperatorDashboard } from './pages/operator/OperatorDashboard';
import { ProtectedRoute } from './components/auth/AuthGuard';

const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D5C75] border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  const isStaffRole = user.role === 'admin' || user.role === 'operator' || user.role === 'upt';
  return <Navigate to={isStaffRole ? "/dashboard" : "/my-tickets"} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ROOT ROUTE: Langsung ke Halaman Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
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

      {/* Fallback to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
