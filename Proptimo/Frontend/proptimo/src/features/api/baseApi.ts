import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { getTokenFromStorage, shouldRefreshToken, isTokenExpired, getRefreshTokenFromStorage } from '../../utils/tokenUtils'
import { useAuthStore } from '../../store/authStore'

const baseQuery = fetchBaseQuery(
    {
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getTokenFromStorage();
            if (token && !isTokenExpired(token)) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }
)

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => 
{
    let result = await baseQuery(args, api, extraOptions)

    // 401 hatası alındıysa
    if(result.error && result.error.status === 401) 
    { 
        console.log("401 hatası alındı. Token yenilenmeye çalışılıyor...")
        
        // Refresh token ile yeni token almaya çalış
        const refreshToken = getRefreshTokenFromStorage();
        
        if (refreshToken) {
            try {
                // Refresh token endpoint'ini çağır
                const refreshResult = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken })
                });

                if (refreshResult.ok) {
                    const newTokens = await refreshResult.json();
                    
                    if (newTokens.succeeded && newTokens.token) {
                        // Yeni token'ları kaydet
                        useAuthStore.getState().setTokens(
                            newTokens.token.accessToken, 
                            newTokens.token.refreshToken
                        );
                        
                        // Orijinal isteği yeni token ile tekrar dene
                        const newArgs = {
                            ...args,
                            headers: {
                                ...args.headers,
                                'Authorization': `Bearer ${newTokens.token.accessToken}`
                            }
                        };
                        
                        result = await baseQuery(newArgs, api, extraOptions);
                        return result;
                    }
                }
            } catch (error) {
                console.error('Token yenileme hatası:', error);
            }
        }
        
        // Token yenileme başarısızsa logout yap
        useAuthStore.getState().clearTokens();
        console.log("Token yenileme başarısız. Kullanıcı logout edildi.");
    }

    return result
}

export const api = createApi(
    {
        reducerPath: 'api',
        baseQuery: baseQueryWithReauth,
        tagTypes: ['Currency', 'RealEstate', 'RealEstateType', 'RealEstateTypeFeature', 'RealEstateTypeFeatureValue', 'RealEstateAddress', 'RealEstateImage', 'User', 'LocationData'],
        endpoints: () => ({}),

})

export const baseApi = api;
