import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';


// Admin Layout
import AdminLayout from './components/admin/AdminLayout';

// Admin Pages
import AdminCurrencyListingPage from './pages/admin/currency/AdminCurrencyListingPage';
import AdminEstateListingPage from './pages/admin/estate/AdminEstateListingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UserLayout from './components/user/UserLayout';
import AdminEstateTypesListingPage from './pages/admin/estateType/AdminEstateTypesListingPage';
import AdminEstateTypeFeaturesListingPage from './pages/admin/estateTypeFeature/AdminEstateTypeFeaturesListingPage';
import AddRealEstatePage from './pages/admin/estate/AddRealEstatePage';
import AddAddressPage from './pages/admin/estate/AddAddressPage';
import UploadImagesPage from './pages/admin/estate/UploadImagesPage';
import AddRealEstateFeaturesPage from './pages/admin/estate/AddRealEstateFeaturesPage';
import { EstateCreationProvider } from './context/EstateCreationContext';
import UserHomePage from './pages/user/UserHomePage';
import UserEstateListingPage from './pages/user/UserEstateListingPage';
import UserEstateDetailPage from './pages/user/UserEstateDetailPage';

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
      <EstateCreationProvider>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout><UserHomePage /></UserLayout>} />
          <Route path="/listings" element={<UserLayout><UserEstateListingPage /></UserLayout>} />
          <Route path="/listings/:estateId" element={<UserLayout><UserEstateDetailPage /></UserLayout>} />
          <Route path="/login" element={<UserLayout><LoginPage /></UserLayout>} />
          <Route path="/register" element={<UserLayout><RegisterPage /></UserLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminEstateListingPage /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
          <Route path="/admin/real-estates" element={<AdminLayout><AdminEstateListingPage /></AdminLayout>} />
          
          <Route path="/admin/real-estates/create" element={<AdminLayout><AddRealEstatePage /></AdminLayout>} />
          <Route path="/admin/real-estates/create/features/:estateId/:estateTypeId" element={<AdminLayout><AddRealEstateFeaturesPage /></AdminLayout>} />
          <Route path="/admin/real-estates/create/address/:estateId" element={<AdminLayout><AddAddressPage /></AdminLayout>} />
          <Route path="/admin/real-estates/create/images/:estateId" element={<AdminLayout><UploadImagesPage /></AdminLayout>} />
      
          <Route path="/admin/real-estate-types" element={<AdminLayout><AdminEstateTypesListingPage /></AdminLayout>} />
          <Route path="/admin/real-estate-type-features/:typeId" element={<AdminLayout><AdminEstateTypeFeaturesListingPage /></AdminLayout>} />
          <Route path="/admin/currencies" element={<AdminLayout><AdminCurrencyListingPage /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />

          {/* Varsayılan yönlendirme */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </EstateCreationProvider>
    </Router>
  );
}

export default App;
