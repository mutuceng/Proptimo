import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery(
    {
        baseUrl: import.meta.env.VITE_API_URL
        // buraya auth header gelcek.      
    }
)

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => 
{
    let result = await baseQuery(args, api, extraOptions)

    if(result.error && result.error.status === 401) 
    { 
        console.log("Yetkilendirme başarısız. Yeniden giriş yapın.")
    }

    return result
}

export const api = createApi(
    {
        reducerPath: 'api',
        baseQuery: baseQueryWithReauth,
        tagTypes: ['Currency', 'RealEstate', 'RealEstateType', 'RealEstateTypeFeature', 'RealEstateTypeFeatureValue', 'RealEstateAddress', 'RealEstateImage', 'User'],
        endpoints: () => ({}),

})

export const baseApi = api;
