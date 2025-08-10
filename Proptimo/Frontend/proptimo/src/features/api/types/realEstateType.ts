export interface RealEstateType {
    id: string;
    name: string;
}

export interface CreateRealEstateTypeRequest {
    name: string;
}

export interface UpdateRealEstateTypeRequest {
    id: string;
    name: string;
}

export interface GetAllRealEstateTypesResponse {
    data: RealEstateType[];    
    total: number;
}

export interface GetByIdRealEstateTypeResponse {
    id: string;
    name: string;
}