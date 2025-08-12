export interface RealEstate {
    id : string,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    price: number,
    listingType: number,
    state: number,
    createdAt: Date,
    updatedAt: Date,
    realEstateTypeId: string,
}

export interface CreateRealEstateRequest {
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    price: number,
    listingType: number,
    state: number,
    createdAt: Date,
    updatedAt: Date,
    realEstateTypeId: string,
}

export interface UpdateEstateRequest{
    id : string,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    price: number,
    listingType: number,
    state: number,
    createdAt: Date,
    updatedAt: Date,
    realEstateTypeId: string,
}


export interface GetAllRealEstates {
    data: RealEstate[],
    total: number
}

export interface GetAllRealEstatesPreviewResponse {
    primaryImageUrl: string,
    realEstateTypeName: string,
    realEstateTitle: string,
    realEstateStartDate: string,
    realEstateEndDate: string,
    price: number,
    cityName: string,
    districtName: string,
    realEstateState: number,

}

export interface GetAllRealEstatesPreviewRequest {
    realEstateTypeName?: string | null,
    realEstatelistingType?: string | null,
    realEstatestate?: number | null,
    realEstateStartDate?: string | null,
    realEstateEndDate?: string | null,
    minPrice?: number | null,
    maxPrice?: number | null,
    cityName?: string | null,
    districtName?: string | null,


}

export interface GetRealEstateById {
    id : string,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    price: number,
    listingType: number,
    state: number,
    createdAt: Date,
    updatedAt: Date,
    realEstateTypeId: string,
}