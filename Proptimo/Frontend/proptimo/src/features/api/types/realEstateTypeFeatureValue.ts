export interface RealEstateTypeFeatureValue {
    id: string;
    valueInt?: number;
    valueDecimal?: number;
    valueBool?: boolean;
    valueString?: string;
    valueDate?: string;
    realEstateId: string;
    realEstateTypeFeatureId: string;
}

export interface CreateRealEstateTypeFeatureValueRequest {
    commands: RealEstateTypeFeatureValue[];
}

export interface UpdateRealEstateTypeFeatureValueRequest {
    id: string;
    valueInt?: number;
    valueDecimal?: number;
    valueBool?: boolean;
    valueString?: string;
    valueDate?: string;
    realEstateId: string;
    realEstateTypeFeatureId: string;
}

export interface GetRealEstateTypeFeatureValuesByRealEstateIdResponse {
    data: RealEstateTypeFeatureValue[];
    total: number;
}

