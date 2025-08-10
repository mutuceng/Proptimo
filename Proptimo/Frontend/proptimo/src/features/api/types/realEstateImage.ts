export interface RealEstateImage {
    id : string,
    imageUrl : string,
    isPrimary : boolean,
    order : number,
    realEstateId : string
}

export interface CreateRealEstateImageRequest {
    imageUrl: string;     
    isPrimary: boolean;   
    order: number;        
    realEstateId: string; 
}

// UploadRealEstatePhotosDto karşılığı
export interface UploadRealEstateImagesRequest {
    commands: CreateRealEstateImageRequest[];
    imageFiles: File[]; 
}

export interface GetAllRealEstateImagesByEstateId {
    data : RealEstateImage[],
    total: number;
}