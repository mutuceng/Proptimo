import { baseApi } from "./baseApi";
import { type GetByIdRealEstateTypeResponse, type GetAllRealEstateTypesResponse, type RealEstateType, 
    type CreateRealEstateTypeRequest, type UpdateRealEstateTypeRequest } from "./types/realEstateType";

export const realEstateTypeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRealEstateTypes: builder.query<GetAllRealEstateTypesResponse, void>({
            query : () => ({
                url: '/realestatetypes',
            }),
            providesTags: (result) => 
                result?.data ? [
                    ...result.data.map( ({id}) => ({type: 'RealEstateType' as const, id})),
                ] : [{ type: 'RealEstateType', id:'LIST'}]
        }),

        getRealEstateTypeById: builder.query<GetByIdRealEstateTypeResponse, string>({
            query : (id) => ({
                url:`/realestatetypes/${id}`
            }),
            providesTags: (result, error, id) => [{type: 'RealEstateType', id}]
        }),

        createRealEstateType: builder.mutation<RealEstateType, CreateRealEstateTypeRequest>(
        {
            query: (newRealEstateType) => ({
                url:'/realestatetypes',
                method: 'POST',
                body: newRealEstateType,
            }),
            invalidatesTags: [{type: 'RealEstateType', id:'LIST'}],

            async onQueryStarted(newRealEstateType, { dispatch, queryFulfilled }) {
                try {
                    const {data : createdType} = await queryFulfilled;

                    dispatch (
                        realEstateTypeApi.util.updateQueryData('getAllRealEstateTypes', undefined, (draft) => {
                            draft.data.unshift(createdType);
                            draft.total = (draft.total ?? 0) + 1;
                        })
                    );
                } catch (err) {
                    console.error("Create RealEstateType failed:", err)
                }
            }
        }),

        updateRealEstateType : builder.mutation<RealEstateType, UpdateRealEstateTypeRequest>({
            query : (updatedRealEstateType) => ({
                url:'/realestatetypes',
                method: 'PUT',
                body: updatedRealEstateType,
            }),
            invalidatesTags: (result, error, {id}) => [{type: 'RealEstateType',id}],

            async onQueryStarted(updatedRealEstateType, {dispatch, queryFulfilled}) {
                const patchResultById  = dispatch(
                    realEstateTypeApi.util.updateQueryData('getRealEstateTypeById', updatedRealEstateType.id, (draft) => {
                        Object.assign(draft, updatedRealEstateType);
                    })               
                )

                const patchResultList = dispatch(
                    realEstateTypeApi.util.updateQueryData('getAllRealEstateTypes', undefined, (draft) => {
                        const index = draft.data.findIndex( (item) => item.id === updatedRealEstateType.id);
                        if(index !== -1)
                        {
                            draft.data[index] = updatedRealEstateType;
                        }
                    })
                )

                try {
                    await queryFulfilled;
                } catch (err){
                    console.error(err);
                    patchResultById.undo();
                    patchResultList.undo();
                }
            }
        }),

        deleteRealEstateType: builder.mutation<{success: boolean},string>({
            query : (id) => ({
                url: `/realestatetypes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'RealEstateType', id: 'LIST'}],
            
            async onQueryStarted(id, {dispatch, queryFulfilled}) {
                const patchResultList = dispatch(
                    realEstateTypeApi.util.updateQueryData('getAllRealEstateTypes', undefined, (draft) => {
                        const index = draft.data.findIndex( (item) => item.id === id);
                        if(index !== -1)
                        {
                            draft.data.splice(index,1);
                            draft.total-=1;
                        }
                    })
                )

                const patchResultById = dispatch(
                    realEstateTypeApi.util.updateQueryData('getRealEstateTypeById', id, () => {
                            return undefined; // cache'i temizler
                        }
                    )
                )

                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error(err);
                    patchResultList.undo();
                    patchResultById.undo();
                }
            }
        })


    })
})

export const { 
    useGetAllRealEstateTypesQuery,
    useGetRealEstateTypeByIdQuery,
    useCreateRealEstateTypeMutation,
    useUpdateRealEstateTypeMutation,
    useDeleteRealEstateTypeMutation
} = realEstateTypeApi;