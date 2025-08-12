import { baseApi } from "./baseApi";
import { type GetAllCitiesResponse, type GetAllDistrictsByCityIdResponse, type GetAllNeighborhoodsByDistrictResponse } from "./types/locationData";

export const locationDataApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCities: builder.query<GetAllCitiesResponse,void>({
            query: () => ({
                url: '/locationdatas/getallcities'
            }),
            providesTags: [{ type: 'LocationData', id: 'CITIES' }]
        }),

        getAllDistrictsByCityId: builder.query<GetAllDistrictsByCityIdResponse,string>({
            query: (cityId) => ({
                url: `/locationdatas/getalldistricts/${cityId}`
            }),
            providesTags: (result, error, cityId) => [
                { type: 'LocationData', id: `DISTRICTS_${cityId}` },
                { type: 'LocationData', id: 'DISTRICTS_LIST' }
            ]
        }),

        getAllNeighborhoodsByDistrictId: builder.query<GetAllNeighborhoodsByDistrictResponse,string>({
            query: (districtId) => ({
                url: `/locationdatas/getallneighborhoods/${districtId}`
            }),
            providesTags: (result, error, districtId) => [
                { type: 'LocationData', id: `NEIGHBORHOODS_${districtId}` },
                { type: 'LocationData', id: 'NEIGHBORHOODS_LIST' }
            ]
        }),
    })
})

export const {
    useGetAllCitiesQuery,
    useGetAllDistrictsByCityIdQuery,
    useGetAllNeighborhoodsByDistrictIdQuery,
} = locationDataApi;