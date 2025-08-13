import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LockIcon from '@mui/icons-material/Lock';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            backgroundColor: 'white',
            maxWidth: 500,
            width: '100%'
          }}
        >
          <LockIcon
            sx={{
              fontSize: 80,
              color: '#f44336',
              mb: 3
            }}
          />
          
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#1a1a1a'
            }}
          >
            Erişim Reddedildi
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: '#666',
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            Bu sayfaya erişim yetkiniz bulunmamaktadır. 
            Lütfen gerekli yetkilere sahip bir hesapla giriş yapın.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={handleGoBack}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              Geri Dön
            </Button>
            
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Çıkış Yap
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
