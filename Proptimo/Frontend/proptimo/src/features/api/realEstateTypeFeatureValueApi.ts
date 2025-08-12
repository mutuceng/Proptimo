import { baseApi } from "./baseApi";
import { type RealEstateTypeFeatureValue, type UpdateRealEstateTypeFeatureValueRequest,type GetRealEstateTypeFeatureValuesByRealEstateIdResponse} from "./types/realEstateTypeFeatureValue";

export const realEstateTypeFeatureValueApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRealEstateTypeFeatureValuesByRealEstateId: builder.query<GetRealEstateTypeFeatureValuesByRealEstateIdResponse, string>({
            query: (realEstateId) => ({
                url: `/realestatetypefeaturevalues/realestate/${realEstateId}`
            }),
            providesTags: (result, error, realEstateId) => [
                { type: 'RealEstateTypeFeatureValue', id: 'LIST' },
                { type: 'RealEstateTypeFeatureValue', id: realEstateId }
            ]
        }),

        createRealEstateTypeFeatureValue: builder.mutation<RealEstateTypeFeatureValue[], RealEstateTypeFeatureValue[]>({
            query: (newFeatureValues) => ({
                url: '/realestatetypefeaturevalues',
                method: 'POST',
                body: newFeatureValues,
            }),
            invalidatesTags: (result, error, newFeatureValues) => {
                // Bulk create için tüm realEstateId'leri invalidate et
                const realEstateIds = newFeatureValues.map(cmd => cmd.realEstateId);
                return [
                    { type: 'RealEstateTypeFeatureValue' as const, id: 'LIST' },
                    ...realEstateIds.map(id => ({ type: 'RealEstateTypeFeatureValue' as const, id }))
                ];
            },

            async onQueryStarted(newFeatureValues, { dispatch, queryFulfilled }) {
                try {
                    const { data: createdFeatureValues } = await queryFulfilled;

                    // Her bir realEstateId için cache'i güncelle
                    newFeatureValues.forEach((newFeatureValue, index) => {
                        const createdValue = createdFeatureValues[index];
                        if (createdValue) {
                            dispatch(
                                realEstateTypeFeatureValueApi.util.updateQueryData('getRealEstateTypeFeatureValuesByRealEstateId', newFeatureValue.realEstateId, (draft) => {
                                    if (draft && draft.data) {
                                        draft.data.unshift(createdValue);
                                        draft.total = (draft.total ?? 0) + 1;
                                    }
                                })
                            );
                        }
                    });
                } catch (err) {
                    console.error("Create RealEstateTypeFeatureValue failed:", err)
                }
            }
        }),

        updateRealEstateTypeFeatureValue: builder.mutation<RealEstateTypeFeatureValue, UpdateRealEstateTypeFeatureValueRequest>({
            query: (updatedFeatureValue) => ({
                url: '/realestatetypefeaturevalues',
                method: 'PUT',
                body: updatedFeatureValue,
            }),
            invalidatesTags: (result, error, updatedFeatureValue) => [
                { type: 'RealEstateTypeFeatureValue', id: updatedFeatureValue.id },
                { type: 'RealEstateTypeFeatureValue', id: updatedFeatureValue.realEstateId }
            ],

            async onQueryStarted(updatedFeatureValue, { dispatch, queryFulfilled }) {
                const patchResultByRealEstateId = dispatch(
                    realEstateTypeFeatureValueApi.util.updateQueryData('getRealEstateTypeFeatureValuesByRealEstateId', updatedFeatureValue.realEstateId, (draft) => {
                        if (draft && draft.data) {
                            const index = draft.data.findIndex((item) => item.id === updatedFeatureValue.id);
                            if (index !== -1) {
                                draft.data[index] = updatedFeatureValue;
                            }
                        }
                    })
                )

                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error(err);
                    patchResultByRealEstateId.undo();
                }
            }
        }),

        deleteRealEstateTypeFeatureValue: builder.mutation<{ success: boolean }, { id: string, realEstateId: string }>({
            query: ({ id }) => ({
                url: `/realestatetypefeaturevalues/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { realEstateId }) => [
                { type: 'RealEstateTypeFeatureValue', id: 'LIST' },
                { type: 'RealEstateTypeFeatureValue', id: realEstateId }
            ],

            async onQueryStarted({ id, realEstateId }, { dispatch, queryFulfilled }) {
                const patchResultByRealEstateId = dispatch(
                    realEstateTypeFeatureValueApi.util.updateQueryData('getRealEstateTypeFeatureValuesByRealEstateId', realEstateId, (draft) => {
                        if (draft && draft.data) {
                            const index = draft.data.findIndex((item) => item.id === id);
                            if (index !== -1) {
                                draft.data.splice(index, 1);
                                draft.total = (draft.total ?? 1) - 1;
                            }
                        }
                    })
                )

                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error(err);
                    patchResultByRealEstateId.undo();
                }
            }
        })
    })
});

export const {
    useGetRealEstateTypeFeatureValuesByRealEstateIdQuery,
    useCreateRealEstateTypeFeatureValueMutation,
    useUpdateRealEstateTypeFeatureValueMutation,
    useDeleteRealEstateTypeFeatureValueMutation
} = realEstateTypeFeatureValueApi;
