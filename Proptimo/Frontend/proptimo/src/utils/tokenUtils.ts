import { type TokenResponseDto } from '../features/api/types/user';

// Token'ı decode et
export const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      permissions: payload.permissions || [],
      exp: payload.exp,
      iat: payload.iat
    };
  } catch {
    return null;
  }
};

// Token'ın süresi dolmuş mu kontrol et
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Unix timestamp'i milisaniyeye çevir
    return Date.now() >= expirationTime;
  } catch {
    return true; // Token geçersizse expired kabul et
  }
};

// Token'ın süresi dolmak üzere mi kontrol et (5 dakika kala)
export const shouldRefreshToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    
    // Token'ın süresi 5 dakika içinde dolacaksa yenile
    return timeUntilExpiry < 5 * 60 * 1000;
  } catch {
    return true;
  }
};

// LocalStorage'dan token'ı al
export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('accessToken');
};

// LocalStorage'a token'ı kaydet
export const saveTokenToStorage = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

// LocalStorage'dan refresh token'ı al
export const getRefreshTokenFromStorage = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// LocalStorage'a refresh token'ı kaydet
export const saveRefreshTokenToStorage = (token: string): void => {
  localStorage.setItem('refreshToken', token);
};

// Token'ları temizle
export const clearTokensFromStorage = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Kullanıcının belirli bir role sahip olup olmadığını kontrol et
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  // Sadece iki rol olduğu için doğrudan karşılaştırma yapıyoruz
  return userRole === requiredRole;
};

// Kullanıcının belirli bir permission'a sahip olup olmadığını kontrol et
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};
