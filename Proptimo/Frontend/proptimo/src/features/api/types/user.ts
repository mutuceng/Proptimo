export interface User {
    id: string;
    userName: string;
    name: string;
    surname: string;
    email: string;
    birthDate: Date;
    phoneNumber: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    userName: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    birthDate: Date;
    phoneNumber?: string;
}

export interface TokenResponseDto {
    accessToken: string;
    refreshToken: string;
    expiration: Date;
}

export interface LoginResponse {
    succeeded: boolean;
    token: TokenResponseDto;
}

export interface RefreshAccessTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    succeeded: boolean;
    token: TokenResponseDto;
}