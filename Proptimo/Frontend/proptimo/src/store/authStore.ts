import { create } from 'zustand';
import { getTokenFromStorage, shouldRefreshToken, isTokenExpired, clearTokensFromStorage } from '../utils/tokenUtils';

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  shouldRefreshToken: () => boolean;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: getTokenFromStorage(),
  refreshToken: null,
  isAuthenticated: !!getTokenFromStorage() && !isTokenExpired(getTokenFromStorage()!),
  
  setTokens: (accessToken: string, refreshToken: string) => {
    set({ accessToken, refreshToken, isAuthenticated: true });
  },
  
  clearTokens: () => {
    clearTokensFromStorage();
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  
  shouldRefreshToken: () => {
    const { accessToken } = get();
    return accessToken ? shouldRefreshToken(accessToken) : false;
  },
  
  isTokenExpired: () => {
    const { accessToken } = get();
    return accessToken ? isTokenExpired(accessToken) : true;
  }
}));
