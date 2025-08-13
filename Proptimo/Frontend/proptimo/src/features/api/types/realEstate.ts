import type { RealEstateAddress } from "./realEstateAddress";
import type { RealEstateImage } from "./realEstateImage";
import type { RealEstateTypeFeature } from "./realEstateTypeFeature";
import type { RealEstateTypeFeatureValue } from "./realEstateTypeFeatureValue";

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
    realEstateId: string,
    primaryImageUrl: string,
    realEstateTypeName: string,
    realEstateTitle: string,
    realEstateStartDate: string,
    realEstateEndDate: string,
    price: number,
    cityName: string,
    districtName: string,
    latitude: number,
    longitude: number,
    realEstateState: number,
    pageNumber: number,
    pageSize: number,
}

export interface GetAllRealEstatesPreviewResponseWithPaging {
    data: GetAllRealEstatesPreviewResponse[],
    totalCount: number,
    pageNumber: number,
    pageSize: number,
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
    pageNumber?: number | 1,

}

export interface GetRealEstateDetailResponse {
    realEstate: RealEstate,
    address: RealEstateAddress,
    features: RealEstateTypeFeature[],
    images: RealEstateImage[],
    featureValues: RealEstateTypeFeatureValue[],
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