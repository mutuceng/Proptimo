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

export interface GetAllCitiesResponse{
    data: City[],
    total: number
}

export interface GetAllDistrictsByCityIdResponse {
    data: District[],
    total: number
}

export interface GetAllNeighborhoodsByDistrictResponse {
    data: Neighborhood[],
    total: number
}
