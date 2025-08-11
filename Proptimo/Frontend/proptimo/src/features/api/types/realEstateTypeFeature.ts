export interface RealEstateTypeFeature {
    id: string,
    name: string,
    dataType : number,
    isUnit : boolean,
    isRequired: boolean,
    options: string[]
    realEstateTypeId: string
}

export interface CreateRealEstateTypeFeature{
    name: string,
    dataType : number,
    isUnit : boolean,
    isRequired: boolean,
    options: string[]
    realEstateTypeId: string
}

export interface UpdateRealEstateTypeFeature {
    id: string,
    name: string,
    dataType : number,
    isUnit : boolean,
    isRequired: boolean,
    options: string[]
    realEstateTypeId: string
}

export interface GetByIdRealEstateTypeFeature {
    id: string,
    name: string,
    dataType : number,
    isUnit : boolean,
    isRequired: boolean,
    options: string[]
    realEstateTypeId: string
}

export interface GetAllEstateTypeFeaturesByTypeId{
    data: RealEstateTypeFeature[];
    total: number;
}

