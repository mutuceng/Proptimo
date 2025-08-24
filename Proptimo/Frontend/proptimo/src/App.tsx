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
