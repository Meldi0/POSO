import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStaff?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireStaff = false 
}) => {
  const { isAuthenticated, isStaff, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F3EE] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[#E75A38] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-[#8C847E] tracking-wide">Memuat sesi POSO Helpdesk...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireStaff && !isStaff) {
    // Public users trying to access operator dashboard are redirected to their ticket portal
    return <Navigate to="/my-tickets" replace />;
  }

  return <>{children}</>;
};
