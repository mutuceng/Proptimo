import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLanguage);
  };

  const getCurrentLanguageName = () => {
    return i18n.language === 'tr' ? 'TR' : 'ENG';
  };

  return (
    <Box>
      <Button
        onClick={toggleLanguage}
        startIcon={<LanguageIcon sx={{ fontSize: 20, color: '#666' }} />}
        sx={{
          color: '#666',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          padding: '10px 16px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#e8e8e8',
            borderColor: '#d0d0d0',
            transform: 'scale(1.05)'
          },
          '& .MuiButton-startIcon': {
            marginRight: '8px'
          }
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
          {getCurrentLanguageName()}
        </Typography>
      </Button>
    </Box>
  );
};

export default LanguageSwitcher;
