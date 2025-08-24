import { Box, Button, MenuItem, Paper, TextField, Typography, Stepper, Step, StepLabel, Alert } from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { useGetAllRealEstateTypesQuery } from "../../../features/api/realEstateTypeApi";
import type { RealEstateType } from "../../../features/api/types/realEstateType";
import { useNavigate } from "react-router-dom";
import { useCreateRealEstateCompleteMutation } from "../../../features/api/realEstateApi";
import AddressForm from "../../../components/admin/realEstate/AddressForm";
import FeaturesForm from "../../../components/admin/realEstate/FeaturesForm";
import ImagesForm from "../../../components/admin/realEstate/ImagesForm";
import { useGetAllCitiesQuery, useGetAllDistrictsByCityIdQuery, useGetAllNeighborhoodsByDistrictIdQuery } from "../../../features/api/locationDataApi";
import type { City, District, Neighborhood } from "../../../features/api/types/locationData";

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

const steps = [
    "Emlak Bilgileri",
    "Adres Bilgileri", 
    "Özellik Bilgileri",
    "Görseller"
];

// Form data interfaces
interface RealEstateFormData {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    listingType: number | 0;
    state: number | 0;
    realEstateTypeId: string;
}

interface AddressFormData {
    cityId: string;
    districtId: string;
    neighborhoodId: string;
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
    file: File;
    preview: string;
    order: number;
    isPrimary: boolean;
}

