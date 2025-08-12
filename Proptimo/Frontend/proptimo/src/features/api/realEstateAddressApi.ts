import { baseApi } from "./baseApi";
import type { CreateRealEstateAddress, GetAddressByEstateId, RealEstateAddress, UpdateRealEstateAddress } from "./types/realEstateAddress";

export const realEstateAddressApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRealEstateAddressByEstateId: builder.query<GetAddressByEstateId,string>({
            query : (estateId) => ({
                url: `/RealEstateAddresses/${estateId}`
            }),

            providesTags: (result, error, estateId) => [
                { type: 'RealEstateAddress', id: estateId },
                { type: 'RealEstateAddress', id: 'LIST' }
            ]

        }),


        createRealEstateAddress: builder.mutation<RealEstateAddress, CreateRealEstateAddress>({
            query: (newEstate) => ({
                url: '/RealEstateAddresses',
                method: 'POST',
                body: newEstate
            }),
            invalidatesTags: (result, error, newEstate) => [
                { type: 'RealEstateAddress', id: newEstate.realEstateId },
                { type: 'RealEstateAddress', id: 'LIST' }
            ],

            async onQueryStarted(newEstate, {dispatch, queryFulfilled}){

                try {
                    const {data: createdEstate} = await queryFulfilled;

                    dispatch(
                        realEstateAddressApi.util.updateQueryData('getRealEstateAddressByEstateId', newEstate.realEstateId, (draft: GetAddressByEstateId) => {
                            Object.assign(draft, createdEstate);
                        })
                    )
                } catch(err) {
                    console.error(err);
                }
            }
        }),

        updateRealEstateAddress: builder.mutation<RealEstateAddress, UpdateRealEstateAddress>({
            query: ({ id, ...patch }) => ({
                url: `/RealEstateAddresses/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, updatedAddress) => [
                { type: 'RealEstateAddress', id: updatedAddress.realEstateId },
                { type: 'RealEstateAddress', id: 'LIST' },
            ],

            async onQueryStarted(updatedRealEstateAddress, { dispatch, queryFulfilled }) {
                const patchResultById = dispatch(
                    realEstateAddressApi.util.updateQueryData('getRealEstateAddressByEstateId', updatedRealEstateAddress.realEstateId, (draft: GetAddressByEstateId) => {
                        Object.assign(draft, updatedRealEstateAddress);
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResultById.undo();
                }
            },
        }),

        deleteRealEstateAddress: builder.mutation<{success:boolean},string>({
            query : (id) => ({
                url: `/RealEstateAddresses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'RealEstateAddress', id: 'LIST' }
            ],

            async onQueryStarted(id, {dispatch, queryFulfilled}) {
                const patchResultById = dispatch(
                    realEstateAddressApi.util.updateQueryData('getRealEstateAddressByEstateId', id, () => {
                        return undefined; 
                    })
                )

                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error(err);
                    patchResultById.undo();
                }
            }
        })
    })
})

export const {
    useGetRealEstateAddressByEstateIdQuery,
    useCreateRealEstateAddressMutation,
    useUpdateRealEstateAddressMutation,
    useDeleteRealEstateAddressMutation,
    
    useLazyGetRealEstateAddressByEstateIdQuery,
} = realEstateAddressApi;