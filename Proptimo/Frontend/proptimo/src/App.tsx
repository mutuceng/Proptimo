import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';

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
import EditRealEstatePage from './pages/admin/estate/update/EditRealEstataPage';
import EditAddressPage from './pages/admin/estate/update/EditAddressPage';
import EditImagesPage from './pages/admin/estate/update/EditImagesPage';
import EditRealEstateFeaturesPage from './pages/admin/estate/update/EditRealEstateFeaturesPage';
import UserHomePage from './pages/user/UserHomePage';
import UserEstateListingPage from './pages/user/UserEstateListingPage';
import UserEstateDetailPage from './pages/user/UserEstateDetailPage';



function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<UserLayout><UserHomePage /></UserLayout>} />
            <Route path="/listings" element={<UserLayout><UserEstateListingPage /></UserLayout>} />
            <Route path="/listings/:estateId" element={<UserLayout><UserEstateDetailPage /></UserLayout>} />
            <Route path="/login" element={
              <PublicRoute>
                <UserLayout><LoginPage /></UserLayout>
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <UserLayout><RegisterPage /></UserLayout>
              </PublicRoute>
            } />
            
            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><AdminEstateListingPage /></AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin/real-estates" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><AdminEstateListingPage /></AdminLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/real-estates/create" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><AddRealEstatePage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/real-estates/create/features/:estateId/:estateTypeId" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><AddRealEstateFeaturesPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/real-estates/create/address/:estateId" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><AddAddressPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/real-estates/create/images/:estateId" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><UploadImagesPage /></AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* Update Routes */}
            <Route path="/admin/real-estates/edit/:estateId" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><EditRealEstatePage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/real-estates/edit/:estateId/features/:estateTypeId" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><EditRealEstateFeaturesPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/real-estates/edit/:estateId/address" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><EditAddressPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/real-estates/edit/:estateId/images" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><EditImagesPage /></AdminLayout>
              </ProtectedRoute>
            } />
        
            <Route path="/admin/real-estate-types" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><AdminEstateTypesListingPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/real-estate-types/features/:typeId" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><AdminEstateTypeFeaturesListingPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/currencies" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout><AdminCurrencyListingPage /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Varsayılan yönlendirme */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
