import { Box, MenuItem, TextField, Typography, Paper, IconButton } from "@mui/material";
import { useEffect, useState, useCallback, useRef, type ChangeEvent } from "react";
import { useGetAllCitiesQuery, useGetAllDistrictsByCityIdQuery, useGetAllNeighborhoodsByDistrictIdQuery } from "../../../../features/api/locationDataApi";
import type { City, District, Neighborhood } from "../../../../features/api/types/locationData";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

// Map click handler component
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click: (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

interface UpdateAddressFormProps {
    initialData: AddressFormData;
    onChange: (data: AddressFormData, isModified: boolean) => void;
    errors?: { [key: string]: string };
}

const UpdateAddressForm = ({ initialData, onChange, errors = {} }: UpdateAddressFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<AddressFormData>(initialData);
    const [originalData, setOriginalData] = useState<AddressFormData>(initialData);
    const [isModified, setIsModified] = useState(false);
    
    // Initialization flag to prevent infinite loops
    const hasInitialized = useRef(false);
    const lastInitialDataRef = useRef<string>("");

    // Update form data when initialData changes (only once per change)
    useEffect(() => {
        const currentInitialDataString = JSON.stringify(initialData);
        
        // Only update if initialData has actual data and it's different from last time
        if (initialData.cityName && 
            currentInitialDataString !== lastInitialDataRef.current) {
            
            setFormData(initialData);
            setOriginalData(initialData);
            hasInitialized.current = true;
            lastInitialDataRef.current = currentInitialDataString;
        }
    }, [initialData.cityName, initialData.districtName, initialData.neighborhoodName]); // Specific dependencies

    // API calls
    const { data: citiesData, isLoading: isCitiesLoading } = useGetAllCitiesQuery();
    
    const cities: City[] = Array.isArray(citiesData) ? citiesData : [];
    
    // Find city by name to get cityId for district query
    const selectedCity = cities.find(city => city.name === formData.cityName);
    
    const { data: districtsData, isLoading: isDistrictsLoading } = useGetAllDistrictsByCityIdQuery(selectedCity?.id || "", {
        skip: !selectedCity?.id
    });
    
    const districts: District[] = Array.isArray(districtsData) ? districtsData : [];
    
    // Find district by name to get districtId for neighborhood query
    const selectedDistrict = districts.find(district => district.name === formData.districtName);
    
    const { data: neighborhoodsData, isLoading: isNeighborhoodsLoading } = useGetAllNeighborhoodsByDistrictIdQuery(selectedDistrict?.id || "", {
        skip: !selectedDistrict?.id
    });

    const neighborhoods: Neighborhood[] = Array.isArray(neighborhoodsData) ? neighborhoodsData : [];

    // Map center state
    const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597]); // Ankara default
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

    // Update map center when coordinates change
    useEffect(() => {
        if (formData.latitude && formData.longitude) {
            const lat = Number(formData.latitude);
            const lng = Number(formData.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setMapCenter([lat, lng]);
                setSelectedLocation([lat, lng]);
            }
        }
    }, [formData.latitude, formData.longitude]);

    // Memoized onChange callback to prevent infinite re-renders
    const stableOnChange = useCallback((data: AddressFormData, modified: boolean) => {
        onChange(data, modified);
    }, [onChange]);

    // Check if data is modified and ALWAYS propagate latest formData upstream
    useEffect(() => {
        if (!hasInitialized.current) return;
        const modified = JSON.stringify(formData) !== JSON.stringify(originalData);
        if (modified !== isModified) {
            setIsModified(modified);
        }
        // Always send latest data upwards so parent holds freshest values
        stableOnChange(formData, modified);
    }, [formData, originalData, isModified, stableOnChange]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!isEditing) return; // Only allow changes when editing
        
        const { name, value } = e.target;
        
        if (name === "latitude" || name === "longitude") {
            const parsed = value === "" ? "" : Number(value);
            setFormData(prev => ({ 
                ...prev, 
                [name]: Number.isNaN(parsed) ? "" : parsed 
            }));
            return;
        }
        
        // Handle cascading resets for location fields
        if (name === "cityName" && value !== formData.cityName) {
            setFormData(prev => ({ 
                ...prev, 
                [name]: value,
                districtName: "",
                neighborhoodName: ""
            }));
        } else if (name === "districtName" && value !== formData.districtName) {
            setFormData(prev => ({ 
                ...prev, 
                [name]: value,
                neighborhoodName: ""
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMapClick = useCallback((lat: number, lng: number) => {
        if (!isEditing) return;
        
        setSelectedLocation([lat, lng]);
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    }, [isEditing]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        setOriginalData(formData);
        setIsModified(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(originalData);
        setIsModified(false);
    };

    // Don't render until we have initial data
    if (!hasInitialized.current && !initialData.cityName) {
        return (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography>Adres bilgileri yükleniyor...</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700 }}>
                    Adres Bilgileri
                </Typography>
                {!isEditing ? (
                    <IconButton 
                        onClick={handleEdit}
                        sx={{ 
                            color: "#1976D2",
                            '&:hover': { backgroundColor: '#E3F2FD' }
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                            onClick={handleSave}
                            disabled={!isModified}
                            sx={{ 
                                color: isModified ? "#4CAF50" : "#ccc",
                                '&:hover': { backgroundColor: isModified ? '#E8F5E8' : 'transparent' }
                            }}
                        >
                            <SaveIcon />
                        </IconButton>
                        <IconButton 
                            onClick={handleCancel}
                            sx={{ 
                                color: "#f44336",
                                '&:hover': { backgroundColor: '#FFEBEE' }
                            }}
                        >
                            <CancelIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {/* Location Selects Row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                    <TextField
                        name="cityName"
                        label="Şehir"
                        select
                        value={formData.cityName || ""} // Use formData instead of initialData
                        onChange={handleChange}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.cityName}
                        helperText={errors.cityName}
                        disabled={!isEditing}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (value) => {
                                if (!value) return 'Şehir Seçiniz';
                                return value as string;
                            },
                        }}
                        InputLabelProps={{ shrink: true }}
                    >
                        <MenuItem value="">
                            {isCitiesLoading ? 'Yükleniyor...' : 'Şehir Seçiniz'}
                        </MenuItem>
                        {cities.map((city) => (
                            <MenuItem key={city.id} value={city.name}>
                                {city.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                    <TextField
                        name="districtName"
                        label="İlçe"
                        select
                        value={formData.districtName || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.districtName}
                        helperText={errors.districtName}
                        disabled={!isEditing || !formData.cityName}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (value) => {
                                if (!value) return 'İlçe Seçiniz';
                                // Eğer value varsa ama districts array'inde yoksa, value'yu göster
                                const districtExists = districts.some(d => d.name === value);
                                return districtExists ? value as string : `${value as string} (Yükleniyor...)`;
                            },
                        }}
                        InputLabelProps={{ shrink: true }}
                    >
                        <MenuItem value="">
                            {!formData.cityName ? 'Önce şehir seçiniz' : isDistrictsLoading ? 'Yükleniyor...' : 'İlçe Seçiniz'}
                        </MenuItem>
                        {districts.map((district) => (
                            <MenuItem key={district.id} value={district.name}>
                                {district.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                    <TextField
                        name="neighborhoodName"
                        label="Mahalle"
                        select
                        value={formData.neighborhoodName || ""} // Use formData
                        onChange={handleChange}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.neighborhoodName}
                        helperText={errors.neighborhoodName}
                        disabled={!isEditing || !formData.districtName}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (value) => {
                                if (!value) return 'Mahalle Seçiniz';
                                // Eğer value varsa ama neighborhoods array'inde yoksa, value'yu göster
                                const neighborhoodExists = neighborhoods.some(n => n.name === value);
                                return neighborhoodExists ? value as string : `${value as string} (Yükleniyor...)`;
                            },
                        }}
                        InputLabelProps={{ shrink: true }}
                    >
                        <MenuItem value="">
                            {!formData.districtName ? 'Önce ilçe seçiniz' : isNeighborhoodsLoading ? 'Yükleniyor...' : 'Mahalle Seçiniz'}
                        </MenuItem>
                        {neighborhoods.map((neighborhood) => (
                            <MenuItem key={neighborhood.id} value={neighborhood.name}>
                                {neighborhood.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            {/* Map Section */}
            {isEditing && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: "#1976D2", fontWeight: 600 }}>
                        Haritadan Konum Seçin
                    </Typography>
                    <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', border: '2px solid #E3F2FD' }}>
                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            key={`${mapCenter[0]}-${mapCenter[1]}`} // Force re-render when center changes
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
            )}

            {/* Address Details Form */}
            <Box
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
                    error={!!errors.street}
                    helperText={errors.street}
                    disabled={!isEditing}
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
                    error={!!errors.buildingNo}
                    helperText={errors.buildingNo}
                    disabled={!isEditing}
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
                    error={!!errors.doorNumber}
                    helperText={errors.doorNumber}
                    disabled={!isEditing}
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
                    error={!!errors.latitude}
                    helperText={errors.latitude}
                    disabled={!isEditing}
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
                    error={!!errors.longitude}
                    helperText={errors.longitude}
                    disabled={!isEditing}
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
        </Paper>
    );
};

export default UpdateAddressForm;