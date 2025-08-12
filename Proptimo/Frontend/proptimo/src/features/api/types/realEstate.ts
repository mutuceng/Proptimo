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