import { baseApi } from "./baseApi";
import { type GetRealEstateById, type GetAllRealEstates, type RealEstate, type CreateRealEstateRequest, type UpdateEstateRequest, type GetAllRealEstatesPreviewRequest, type GetAllRealEstatesPreviewResponse, type GetRealEstateDetailResponse, type GetAllRealEstatesPreviewResponseWithPaging, type CreateRealEstateCompleteRequest, type CreateRealEstateCompleteResponse } from "./types/realEstate";

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
                    url: `/RealEstates/allpreview?${queryParams.toString()}`
                };
            },
        }),
        getRealEstateDetail: builder.query<GetRealEstateDetailResponse,string>({
            query: (id) => ({
                url: `/RealEstates/detail/${id}`
            }),

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

        // Yeni tek seferde create endpoint'i
        createRealEstateComplete: builder.mutation<CreateRealEstateCompleteResponse, CreateRealEstateCompleteRequest>({
            query: (completeData) => {
                console.log('=== API CALL DEBUG ===');
                console.log('URL:', '/realestates');
                console.log('Method:', 'POST');
                console.log('Complete Data:', completeData);
                
                // Backend'in yeni API yapısına uygun olarak FormData kullanıyoruz
                const formData = new FormData();
                
                // JSON verilerini string olarak ekle
                const jsonData = {
                    createEstateCommand: completeData.createEstateCommand,
                    createAddressCommand: completeData.createAddressCommand,
                    createRealEstateTypeFeatureValueCommand: completeData.createRealEstateTypeFeatureValueCommand,
                    uploadRealEstatePhotosDto: {
                        commands: completeData.uploadRealEstatePhotosDto.commands
                    }
                };
                
                formData.append('JsonData', JSON.stringify(jsonData));
                
                // Resim dosyalarını ekle
                if (completeData.uploadRealEstatePhotosDto.imageFiles) {
                    completeData.uploadRealEstatePhotosDto.imageFiles.forEach((file: File, index: number) => {
                        formData.append('Images', file);
                    });
                }
                
                console.log('FormData created with JsonData:', jsonData);
                console.log('Image files count:', completeData.uploadRealEstatePhotosDto.imageFiles?.length || 0);
                
                return {
                    url: '/realestates',
                    method: 'POST',
                    body: formData,
                    // FormData kullanırken Content-Type header'ı otomatik olarak multipart/form-data olacak
                };
            },
            invalidatesTags: [{type: 'RealEstate', id:'LIST'}],

            async onQueryStarted(completeData, {dispatch, queryFulfilled}){
                try {
                    const {data: createdEstate} = await queryFulfilled;

                    // Preview data'yı cache'e ekle
                    dispatch(
                        realEstateApi.util.updateQueryData('getAllRealEstatesPreview', {
                            pageNumber: 1
                        }, (draft: any) => {
                            if (draft?.data) {
                                draft.data.unshift({
                                    realEstateId: createdEstate.realEstateId,
                                    primaryImageUrl: createdEstate.primaryImageUrl,
                                    realEstateTypeName: createdEstate.realEstateTypeName,
                                    realEstateTitle: createdEstate.realEstateTitle,
                                    realEstateStartDate: createdEstate.realEstateStartDate,
                                    realEstateEndDate: createdEstate.realEstateEndDate,
                                    price: createdEstate.price,
                                    cityName: createdEstate.cityName,
                                    districtName: createdEstate.districtName,
                                    latitude: createdEstate.latitude,
                                    longitude: createdEstate.longitude,
                                    realEstateState: createdEstate.realEstateState,
                                    pageNumber: 1,
                                    pageSize: 10
                                });
                            }
                        })
                    );
                } catch(err) {
                    console.error(err);
                }
            }
        }),

        updateRealEstate: builder.mutation<RealEstate, UpdateEstateRequest>({
            query: (updateData) => ({
                url: `/realestates`,
                method: 'PUT',
                body: updateData,
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
    useCreateRealEstateCompleteMutation,
    useUpdateRealEstateMutation,
    useDeleteRealEstateMutation,
    useGetAllRealEstatesPreviewQuery,
    useGetRealEstateDetailQuery,
    
    useLazyGetAllRealEstatesQuery,
    useLazyGetRealEstateByIdQuery,
} = realEstateApi;