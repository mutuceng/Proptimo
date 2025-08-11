export interface City {
    id: string,
    name: string
}

export interface District {
    id: string,
    name: string,
    cityId: string
}

export interface Neighborhood {
    id: string,
    name: string
    districtId: string
}

export interface GetAllCitiesRequest{
    data: City[],
    total: number
}

export interface GetAllDistrictsByCityIdRequest {
    data: District[],
    total: number
}

export interface GetAllDistrictsByDistrictRequest {
    data: Neighborhood[],
    total: number
}
