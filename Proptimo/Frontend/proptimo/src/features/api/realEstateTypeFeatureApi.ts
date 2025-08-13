import { baseApi } from "./baseApi";
import { type UpdateRealEstateTypeFeature, type CreateRealEstateTypeFeature, type GetAllEstateTypeFeaturesByTypeId, type RealEstateTypeFeature } from "./types/realEstateTypeFeature";

export const realEstateTypeFeatureApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRealEstateTypeFeaturesByTypeId: builder.query<GetAllEstateTypeFeaturesByTypeId,string>({
            query: (estateTypeId) => ({
                url: `/realestatetypefeatures/${estateTypeId}`,
            }),
            providesTags: (result, error, estateTypeId) =>
                result
                    ? [{ type: 'RealEstateTypeFeature' as const, id: estateTypeId }]
                    : [{ type: 'RealEstateTypeFeature' as const, id: 'LIST' }],
        }),

        createRealEstateTypeFeature: builder.mutation<RealEstateTypeFeature,CreateRealEstateTypeFeature>({
            query : (newTypeFeature) => ({
                url : '/realestatetypefeatures',
                method: 'POST',
                body : newTypeFeature
            }),
            invalidatesTags: (result, error, newTypeFeature) => [
                { type: 'RealEstateTypeFeature' as const, id: newTypeFeature.realEstateTypeId }
            ],
            async onQueryStarted(newTypeFeature, { dispatch, queryFulfilled }) {
                try {
                    const { data: createdFeature } = await queryFulfilled;
                    dispatch(
                        realEstateTypeFeatureApi.util.updateQueryData(
                            'getAllRealEstateTypeFeaturesByTypeId',
                            createdFeature.realEstateTypeId,
                            (draft) => {
                                draft.data.unshift(createdFeature);
                                draft.total = (draft.total ?? 0) + 1;
                            }
                        )
                    );
                } catch (err) {
                    console.error('Create RealEstateTypeFeature failed:', err);
                }
            }
        }),

        updateRealEstateTypeFeature: builder.mutation<RealEstateTypeFeature, UpdateRealEstateTypeFeature>({
            query: (updatedTypeFeature) => ({
                url : '/realestatetypefeatures',
                method: 'PUT',
                body : updatedTypeFeature
            }),
            invalidatesTags : (result, error, {id}) => [{type: 'RealEstateTypeFeature', id}],

            async onQueryStarted(updatedTypeFeature, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    realEstateTypeFeatureApi.util.updateQueryData('getAllRealEstateTypeFeaturesByTypeId', updatedTypeFeature.realEstateTypeId, (draft) =>{
                        Object.assign(draft, updatedTypeFeature);
                    })
                )

                try {
                    await queryFulfilled;
                } catch(err) {
                    console.error(err);
                    patchResult.undo();
                }
            }
        }),

        deleteRealEstateTypeFeature: builder.mutation<{success: boolean},{featureId: string, typeId: string}>({
            query: ({featureId}) => ({
                url: `/realestatetypefeatures/${featureId}`,
                method: 'DELETE',
            }),
            invalidatesTags : (result, error, {typeId}) => [{type: 'RealEstateTypeFeature', typeId}],

            async onQueryStarted({featureId, typeId}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    realEstateTypeFeatureApi.util.updateQueryData('getAllRealEstateTypeFeaturesByTypeId', typeId, (draft) =>{
                        const index = draft.data.findIndex( (feature: RealEstateTypeFeature) => feature.id === featureId );
                        if (index !== -1){
                            draft.data.splice(index,1);
                            draft.total -=2;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error(err);
                    patchResult.undo();
                }
            }
        })
    })
})

export const {
    useCreateRealEstateTypeFeatureMutation,
    useDeleteRealEstateTypeFeatureMutation,
    useGetAllRealEstateTypeFeaturesByTypeIdQuery,
    useUpdateRealEstateTypeFeatureMutation,

} = realEstateTypeFeatureApi;