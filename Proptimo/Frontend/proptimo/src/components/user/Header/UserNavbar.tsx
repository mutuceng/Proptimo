import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  SvgIcon,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export const UserNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = ['Emlak Listesi', 'Satılık', 'Kiralık', 'Hakkımızda', 'İletişim'];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item} sx={{ py: 1 }}>
            <ListItemText 
              primary={item} 
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  textAlign: 'center'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      
      {/* Mobile Butonlar */}
      <Box sx={{ p: 3, pt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            color: '#1976d2',
            borderColor: '#1976d2',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            mb: 2,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#1976d2',
              color: 'white',
              borderColor: '#1976d2'
            }
          }}
        >
          Giriş Yap
        </Button>
        
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#1976d2',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          Kaydol
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: 0, py: 1.5 }}>
          {/* Sol Taraf - Hamburger Menü (Sadece Mobile'da) */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                color: '#666',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '10px',
                transition: 'all 0.2s ease-in-out',
                mr: 2,
                '&:hover': {
                  backgroundColor: '#e8e8e8',
                  borderColor: '#d0d0d0',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo ve Marka Adı */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SvgIcon 
              sx={{ 
                fontSize: 32, 
                color: '#1976d2',
                width: 32,
                height: 32
              }}
            >
              <path d="M12 3L1 12h3v8h6v-6h4v6h6v-8h3L12 3zm0 2.84L19 12v6h-2v-6h-2v6h-6v-6H9v6H7v-6H5v6H3v-6l7-8.16z"/>
            </SvgIcon>
            <Typography 
              variant="h5" 
              onClick={() => navigate('/')}
              sx={{ 
                color: '#1976d2', 
                fontWeight: 700,
                fontSize: '1.75rem',
                fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(25, 118, 210, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#1565c0',
                  transform: 'scale(1.02)'
                }
              }}
            >
              Proptimo
            </Typography>
          </Box>

          {/* Navigasyon Linkleri - Desktop */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', gap: 5 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: '#1a1a1a',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        color: '#1976d2',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Sağ Taraf - Butonlar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            {/* Dil Seçimi */}
            <IconButton
              sx={{
                color: '#666',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '10px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#e8e8e8',
                  borderColor: '#d0d0d0',
                  transform: 'scale(1.05)'
                }
              }}
            >
              🌐
            </IconButton>

            {/* Giriş Yap Butonu */}
            <Button
              variant="outlined"
              sx={{
                color: '#1976d2',
                borderColor: '#1976d2',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  borderColor: '#1976d2',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              Giriş Yap
            </Button>

            {/* Kaydol Butonu */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1976d2',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              Kaydol
            </Button>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: 'white',
            borderLeft: '1px solid #e7edf4'
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};