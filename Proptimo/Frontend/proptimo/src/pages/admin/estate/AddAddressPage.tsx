import { Box, Button, MenuItem, Paper, TextField, Typography, Grid } from "@mui/material";
import { ProgressSteps } from "../../../components/admin/realEstate/ProgressSteps";
import { useEffect, useState, type ChangeEvent } from "react";
import { useGetAllCitiesQuery, useGetAllDistrictsByCityIdQuery, useGetAllNeighborhoodsByDistrictIdQuery } from "../../../features/api/locationDataApi";
import type { City, District, Neighborhood } from "../../../features/api/types/locationData";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate, useParams } from "react-router-dom";
import { useCreateRealEstateAddressMutation } from "../../../features/api/realEstateAddressApi";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const steps = [
    "Emlak Bilgileri",
    "Özellik Bilgileri",
    "Adres Bilgileri",
    "Görseller"
];

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

// Map click handler component
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click: (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const AddAddressPage = () => {
    const { estateId } = useParams<{ estateId: string }>();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(2); // Adres bilgileri adımı
    const [formData, setFormData] = useState<AddressFormData>({
        cityId: "",
        districtId: "",
        neighborhoodId: "",
        street: "",
        buildingNo: "",
        doorNumber: "",
        latitude: "",
        longitude: "",
    });

    // API calls
    const { data: citiesData, isLoading: isCitiesLoading, error: citiesError } = useGetAllCitiesQuery();
    const { data: districtsData, isLoading: isDistrictsLoading } = useGetAllDistrictsByCityIdQuery(formData.cityId, {
        skip: !formData.cityId
    });
    const { data: neighborhoodsData, isLoading: isNeighborhoodsLoading } = useGetAllNeighborhoodsByDistrictIdQuery(formData.districtId, {
        skip: !formData.districtId
    });

    const cities: City[] = Array.isArray(citiesData) ? citiesData : [];
    const districts: District[] = Array.isArray(districtsData) ? districtsData : [];
    const neighborhoods: Neighborhood[] = Array.isArray(neighborhoodsData) ? neighborhoodsData : [];

    // Map center state
    const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597]); // Ankara default
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

    const [createRealEstateAddress, {isLoading: isCreating}] = useCreateRealEstateAddressMutation();
    // Reset dependent fields when parent selection changes
    useEffect(() => {
        if (formData.cityId) {
            setFormData(prev => ({ ...prev, districtId: "", neighborhoodId: "" }));
        }
    }, [formData.cityId]);

    useEffect(() => {
        if (formData.districtId) {
            setFormData(prev => ({ ...prev, neighborhoodId: "" }));
        }
    }, [formData.districtId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "latitude" || name === "longitude") {
            const parsed = value === "" ? "" : Number(value);
            setFormData((prev) => ({ ...prev, [name]: Number.isNaN(parsed) ? "" : parsed }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedLocation([lat, lng]);
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const isValid = (() => {
        const hasCity = formData.cityId.trim().length > 0;
        const hasDistrict = formData.districtId.trim().length > 0;
        const hasNeighborhood = formData.neighborhoodId.trim().length > 0;
        const hasStreet = formData.street.trim().length > 0;
        const hasBuildingNo = formData.buildingNo.trim().length > 0;
        const hasDoorNumber = formData.doorNumber.trim().length > 0;
        const hasLatitude = typeof formData.latitude === "number";
        const hasLongitude = typeof formData.longitude === "number";
        
        return hasCity && hasDistrict && hasNeighborhood && hasStreet && hasBuildingNo && hasDoorNumber && hasLatitude && hasLongitude;
    })();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!isValid) {
            console.log("Form is not valid");
            return;
        }

        try{
            const payload = {
                cityName: cities.find(c => c.id === formData.cityId)?.name || '',
                districtName: districts.find(d => d.id === formData.districtId)?.name || '',
                neighborhoodName: neighborhoods.find(n => n.id === formData.neighborhoodId)?.name || '',
                street: formData.street,
                buildingNo: formData.buildingNo,
                doorNumber: formData.doorNumber,
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
                realEstateId: estateId || ''
            }

            const response = await createRealEstateAddress(payload).unwrap();

            setFormData({
                cityId: "",
                districtId: "",
                neighborhoodId: "",
                street: "",
                buildingNo: "",
                doorNumber: "",
                latitude: "",
                longitude: "",
            })

            try {
                await navigate(`/admin/real-estates/create/images/${response.realEstateId}`);
            } catch (navError) {
                console.error("Navigation error:", navError);
                navigate("/admin/real-estates");
            }
        } catch (error) {
            console.error("Error creating real estate address:", error);
        }

        setActiveStep((prev) => prev + 1);
    }


    return (
        <Box sx={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)", borderRadius: 3, display: 'flex', justifyContent: 'center', overflowX: 'hidden', overflowY: 'hidden' }}>
            <Box sx={{ width: '100%', maxWidth: 1040 }}>
                <ProgressSteps steps={steps} activeStep={activeStep} />

                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(25, 118, 210, 0.12)",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 3,
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700 }}>
                            Adres Bilgileri
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6B7280" }}>
                            Lütfen zorunlu alanları doldurun
                        </Typography>
                    </Box>

                    {/* Location Selects Row */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                            <TextField
                                name="cityId"
                                label="Şehir"
                                select
                                value={formData.cityId}
                                onChange={handleChange}
                                fullWidth
                                required
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                SelectProps={{
                                    displayEmpty: true,
                                    renderValue: (value) => {
                                        if (!value) return 'Şehir Seçiniz';
                                        const found = cities.find((c) => c.id === value);
                                        return found?.name ?? 'Şehir Seçiniz';
                                    },
                                }}
                                disabled={isCitiesLoading}
                                InputLabelProps={{ shrink: true }}
                            >
                                <MenuItem value="">
                                    {isCitiesLoading ? 'Yükleniyor...' : 'Şehir Seçiniz'}
                                </MenuItem>
                                {cities.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                            <TextField
                                name="districtId"
                                label="İlçe"
                                select
                                value={formData.districtId}
                                onChange={handleChange}
                                fullWidth
                                required
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                SelectProps={{
                                    displayEmpty: true,
                                    renderValue: (value) => {
                                        if (!value) return 'İlçe Seçiniz';
                                        const found = districts.find((d) => d.id === value);
                                        return found?.name ?? 'İlçe Seçiniz';
                                    },
                                }}
                                disabled={!formData.cityId || isDistrictsLoading}
                                InputLabelProps={{ shrink: true }}
                            >
                                <MenuItem value="">
                                    {!formData.cityId ? 'Önce şehir seçiniz' : isDistrictsLoading ? 'Yükleniyor...' : 'İlçe Seçiniz'}
                                </MenuItem>
                                {districts.map((district) => (
                                    <MenuItem key={district.id} value={district.id}>
                                        {district.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                            <TextField
                                name="neighborhoodId"
                                label="Mahalle"
                                select
                                value={formData.neighborhoodId}
                                onChange={handleChange}
                                fullWidth
                                required
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                SelectProps={{
                                    displayEmpty: true,
                                    renderValue: (value) => {
                                        if (!value) return 'Mahalle Seçiniz';
                                        const found = neighborhoods.find((n) => n.id === value);
                                        return found?.name ?? 'Mahalle Seçiniz';
                                    },
                                }}
                                disabled={!formData.districtId || isNeighborhoodsLoading}
                                InputLabelProps={{ shrink: true }}
                            >
                                <MenuItem value="">
                                    {!formData.districtId ? 'Önce ilçe seçiniz' : isNeighborhoodsLoading ? 'Yükleniyor...' : 'Mahalle Seçiniz'}
                                </MenuItem>
                                {neighborhoods.map((neighborhood) => (
                                    <MenuItem key={neighborhood.id} value={neighborhood.id}>
                                        {neighborhood.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>

                    {/* Map Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, color: "#1976D2", fontWeight: 600 }}>
                            Haritadan Konum Seçin
                        </Typography>
                        <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', border: '2px solid #E3F2FD' }}>
                            <MapContainer
                                center={mapCenter}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <MapClickHandler onMapClick={handleMapClick} />
                                {selectedLocation && (
                                    <Marker position={selectedLocation} />
                                )}
                            </MapContainer>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: "#6B7280", fontStyle: 'italic' }}>
                            Haritaya tıklayarak konum seçin. Seçilen konum koordinatları otomatik olarak doldurulacaktır.
                        </Typography>
                    </Box>

                    {/* Address Details Form */}
                    <Box
                        component="form"
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                            gap: 2,
                        }}
                    >
                        <TextField
                            name="street"
                            label="Sokak/Cadde"
                            value={formData.street}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            name="buildingNo"
                            label="Bina No"
                            value={formData.buildingNo}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            name="doorNumber"
                            label="Kapı No"
                            value={formData.doorNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            name="latitude"
                            label="Enlem"
                            type="number"
                            value={formData.latitude}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            InputProps={{ 
                                inputProps: { 
                                    step: "any",
                                    min: -90,
                                    max: 90
                                } 
                            }}
                        />

                        <TextField
                            name="longitude"
                            label="Boylam"
                            type="number"
                            value={formData.longitude}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            InputProps={{ 
                                inputProps: { 
                                    step: "any",
                                    min: -180,
                                    max: 180
                                } 
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 4,
                        }}
                    >

                        <Button
                            variant="contained"
                            disabled={!isValid}
                            sx={{
                                px: 2.25,
                                py: 0.75,
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 600,
                                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.25)",
                                background: isValid
                                    ? "linear-gradient(90deg, #1976D2 0%, #1E88E5 100%)"
                                    : "#90CAF9",
                                '&:hover': {
                                    background: "linear-gradient(90deg, #1565C0 0%, #1976D2 100%)",
                                },
                            }}
                            onClick={handleSubmit}
                        >
                            İleri
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default AddAddressPage;