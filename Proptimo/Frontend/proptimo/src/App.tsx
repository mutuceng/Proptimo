import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';


// Admin Layout
import AdminLayout from './components/admin/AdminLayout';

// Admin Pages
import AdminCurrencyListingPage from './pages/admin/currency/AdminCurrencyListingPage';
import AdminEstateListingPage from './pages/admin/estate/AdminEstateListingPage';

// User Pages (placeholder components)
const UserHomePage = () => (
  <Box sx={{ padding: 3 }}>
    <Typography variant="h4">User Home Page</Typography>
  </Box>
);

const UserProfilePage = () => (
  <Box sx={{ padding: 3 }}>
    <Typography variant="h4">User Profile Page</Typography>
  </Box>
);

// Admin Pages
const AdminHomePage = () => (
  <Box sx={{ padding: 3 }}>
    <Paper elevation={2} sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ color: '#1976D2', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Hoş geldiniz! Bu admin panelinden tüm işlemlerinizi yönetebilirsiniz.
      </Typography>
    </Paper>
  </Box>
);

const AdminUsersPage = () => (
  <Box sx={{ padding: 3 }}>
    <Paper elevation={2} sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ color: '#1976D2', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
        Kullanıcı Yönetimi
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Kullanıcı listesi burada görüntülenecek.
      </Typography>
    </Paper>
  </Box>
);


const AdminRealEstateTypesPage = () => (
  <Box sx={{ padding: 3 }}>
    <Paper elevation={2} sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ color: '#1976D2', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
        Emlak Türleri
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Emlak türleri listesi burada görüntülenecek.
      </Typography>
    </Paper>
  </Box>
);

const AdminSettingsPage = () => (
  <Box sx={{ padding: 3 }}>
    <Paper elevation={2} sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ color: '#1976D2', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
        Ayarlar
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Sistem ayarları burada yapılandırılacak.
      </Typography>
    </Paper>
  </Box>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/user" element={<UserHomePage />} />
        <Route path="/user/profile" element={<UserProfilePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminHomePage /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
        <Route path="/admin/real-estates" element={<AdminLayout><AdminEstateListingPage /></AdminLayout>} />
        <Route path="/admin/real-estate-types" element={<AdminLayout><AdminRealEstateTypesPage /></AdminLayout>} />
        <Route path="/admin/currencies" element={<AdminLayout><AdminCurrencyListingPage /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
