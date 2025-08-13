import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

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

  // Giriş yapmış kullanıcıları ana sayfaya yönlendir
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Giriş yapmamış kullanıcılar için sayfayı göster
  return <>{children}</>;
};

export default PublicRoute;
