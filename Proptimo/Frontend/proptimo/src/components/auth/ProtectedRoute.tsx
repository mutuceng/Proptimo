import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();

  // Loading durumunda spinner göster
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Giriş yapmamış kullanıcıları login'e yönlendir
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Rol kontrolü varsa ve kullanıcı o role sahip değilse
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Tüm kontroller geçildi, sayfayı göster
  return <>{children}</>;
};

export default ProtectedRoute;
