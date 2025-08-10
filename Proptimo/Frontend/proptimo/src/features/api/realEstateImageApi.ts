import { baseApi } from "./baseApi";
import type { GetAllRealEstateImagesByEstateId, RealEstateImage, UploadRealEstateImagesRequest } from "./types/realEstateImage";

const realEstateImageApi = baseApi.injectEndpoints( {
    endpoints : (builder) => (
        {
            getAllImagesByEstateId: builder.query<GetAllRealEstateImagesByEstateId,string>({
                query : (estateId) => ({
                    url: `/realestateimages/${estateId}`,
                }),
                providesTags: (result, error, estateId) =>
                    result
                      ? [{ type: 'RealEstateImage', id: estateId }]
                      : [{ type: 'RealEstateImage', id: 'LIST' }],
            }), 

            uploadRealEstateImages: builder.mutation<RealEstateImage[], UploadRealEstateImagesRequest>({
                query : (data) => {
                    const formData = new FormData();
                    formData.append("Commands", JSON.stringify(data.commands));
                    data.imageFiles.forEach( (file) => { formData.append("ImageFiles", file)});

                    return {
                        url: '/realestatesimages',
                        method: 'POST',
                        body: formData
                    }
                },
                invalidatesTags : (result, error, data) => [{type: "RealEstateImage", id: data.commands[0].realEstateId}],

                async onQueryStarted(data, {dispatch, queryFulfilled}){
                    const patchResult = dispatch(
                        realEstateImageApi.util.updateQueryData("getAllImagesByEstateId", data.commands[0].realEstateId, (draft) => {
                            data.commands.forEach((cmd, index) => {
                                const tempImage: RealEstateImage = {
                                    id: `temp-${Date.now()}-${index}`, // Geçici ID
                                    imageUrl: URL.createObjectURL(data.imageFiles[index]),
                                    isPrimary: cmd.isPrimary,
                                    order: cmd.order,
                                    realEstateId: cmd.realEstateId
                                };
                                draft.data.push(tempImage);
                            });
                            // Total sayısını güncelle
                            draft.total += data.commands.length;
                        })
                    );

                    try {
                        await queryFulfilled;
                    } catch (error) {
                        patchResult.undo();
                    }
                } 
            }),

            deleteRealEstateImage: builder.mutation<{success: boolean}, { estateId: string; imageId: string }>({
                query : ({imageId}) => ({
                    url: `/realestatesimages/${imageId}`,
                    method: 'DELETE',
                }),
            
                invalidatesTags: (result, error, {estateId}) => [{ type: 'RealEstateImage', id: estateId }],

                async onQueryStarted({ estateId, imageId }, { dispatch, queryFulfilled }) {
                    const patchResult = dispatch(
                      realEstateImageApi.util.updateQueryData('getAllImagesByEstateId', estateId, (draft) => {
                        const index = draft.data.findIndex((img: RealEstateImage) => img.id === imageId);
                        if (index !== -1) {
                          draft.data.splice(index, 1);
                          draft.total -= 1;
                        }
                      })
                    );
                
                    try {
                      await queryFulfilled;
                    } catch (error) {
                        console.error(error);
                      patchResult.undo();
                    }
                  },
            })
        }
    )
});

export const { 
    useGetAllImagesByEstateIdQuery, 
    useUploadRealEstateImagesMutation ,
    useDeleteRealEstateImageMutation
} = realEstateImageApi;