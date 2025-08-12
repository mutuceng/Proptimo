export interface RealEstateAddress {
 id: string,
 cityName: string,
 districtName: string,
 neighborhoodName: string,
 street: string,
 buildingNo: string,
 doorNumber: string,
 latitude: number,
 longitude: number,
 realEstateId: string
}

export interface CreateRealEstateAddress {
    cityName: string,
    districtName: string,
    neighborhoodName: string,
    street: string,
    buildingNo: string,
    doorNumber: string,
    latitude: number,
    longitude: number,
    realEstateId: string
}

export interface GetAddressByEstateId {
    id: string,
    cityName: string,
    districtName: string,
    neighborhoodName: string,
    street: string,
    buildingNo: string,
    doorNumber: string,
    latitude: number,
    longitude: number,
    realEstateId: string
}



export interface UpdateRealEstateAddress {
    id: string,
    cityName: string,
    districtName: string,
    neighborhood: string,
    street: string,
    buildingNo: string,
    doorNumber: string,
    latitude: number,
    longitude: number,
    realEstateId: string
}