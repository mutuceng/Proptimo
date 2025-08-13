import { baseApi } from "./baseApi";
import { type User, type LoginRequest, type RegisterRequest, type LoginResponse, type RefreshAccessTokenRequest, type RefreshTokenResponse } from "./types/user";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (loginData) => ({
                url: '/logins',
                method: 'POST',
                body: loginData
            }),
        }),

        register: builder.mutation<void, RegisterRequest>({
            query: (registerData) => ({
                url: '/registers',
                method: 'POST',
                body: registerData
            }),
        }),

        refreshToken: builder.mutation<RefreshTokenResponse, RefreshAccessTokenRequest>({
            query: (refreshData) => ({
                url: '/auth/refresh',
                method: 'POST',
                body: refreshData
            }),
        }),

        getAllUsers: builder.query<User[], void>({
            query: () => ({
                url: '/users',
            }),
            providesTags: ['User'],
        }),
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useGetAllUsersQuery,
} = userApi;
