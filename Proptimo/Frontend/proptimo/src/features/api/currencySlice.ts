import { baseApiSlice } from "./baseApiSlice";
import { type CreateCurrencyRequest, type Currency, type CurrencyQuery, type GetAllCurrencyResponse, type UpdateCurrencyRequest } from "./types/currency";


export const currencySlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
            getAllCurrencies : builder.query<GetAllCurrencyResponse, CurrencyQuery | void>({
                    query: (params = {}) => ({
                        url: '/currency',
                        params: {
                            page: params?.page || 1,
                            limit: params?.limit || 10,
                            ...params,
                        },
                    }),
                    providesTags: (result) => 
                        result?.data 
                        ? [
                            ...result.data.map(({ id }) => ({ type: 'Currency' as const, id })),
                                    {  type: 'Currency', id: 'LIST' },
                        ] : [{ type: 'Currency', id: 'LIST' }]
                }),

            getCurrencyById : builder.query<Currency, string>({
                    query: (id) =>`/currency/${id}`,
                    providesTags: (result, error, id) => [{type: 'Currency', id}],
                }),
            
            createCurrency : builder.mutation<Currency, CreateCurrencyRequest>({
                query : (newCurrency) => ({
                    url: '/currency',
                    method: 'POST',
                    body: newCurrency,
                }),
                invalidatesTags: [{type: 'Currency', id:'LIST'}],

                onQueryStarted: async (newCurrency, {dispatch, queryFulfilled}) =>
                {
                    try {
                        const {data: createdCurrency} = await queryFulfilled;

                        dispatch(
                            currencySlice.util.updateQueryData('getAllCurrencies', undefined, (draft) => {
                                draft.data.unshift(createdCurrency),
                                draft.total = (draft.total ?? 0) + 1;
                            })
                        );
                    } catch (err){
                        throw(err);
                        // error durumunda cache'i geri al.
                    }
                }
            }),

            updateCurrency: builder.mutation<Currency, UpdateCurrencyRequest>({
                query: ({id, ...patch}) => ({
                    url: `/currency/${id}`,
                    method: 'PUT',
                    body: patch,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Currency', id}],

                async onQueryStarted({id, ...patch}, {dispatch, queryFulfilled}) {
                   
                    const patchResult = dispatch(
                        currencySlice.util.updateQueryData('getCurrencyById', id, (draft: any) => {
                            Object.assign(draft, patch);
                        })
                    );

                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                },
            }),

            deleteCurrency: builder.mutation<{success: boolean}, string>({
                query: (id) => ({
                    url: `/currency/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: [{type: 'Currency', id: 'LIST'}],

                onQueryStarted: async (id, {dispatch, queryFulfilled}) => {
                    const patchResult = dispatch(
                        currencySlice.util.updateQueryData('getAllCurrencies', undefined, (draft:any) => 
                        {
                            const index = draft.data.findIndex((currency: Currency) => currency.id === id);
                            if(index !== -1){
                                draft.data.splice(index,1);
                                draft.total-=1;
                            }
                        })
                    );

                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                }
            })

        })
})

export const {
    useGetAllCurrenciesQuery,
    useGetCurrencyByIdQuery,
    useCreateCurrencyMutation,
    useUpdateCurrencyMutation,
    useDeleteCurrencyMutation,

    useLazyGetAllCurrenciesQuery,
    useLazyGetCurrencyByIdQuery
} = currencySlice;