const AddRealEstatePage = () => {
    const { data, isLoading, error } = useGetAllRealEstateTypesQuery();
    const { data: citiesData } = useGetAllCitiesQuery();
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const [submitError, setSubmitError] = useState<string>('');

    // Form data states
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
        cityId: "",
        districtId: "",
        neighborhoodId: "",
        street: "",
        buildingNo: "",
        doorNumber: "",
        latitude: "",
        longitude: "",
    });

    // Location data queries - addressData tanımlandıktan sonra
    const { data: districtsData } = useGetAllDistrictsByCityIdQuery(addressData.cityId, { skip: !addressData.cityId });
    const { data: neighborhoodsData } = useGetAllNeighborhoodsByDistrictIdQuery(addressData.districtId, { skip: !addressData.districtId });

    const [featuresData, setFeaturesData] = useState<FeatureFormData>({});
    const [images, setImages] = useState<ImageFile[]>([]);

    const [createRealEstateComplete, { isLoading: isCreating }] = useCreateRealEstateCompleteMutation();

    const realEstateTypes: RealEstateType[] = Array.isArray(data) ? data : [];
    const cities: City[] = Array.isArray(citiesData) ? citiesData : [];

    const handleRealEstateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "price") {
            const parsed = value === "" ? 0 : Number(value);
            setRealEstateData((prev) => ({ ...prev, price: Number.isNaN(parsed) ? 0 : parsed }));
            return;
        }
        if (name === "listingType" || name === "state") {
            const parsed = value === "" ? 0 : Number(value);
            setRealEstateData((prev) => ({ ...prev, [name]: Number.isNaN(parsed) ? 0 : parsed }));
            return;
        }
        setRealEstateData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (data: AddressFormData) => {
        setAddressData(data);
    };

    const handleFeaturesChange = (data: FeatureFormData) => {
        setFeaturesData(data);
    };

    const handleImagesChange = (data: ImageFile[]) => {
        setImages(data);
    };

    // Validation functions
    const validateRealEstate = (): boolean => {
        const errors: {[key: string]: string} = {};
        
        if (!realEstateData.title.trim()) {
            errors.title = "Emlak başlığı zorunludur";
        }
        if (!realEstateData.description.trim()) {
            errors.description = "Açıklama zorunludur";
        }
        if (realEstateData.price <= 0) {
            errors.price = "Fiyat 0'dan büyük olmalıdır";
        }
        if (!realEstateData.realEstateTypeId) {
            errors.realEstateTypeId = "Emlak tipi seçilmelidir";
        }
        if (new Date(realEstateData.endDate) < new Date(realEstateData.startDate)) {
            errors.endDate = "Bitiş tarihi başlangıç tarihinden önce olamaz";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateAddress = (): boolean => {
        const errors: {[key: string]: string} = {};
        
        if (!addressData.cityId) {
            errors.cityId = "Şehir seçilmelidir";
        }
        if (!addressData.districtId) {
            errors.districtId = "İlçe seçilmelidir";
        }
        if (!addressData.neighborhoodId) {
            errors.neighborhoodId = "Mahalle seçilmelidir";
        }
        if (!addressData.street.trim()) {
            errors.street = "Sokak/Cadde zorunludur";
        }
        if (!addressData.buildingNo.trim()) {
            errors.buildingNo = "Bina no zorunludur";
        }
        if (!addressData.doorNumber.trim()) {
            errors.doorNumber = "Kapı no zorunludur";
        }
        if (typeof addressData.latitude !== "number") {
            errors.latitude = "Enlem seçilmelidir";
        }
        if (typeof addressData.longitude !== "number") {
            errors.longitude = "Boylam seçilmelidir";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateFeatures = (): boolean => {
        // Features validation will be handled by the FeaturesForm component
        return true;
    };

    const validateImages = (): boolean => {
        if (images.length === 0) {
            setFormErrors({ images: "En az bir görsel yüklenmelidir" });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        let isValid = false;

        switch (activeStep) {
            case 0:
                isValid = validateRealEstate();
                break;
            case 1:
                isValid = validateAddress();
                break;
            case 2:
                isValid = validateFeatures();
                break;
            case 3:
                isValid = validateImages();
                break;
        }

        if (isValid) {
            setActiveStep((prev) => prev + 1);
            setFormErrors({});
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if (!validateImages()) return;

        try {
            setSubmitError('');

            // ID'lerden isimleri al
            const selectedCity = cities.find(city => city.id === addressData.cityId);
            const selectedDistrict = districtsData?.data?.find((district: District) => district.id === addressData.districtId);
            const selectedNeighborhood = neighborhoodsData?.data?.find((neighborhood: Neighborhood) => neighborhood.id === addressData.neighborhoodId);


            const payload = {
                createEstateCommand: {
                    title: realEstateData.title,
                    description: realEstateData.description,
                    startDate: new Date(realEstateData.startDate),
                    endDate: new Date(realEstateData.endDate),
                    price: realEstateData.price,
                    listingType: realEstateData.listingType,
                    state: realEstateData.state,
                    realEstateTypeId: realEstateData.realEstateTypeId,
                },
                createAddressCommand: {
                    cityName: selectedCity?.name || '',
                    districtName: selectedDistrict?.name || '',
                    neighborhoodName: selectedNeighborhood?.name || '',
                    street: addressData.street,
                    buildingNo: addressData.buildingNo,
                    doorNumber: addressData.doorNumber,
                    latitude: Number(addressData.latitude),
                    longitude: Number(addressData.longitude),
                },
                createRealEstateTypeFeatureValueCommand: Object.entries(featuresData).map(([featureId, value]) => {
                    // Veri tipine göre uygun field'ı ayarla
                    const payload: any = {
                        realEstateTypeFeatureId: featureId,
                        valueInt: null,
                        valueDecimal: null,
                        valueBool: null,
                        valueString: null,
                        valueDate: null
                    };

                    if (typeof value === 'number') {
                        if (Number.isInteger(value)) {
                            payload.valueInt = value;
                        } else {
                            payload.valueDecimal = value;
                        }
                    } else if (typeof value === 'boolean') {
                        payload.valueBool = value;
                    } else if (typeof value === 'string') {
                        payload.valueString = value;
                    } else if (Array.isArray(value)) {
                        payload.valueString = value.join(', ');
                    }

                    return payload;
                }),
                uploadRealEstatePhotosDto: {
                    commands: images.map((img, index) => ({
                        imageUrl: "https://placeholder.com/image.jpg", // Backend tarafında güncellenecek
                        isPrimary: img.isPrimary,
                        order: index + 1,
                    })),
                    imageFiles: images.map(img => img.file)
                }
            };


            await createRealEstateComplete(payload).unwrap();

            navigate('/admin/real-estates', { 
                state: { message: 'Emlak başarıyla oluşturuldu!' } 
            });

        } catch (error: any) {
            console.error('Create error:', error);
            setSubmitError(error?.data?.message || 'Emlak oluşturulurken bir hata oluştu.');
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700, mb: 3 }}>
                            Emlak Bilgileri
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                                gap: 2,
                            }}
                        >
                            <TextField
                                name="title"
                                label="Emlak Başlığı"
                                value={realEstateData.title}
                                onChange={handleRealEstateChange}
                                fullWidth
                                required
                                size="small"
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />

                            <TextField
                                name="description"
                                label="Açıklama"
                                value={realEstateData.description}
                                onChange={handleRealEstateChange}
                                fullWidth
                                required
                                multiline
                                rows={6}
                                size="small"
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { borderRadius: 3 },
                                    gridColumn: '1 / -1'
                                }}
                            />

                            <TextField
                                name="price"
                                label="Fiyat"
                                type="number"
                                value={realEstateData.price}
                                onChange={handleRealEstateChange}
                                fullWidth
                                required
                                size="small"
                                error={!!formErrors.price}
                                helperText={formErrors.price}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                InputProps={{ inputProps: { min: 0 } }}
                            />

                            <TextField
                                name="startDate"
                                label="Başlangıç Tarihi"
                                type="date"
                                value={realEstateData.startDate}
                                onChange={handleRealEstateChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />

                            <TextField
                                name="endDate"
                                label="Bitiş Tarihi"
                                type="date"
                                value={realEstateData.endDate}
                                onChange={handleRealEstateChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                                size="small"
                                error={!!formErrors.endDate}
                                helperText={formErrors.endDate}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />

                            <TextField
                                name="listingType"
                                label="Listeleme Türü"
                                select
                                value={realEstateData.listingType}
                                onChange={handleRealEstateChange}
                                fullWidth
                                required
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                InputLabelProps={{ shrink: true }}
                            >
                                {listingTypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                name="state"
                                label="Durum"
                                select
                                value={realEstateData.state}
                                onChange={handleRealEstateChange}
                                fullWidth
                                required
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                InputLabelProps={{ shrink: true }}
                            >
                                {stateOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                name="realEstateTypeId"
                                label="Emlak Tipi"
                                select
                                value={realEstateData.realEstateTypeId || ""}
                                onChange={(e) => {
                                    setRealEstateData((prev) => ({ ...prev, realEstateTypeId: e.target.value }));
                                }}
                                fullWidth
                                required
                                size="small"
                                error={!!formErrors.realEstateTypeId}
                                helperText={formErrors.realEstateTypeId}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                SelectProps={{
                                    displayEmpty: true,
                                    renderValue: (value) => {
                                        if (!value || value === "") return 'Seçiniz';
                                        
                                        const found = realEstateTypes.find((t) => String(t.id) === String(value));
                                        return found ? found.name : 'Seçiniz';
                                    },
                                }}
                                disabled={isLoading}
                                InputLabelProps={{ shrink: true }}
                            >
                                <MenuItem value="">
                                    {isLoading ? 'Yükleniyor...' : 'Seçiniz'}
                                </MenuItem>
                                {realEstateTypes.map((t) => (
                                    <MenuItem key={t.id} value={String(t.id)}>
                                        {t.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>
                );
            case 1:
                return (
                    <AddressForm 
                        formData={addressData}
                        onChange={handleAddressChange}
                        errors={formErrors}
                    />
                );
            case 2:
                return (
                    <FeaturesForm 
                        estateTypeId={realEstateData.realEstateTypeId}
                        formData={featuresData}
                        onChange={handleFeaturesChange}
                        errors={formErrors}
                    />
                );
            case 3:
                return (
                    <ImagesForm 
                        images={images}
                        onChange={handleImagesChange}
                        error={formErrors.images}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ 
            width: "100%", 
            minHeight: "100vh", 
            background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)",
            p: 3
        }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                {/* Stepper */}
                <Box sx={{ mb: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Submit Error */}
                {submitError && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError('')}>
                        {submitError}
                    </Alert>
                )}

                {/* Form Content */}
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(25, 118, 210, 0.12)",
                        overflow: "hidden",
                        mb: 3
                    }}
                >
                    {renderStepContent(activeStep)}
                </Paper>

                {/* Navigation Buttons */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button
                        variant="outlined"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        Geri
                    </Button>

                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isCreating}
                                sx={{
                                    px: 2.25,
                                    py: 0.75,
                                    borderRadius: 3,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    boxShadow: "0 6px 20px rgba(25, 118, 210, 0.25)",
                                    background: isCreating ? "#ccc" : "linear-gradient(90deg, #1976D2 0%, #1E88E5 100%)",
                                    '&:hover': {
                                        background: isCreating ? "#ccc" : "linear-gradient(90deg, #1565C0 0%, #1976D2 100%)",
                                    },
                                }}
                            >
                                {isCreating ? "Oluşturuluyor..." : "Emlak Oluştur"}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{
                                    px: 2.25,
                                    py: 0.75,
                                    borderRadius: 3,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    boxShadow: "0 6px 20px rgba(25, 118, 210, 0.25)",
                                    background: "linear-gradient(90deg, #1976D2 0%, #1E88E5 100%)",
                                    '&:hover': {
                                        background: "linear-gradient(90deg, #1565C0 0%, #1976D2 100%)",
                                    },
                                }}
                            >
                                İleri
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AddRealEstatePage;