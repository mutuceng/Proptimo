import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRefreshTokenMutation } from '../features/api/userApi';
import { useAuthStore } from '../store/authStore';
import type { User, LoginResponse } from '../features/api/types/user';
import {
  decodeToken,
  isTokenExpired,
  shouldRefreshToken,
  getTokenFromStorage,
  saveTokenToStorage,
  getRefreshTokenFromStorage,
  saveRefreshTokenToStorage,
  clearTokensFromStorage,
  hasRole,
  hasPermission
} from '../utils/tokenUtils';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  
  // Utilities
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isTokenExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true
  });

  const [login] = useLoginMutation();
  const [refreshToken] = useRefreshTokenMutation();
  const navigate = useNavigate();

  // Sayfa yüklendiğinde token kontrolü
  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = getTokenFromStorage();
      const refreshToken = getRefreshTokenFromStorage();

      if (accessToken && !isTokenExpired(accessToken)) {
        const decodedToken = decodeToken(accessToken);
        if (decodedToken) {
          // Token geçerli, kullanıcıyı set et
          setAuthState({
            user: {
              id: decodedToken.userId,
              userName: decodedToken.email, // JWT'den gelen bilgiye göre ayarla
              name: '', // JWT'den gelmiyorsa boş bırak
              surname: '',
              email: decodedToken.email,
              birthDate: new Date(),
              phoneNumber: ''
            },
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          // Token geçersiz, temizle
          clearTokensFromStorage();
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        // Token yok veya expired
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Login fonksiyonu
  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await login({ email, password }).unwrap();
      
      if (response.succeeded && response.token) {
        const { accessToken, refreshToken } = response.token;
        
        // Token'ları kaydet
        saveTokenToStorage(accessToken);
        saveRefreshTokenToStorage(refreshToken);
        
        // Auth store'u güncelle
        useAuthStore.getState().setTokens(accessToken, refreshToken);
        
        // Token'ı decode et
        const decodedToken = decodeToken(accessToken);
        
        if (decodedToken) {
          setAuthState({
            user: {
              id: decodedToken.userId,
              userName: decodedToken.email,
              name: '',
              surname: '',
              email: decodedToken.email,
              birthDate: new Date(),
              phoneNumber: ''
            },
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
          
          // Başarılı login sonrası yönlendirme
          navigate('/admin/home');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Logout fonksiyonu
  const handleLogout = () => {
    clearTokensFromStorage();
    useAuthStore.getState().clearTokens();
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    });
    navigate('/login');
  };

  // Token yenileme fonksiyonu
  const handleRefreshToken = async () => {
    try {
      const currentRefreshToken = getRefreshTokenFromStorage();
      
      if (!currentRefreshToken) {
        throw new Error('Refresh token bulunamadı');
      }

      const response = await refreshToken({ refreshToken: currentRefreshToken }).unwrap();
      
      if (response.succeeded && response.token) {
        const { accessToken, refreshToken: newRefreshToken } = response.token;
        
        // Yeni token'ları kaydet
        saveTokenToStorage(accessToken);
        saveRefreshTokenToStorage(newRefreshToken);
        
        // Token'ı decode et
        const decodedToken = decodeToken(accessToken);
        
        if (decodedToken) {
          setAuthState(prev => ({
            ...prev,
            user: {
              id: decodedToken.userId,
              userName: decodedToken.email,
              name: '',
              surname: '',
              email: decodedToken.email,
              birthDate: new Date(),
              phoneNumber: ''
            },
            accessToken,
            refreshToken: newRefreshToken,
            isAuthenticated: true
          }));
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // Refresh token geçersizse logout yap
      handleLogout();
      throw error;
    }
  };

  // Rol kontrolü
  const checkRole = (role: string): boolean => {
    if (!authState.user) return false;
    const decodedToken = decodeToken(authState.accessToken!);

    const result = decodedToken ? hasRole(decodedToken.role, role) : false;
    return result;
  };

  // Permission kontrolü
  const checkPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    const decodedToken = decodeToken(authState.accessToken!);
    return decodedToken ? hasPermission(decodedToken.permissions, permission) : false;
  };

  // Token expired kontrolü
  const checkTokenExpired = (): boolean => {
    return authState.accessToken ? isTokenExpired(authState.accessToken) : true;
  };

  const value: AuthContextType = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    hasRole: checkRole,
    hasPermission: checkPermission,
    isTokenExpired: checkTokenExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
