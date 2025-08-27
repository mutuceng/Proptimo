import { Box, Button, MenuItem, TextField, Typography, Paper, Alert, CircularProgress } from "@mui/material";
import { useState, type ChangeEvent, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetRealEstateDetailQuery, useUpdateRealEstateCompleteMutation } from "../../../features/api/realEstateApi";
import { useGetAllRealEstateTypesQuery } from "../../../features/api/realEstateTypeApi";
import type { RealEstateType } from "../../../features/api/types/realEstateType";
import type { UpdateRealEstateCompleteRequest, UpdateRealEstateImageCommand, UpdateRealEstateTypeFeatureValueCommand } from "../../../features/api/types/realEstate";
import UpdateAddressForm from "../../../components/admin/realEstate/update/UpdateAddressForm";
import UpdateFeaturesForm from "../../../components/admin/realEstate/update/UpdateFeaturesForm";
import UpdateImagesForm from "../../../components/admin/realEstate/update/UpdateImagesForm";

const stateOptions = [
    { value: 0, label: "Yayında" },
    { value: 1, label: "Kiralandı" },
    { value: 2, label: "Satıldı" },
    { value: 3, label: "Süresi Dolmuş" },
    { value: 4, label: "Gizli" }
];

const listingTypeOptions = [
    { value: 0, label: "Satılık" },
    { value: 1, label: "Kiralık" },
    { value: 2, label: "Günlük Kiralık" }
];

// Form data interfaces
interface RealEstateFormData {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    listingType: number;
    state: number;
    realEstateTypeId: string;
}

interface AddressFormData {
    cityName: string;
    districtName: string;
    neighborhoodName: string;
    street: string;
    buildingNo: string;
    doorNumber: string;
    latitude: number | "";
    longitude: number | "";
}

interface FeatureFormData {
    [featureId: string]: any;
}

interface ImageFile {
    id: string;
    file?: File;
    preview: string;
    order: number;
    isPrimary: boolean;
    isExisting: boolean;
    originalId?: string;
}

const UpdateRealEstatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: estateDetail, isLoading: isLoadingDetail, error: detailError } = useGetRealEstateDetailQuery(id || '');
    const { data: estateTypesData, isLoading: isLoadingTypes } = useGetAllRealEstateTypesQuery();

    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const [submitError, setSubmitError] = useState<string>('');

    const [realEstateData, setRealEstateData] = useState<RealEstateFormData>({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        price: 0,
        listingType: 0,
        state: 0,
        realEstateTypeId: "",
    });

    
    const [addressData, setAddressData] = useState<AddressFormData>({
        cityName: "",
        districtName: "",
        neighborhoodName: "",
        street: "",
        buildingNo: "",
        doorNumber: "",
        latitude: "",
        longitude: "",
    });
    const [featuresData, setFeaturesData] = useState<FeatureFormData>({});
    const [images, setImages] = useState<ImageFile[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

    const [isAddressModified, setIsAddressModified] = useState(false);
    const [isFeaturesModified, setIsFeaturesModified] = useState(false);
    const [isImagesModified, setIsImagesModified] = useState(false);

    const [updateRealEstateComplete, { isLoading: isUpdating }] = useUpdateRealEstateCompleteMutation();

    const realEstateTypes: RealEstateType[] = Array.isArray(estateTypesData) ? estateTypesData : [];

    // Initialize form data
    useEffect(() => {
        if (estateDetail) {
            const re = estateDetail.realEstate;
            setRealEstateData({
                title: re.title,
                description: re.description,
                startDate: new Date(re.startDate),
                endDate: new Date(re.endDate),
                price: re.price,
                listingType: re.listingType,
                state: re.state,
                realEstateTypeId: re.realEstateTypeId,
            });
            

            setAddressData({ ...estateDetail.address });

            const initialImages: ImageFile[] = estateDetail.images.map((img, index) => ({
                id: `existing-${index}-${Date.now()}`,
                // Önizleme için env base ile tam URL oluştur
                preview: img.imageUrl.startsWith('http') 
                    ? img.imageUrl 
                    : `${(import.meta.env.VITE_API_IMG_URL || "").replace(/\/$/, "")}${img.imageUrl.startsWith('/') ? '' : '/'}${img.imageUrl}`,
                order: img.order || index + 1,
                isPrimary: img.isPrimary,
                isExisting: true,
                originalId: img.id
            }));
            setImages(initialImages);
        }
    }, [estateDetail]);

    const handleRealEstateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue: any = value;

        if (name === "price" || name === "listingType" || name === "state") {
            const parsed = value === "" ? 0 : Number(value);
            newValue = Number.isNaN(parsed) ? 0 : parsed;
        } else if (name === "startDate" || name === "endDate") {
            newValue = new Date(value);
        }

        const updatedData = { ...realEstateData, [name]: newValue };
        setRealEstateData(updatedData);
    };

    const handleAddressChange = (data: AddressFormData, isModified: boolean) => {
        setAddressData(data);
        setIsAddressModified(isModified);
    };

    const handleFeaturesChange = (data: FeatureFormData, isModified: boolean) => {
        setFeaturesData(data);
        setIsFeaturesModified(isModified);
    };

    const handleImagesChange = (data: { images: ImageFile[], deletedImages: string[], newImages: File[], isModified: boolean }) => {
        setImages(data.images);
        setDeletedImageIds(data.deletedImages || []);
        setIsImagesModified(data.isModified);
    };

    const validateRealEstate = (): boolean => {
        const errors: {[key: string]: string} = {};
        if (!realEstateData.title.trim()) errors.title = "Emlak başlığı zorunludur";
        if (!realEstateData.description.trim()) errors.description = "Açıklama zorunludur";
        if (realEstateData.price <= 0) errors.price = "Fiyat 0'dan büyük olmalıdır";
        if (!realEstateData.realEstateTypeId) errors.realEstateTypeId = "Emlak tipi seçilmelidir";
        if (new Date(realEstateData.endDate) < new Date(realEstateData.startDate)) errors.endDate = "Bitiş tarihi başlangıç tarihinden önce olamaz";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!id) {
            setSubmitError('Emlak ID bulunamadı. Lütfen geçerli bir emlak seçin.');
            return;
        }
    
        if (!validateRealEstate()) return;
    
        try {
            setSubmitError('');
    
            const payload: UpdateRealEstateCompleteRequest = {
                realEstateId: id,
                
                updateEstateCommand: {
                    id: id,
                    title: realEstateData.title,
                    description: realEstateData.description,
                    startDate: realEstateData.startDate,
                    endDate: realEstateData.endDate,
                    price: realEstateData.price,
                    listingType: realEstateData.listingType,
                    state: realEstateData.state,
                    realEstateTypeId: realEstateData.realEstateTypeId,
                }
            };
    
            if (isAddressModified) {
                payload.updateAddressCommand = {
                    realEstateId: id,
                    id: estateDetail!.address.id,
                    cityName: addressData.cityName,
                    districtName: addressData.districtName,
                    neighborhoodName: addressData.neighborhoodName,
                    street: addressData.street,
                    buildingNo: addressData.buildingNo,
                    doorNumber: addressData.doorNumber,
                    latitude: Number(addressData.latitude),
                    longitude: Number(addressData.longitude),
                };
            }
    
            if (isFeaturesModified) {
                payload.updateRealEstateTypeFeatureValueCommand = Object.entries(featuresData).map(([featureId, value]) => {
                    const existingFeatureValue = estateDetail!.featureValues.find(fv => fv.realEstateTypeFeatureId === featureId);
                    const cmd: UpdateRealEstateTypeFeatureValueCommand = {
                        realEstateId: id,
                        realEstateTypeFeatureId: featureId,
                        valueInt: null,
                        valueDecimal: null,
                        valueBool: null,
                        valueString: null,
                        valueDate: null
                    };
    
                    if (existingFeatureValue) cmd.id = existingFeatureValue.id;
    
                    if (typeof value === 'number') {
                        if (Number.isInteger(value)) cmd.valueInt = value;
                        else cmd.valueDecimal = value;
                    } else if (typeof value === 'boolean') cmd.valueBool = value;
                    else if (typeof value === 'string') cmd.valueString = value;
                    else if (Array.isArray(value)) cmd.valueString = value.join(', ');
    
                    return cmd;
                });
            }
    
            if (isImagesModified) {
                const imageCommands: UpdateRealEstateImageCommand[] = [];
                const newImages: File[] = [];
    
                images.forEach((img, index) => {
                    if (img.isExisting) {
                        // Ensure imageUrl is relative (strip base if present)
                        const apiBase = (import.meta.env.VITE_API_IMG_URL || "").replace(/\/$/, "");
                        const previewUrl = typeof img.preview === 'string' ? img.preview : '';
                        const relativeUrl = previewUrl.startsWith('http')
                            ? previewUrl.replace(apiBase, '')
                            : previewUrl;
                        imageCommands.push({
                            realEstateId: id,
                            id: img.originalId, // backend görsel id'si
                            imageUrl: relativeUrl,
                            isPrimary: img.isPrimary,
                            order: index + 1,
                        });
                    } else if (img.file) {
                        newImages.push(img.file);
                        imageCommands.push({
                            realEstateId: id,
                            isPrimary: img.isPrimary,
                            order: index + 1,
                        });
                    }
                });
    
                payload.updateRealEstatePhotosDto = {
                    commands: imageCommands,
                    deletedImageIds: deletedImageIds,
                    imageFiles: newImages,
                };
            }
    
            console.log('Payload before sending:', payload);
    
            const formData = new FormData();
            formData.append("JsonData", JSON.stringify(payload));
            payload.updateRealEstatePhotosDto?.imageFiles.forEach(file => formData.append("Images", file));
    

            await updateRealEstateComplete(payload).unwrap();

            navigate('/admin/real-estates', { 
                state: { message: 'Emlak başarıyla güncellendi!' } 
            });
        } catch (error: any) {
            console.error('Update error:', error);
            setSubmitError(error?.data?.message || 'Emlak güncellenirken bir hata oluştu.');
        }
    };
    



    if (isLoadingDetail || isLoadingTypes) return (
        <Box sx={{ width: "100%", minHeight: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center', background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)" }}>
            <CircularProgress />
        </Box>
    );

    if (detailError) return (
        <Box sx={{ width: "100%", minHeight: "100vh", p:3, background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)" }}>
            <Alert severity="error">Emlak detayları yüklenirken bir hata oluştu.</Alert>
        </Box>
    );

    if (!estateDetail) return (
        <Box sx={{ width: "100%", minHeight: "100vh", p:3, background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)" }}>
            <Alert severity="warning">Emlak bulunamadı.</Alert>
        </Box>
    );

    return (
        <Box sx={{ width: "100%", minHeight: "100vh", p:3, background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)" }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Typography variant="h4" sx={{ color: "#1976D2", fontWeight: 700, mb: 4 }}>Emlak Düzenle</Typography>

                {submitError && <Alert severity="error" sx={{ mb:3 }} onClose={() => setSubmitError('')}>{submitError}</Alert>}

                <Paper elevation={3} sx={{ p:3, borderRadius:4, mb:3 }}>
                    <Typography variant="h6" sx={{ color:"#1976D2", fontWeight:700, mb:3 }}>Emlak Bilgileri</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs:"1fr", md:"repeat(2, 1fr)" }, gap:2 }}>
                        <TextField name="title" label="Emlak Başlığı" value={realEstateData.title} onChange={handleRealEstateChange} fullWidth required size="small" error={!!formErrors.title} helperText={formErrors.title} sx={{ '& .MuiOutlinedInput-root': { borderRadius:3 } }} />
                        <TextField name="description" label="Açıklama" value={realEstateData.description} onChange={handleRealEstateChange} fullWidth required multiline rows={6} size="small" error={!!formErrors.description} helperText={formErrors.description} sx={{ '& .MuiOutlinedInput-root': { borderRadius:3 }, gridColumn:'1 / -1' }} />
                        <TextField name="price" label="Fiyat" type="number" value={realEstateData.price} onChange={handleRealEstateChange} fullWidth required size="small" error={!!formErrors.price} helperText={formErrors.price} sx={{ '& .MuiOutlinedInput-root': { borderRadius:3 } }} InputProps={{ inputProps: { min:0 } }} />
                        <TextField name="startDate" label="Başlangıç Tarihi" type="date" value={realEstateData.startDate instanceof Date ? realEstateData.startDate.toISOString().split('T')[0] : realEstateData.startDate} onChange={handleRealEstateChange} InputLabelProps={{ shrink:true }} fullWidth required size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius:3 } }} />
                        <TextField name="endDate" label="Bitiş Tarihi" type="date" value={realEstateData.endDate instanceof Date ? realEstateData.endDate.toISOString().split('T')[0] : realEstateData.endDate} onChange={handleRealEstateChange} InputLabelProps={{ shrink:true }} fullWidth required size="small" error={!!formErrors.endDate} helperText={formErrors.endDate} sx={{ '& .MuiOutlinedInput-root': { borderRadius:3 } }} />
                        <TextField name="listingType" label="Listeleme Türü" select value={realEstateData.listingType} onChange={handleRealEstateChange} fullWidth required size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius:3 } }} InputLabelProps={{ shrink:true }}>
                            {listingTypeOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                        </TextField>
                        <TextField name="state" label="Durum" select value={realEstateData.state} onChange={handleRealEstateChange} fullWidth required size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius:3 } }} InputLabelProps={{ shrink:true }}>
                            {stateOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                        </TextField>
                        <TextField name="realEstateTypeId" label="Emlak Tipi" select value={realEstateData.realEstateTypeId || ""} onChange={(e)=>setRealEstateData(prev => ({...prev, realEstateTypeId: e.target.value}))} fullWidth required size="small" error={!!formErrors.realEstateTypeId} helperText={formErrors.realEstateTypeId} sx={{ '& .MuiOutlinedInput-root': { borderRadius:3 } }} SelectProps={{ displayEmpty:true, renderValue: (value) => value ? realEstateTypes.find(t => String(t.id) === String(value))?.name || 'Seçiniz' : 'Seçiniz' }} disabled={isLoadingTypes} InputLabelProps={{ shrink:true }}>
                            <MenuItem value="">{isLoadingTypes ? 'Yükleniyor...' : 'Seçiniz'}</MenuItem>
                            {realEstateTypes.map(t => <MenuItem key={t.id} value={String(t.id)}>{t.name}</MenuItem>)}
                        </TextField>
                    </Box>
                </Paper>

                <UpdateAddressForm initialData={estateDetail.address} onChange={handleAddressChange} errors={formErrors} />
                <Box sx={{ mt:3 }}><UpdateFeaturesForm estateTypeId={realEstateData.realEstateTypeId} initialFeatureValues={estateDetail.featureValues} initialFeatures={estateDetail.features} onChange={handleFeaturesChange} errors={formErrors} /></Box>
                <Box sx={{ mt:3 }}><UpdateImagesForm initialImages={estateDetail.images} onChange={handleImagesChange} error={formErrors.images} /></Box>

                <Box sx={{ display:"flex", justifyContent:"center", mt:4 }}>
                    <Button variant="contained" onClick={handleSubmit} disabled={isUpdating} sx={{ px:4, py:1.5, borderRadius:3, textTransform:"none", fontWeight:600, fontSize:"1.1rem", boxShadow:"0 6px 20px rgba(25,118,210,0.25)", background: isUpdating ? "#ccc" : "linear-gradient(90deg, #1976D2 0%, #1E88E5 100%)", '&:hover': { background: isUpdating ? "#ccc" : "linear-gradient(90deg, #1565C0 0%, #1976D2 100%)" } }}>
                        {isUpdating ? "Güncelleniyor..." : "Emlak Güncelle"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UpdateRealEstatePage;
