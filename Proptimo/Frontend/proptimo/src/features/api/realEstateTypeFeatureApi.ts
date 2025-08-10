import { baseApi } from "./baseApi";
import type { GetAllEstateTypeFeaturesByTypeId } from "./types/realEstateTypeFeature";

export const realEstateTypeFeatureApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRealEstateTypeFeaturesByTypeId: builder.query<GetAllEstateTypeFeaturesByTypeId,string>({
            query: (estateTypeId) => ({
                url: `/realestatetypefeatures/${estateTypeId}`,
            }),
            
            providesTags: (result) =>
                result?.data
            ? [{ type: 'RealEstateTypeFeature' as const, id: result.data[0]?.realEstateTypeId ?? 'LIST' }]
            : [{ type: 'RealEstateTypeFeature' as const, id: 'LIST' }],
        })
    })
})