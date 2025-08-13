import React from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CityGrid from "../../components/user/Home/CityGrid";
import { useLanguage } from "../../context/LanguageContext";


// Hero Section Component
const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
        color: 'white',
        py: 8,
        mb: 6,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
            {t('home.hero.title')}
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', opacity: 0.9 }}>
            {t('home.hero.subtitle')}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              sx={{
                backgroundColor: 'white',
                color: '#1976D2',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              {t('home.hero.searchButton')}
            </Button>

          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: '#1976D2' }} />,
      title: t('home.features.easySearch.title'),
      description: t('home.features.easySearch.description')
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: '#1976D2' }} />,
      title: t('home.features.reliableLocation.title'),
      description: t('home.features.reliableLocation.description')
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#1976D2' }} />,
      title: t('home.features.fairPrice.title'),
      description: t('home.features.fairPrice.description')
    }
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 600, color: '#1976D2' }}>
          {t('home.features.title')}
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 4 
        }}>
          {features.map((feature, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 4,
                textAlign: 'center',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                }
              }}
            >
              <Box sx={{ mb: 3 }}>
                {feature.icon}
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1976D2' }}>
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

// Popular Cities Section Component
const PopularCitiesSection = () => {
  const { t } = useLanguage();
  
  return (
    <Box sx={{ py: 6, backgroundColor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, fontWeight: 600, color: '#1976D2' }}>
          {t('home.popularCities.title')}
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, color: '#666' }}>
          {t('home.popularCities.subtitle')}
        </Typography>
        <CityGrid />
      </Container>
    </Box>
  );
};

// Stats Section Component
const StatsSection = () => {
  const { t } = useLanguage();
  
  const stats = [
    { number: "50,000+", label: t('home.stats.activeListings') },
    { number: "25,000+", label: t('home.stats.happyCustomers') },
    { number: "81", label: t('home.stats.citiesCovered') },
    { number: "24/7", label: t('home.stats.support') }
  ];

  return (
    <Box sx={{ py: 6, backgroundColor: '#1976D2', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 4 
        }}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                {stat.number}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

const UserHomePage = () => {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <HeroSection />
            <FeaturesSection />
            <PopularCitiesSection />
            <StatsSection />
        </Box>
    );
};

export default UserHomePage;