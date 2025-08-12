export const TypeFeatureDataType = {
    Int: 0,
    Decimal: 1,
    Bool: 2,
    String: 3,
    DateTime: 4
} as const;

export type TypeFeatureDataType = typeof TypeFeatureDataType[keyof typeof TypeFeatureDataType];

export interface RealEstateTypeFeature {
    id: string,
    name: string,
    dataType : TypeFeatureDataType,
    isUnit : boolean,
    isRequired: boolean,
    options: string[]
    realEstateTypeId: string
}

export interface CreateRealEstateTypeFeature{
    name: string,
    dataType : TypeFeatureDataType,
    isUnit : boolean,
    isRequired: boolean,
    options: string[]
    realEstateTypeId: string
}

export interface UpdateRealEstateTypeFeature {
    id: string,
    name: string,
    dataType : TypeFeatureDataType,
    isUnit : boolean,
    isRequired: boolean,
    options: string[]
    realEstateTypeId: string
}

export interface GetByIdRealEstateTypeFeature {
    id: string,
    name: string,
    dataType : TypeFeatureDataType,
    isUnit : boolean,
    isRequired: boolean,
    options: string[]
    realEstateTypeId: string
}

export interface GetAllEstateTypeFeaturesByTypeId{
    data: RealEstateTypeFeature[];
    total: number;
}



