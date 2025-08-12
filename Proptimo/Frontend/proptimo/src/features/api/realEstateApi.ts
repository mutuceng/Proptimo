import { baseApi } from "./baseApi";
import { type GetRealEstateById, type GetAllRealEstates, type RealEstate, type CreateRealEstateRequest, type UpdateEstateRequest, type GetAllRealEstatesPreviewRequest, type GetAllRealEstatesPreviewResponse } from "./types/realEstate";

export const realEstateApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRealEstates: builder.query<RealEstate[],void>({
            query : () => ({
                url: '/realestates',
            }),

            providesTags: (result) => 
                result ? [
                    ...result.map( ({id}) => ({type: 'RealEstate' as const, id})),
                    {  type: 'RealEstate', id: 'LIST' },
                ] : [{ type: 'RealEstate', id:'LIST'}]
        }),

        getAllRealEstatesPreview: builder.query<GetAllRealEstatesPreviewResponse[],GetAllRealEstatesPreviewRequest>({
            query: (params) => {
                const queryParams = new URLSearchParams();

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });
        
                return {
                    url: `/realestates/allpreview?${queryParams.toString()}`
                };
            },
        }),

        getRealEstateById: builder.query<GetRealEstateById,string>({
            query: (id) => ({
                url: `/realestates/${id}`
            }),
            providesTags: (result, error, id) => [{type: 'RealEstate', id}]
        }),

        createRealEstate: builder.mutation<RealEstate, CreateRealEstateRequest>({
            query: (newEstate) => ({
                url: '/realestates',
                method: 'POST',
                body: newEstate
            }),
            invalidatesTags: [{type: 'RealEstate', id:'LIST'}],

            async onQueryStarted(newEstate, {dispatch, queryFulfilled}){

                try {
                    const {data: createdEstate} = await queryFulfilled;

                    dispatch(
                        realEstateApi.util.updateQueryData('getAllRealEstates', undefined, (draft: RealEstate[]) => {
                            draft.unshift(createdEstate);
                        })
                    )
                } catch(err) {
                    console.error(err);
                }
            }
        }),

        updateRealEstate: builder.mutation<RealEstate, UpdateEstateRequest>({
            query: ({ id, ...patch }) => ({
                url: `/realestates/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'RealEstate', id },
                { type: 'RealEstate', id: 'LIST' },
            ],

            async onQueryStarted(updatedRealEstate, { dispatch, queryFulfilled }) {
                const patchResultById = dispatch(
                    realEstateApi.util.updateQueryData('getRealEstateById', updatedRealEstate.id, (draft: any) => {
                        Object.assign(draft, updatedRealEstate);
                    })
                );

                const patchResultList = dispatch(
                    realEstateApi.util.updateQueryData('getAllRealEstates', undefined, (draft: RealEstate[]) => {
                        const index = draft.findIndex((item: RealEstate) => item.id === updatedRealEstate.id);
                        if (index !== -1) {
                            draft[index] = updatedRealEstate;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResultById.undo();
                    patchResultList.undo();
                }
            },
        }),

        deleteRealEstate: builder.mutation<{success:boolean},string>({
            query : (id) => ({
                url: `/realestates/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'RealEstate', id: 'LIST'}],

            async onQueryStarted(id, {dispatch, queryFulfilled}) {
                const patchResultList = dispatch(
                    realEstateApi.util.updateQueryData('getAllRealEstates', undefined, (draft: RealEstate[]) => {
                        const index = draft.findIndex( (item: RealEstate) => item.id === id);
                        if(index !== -1)
                        {
                            draft.splice(index,1);
                        }
                    })
                )

                const patchResultById = dispatch(
                    realEstateApi.util.updateQueryData('getRealEstateById', id, () => {
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
    useGetAllRealEstatesQuery,
    useGetRealEstateByIdQuery,
    useCreateRealEstateMutation,
    useUpdateRealEstateMutation,
    useDeleteRealEstateMutation,
    useGetAllRealEstatesPreviewQuery,
    
    useLazyGetAllRealEstatesQuery,
    useLazyGetRealEstateByIdQuery,
} = realEstateApi;