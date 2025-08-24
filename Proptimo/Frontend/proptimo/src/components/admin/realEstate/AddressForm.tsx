import { Box, Button, MenuItem, TextField, Typography, Grid } from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { useGetAllCitiesQuery, useGetAllDistrictsByCityIdQuery, useGetAllNeighborhoodsByDistrictIdQuery } from "../../../features/api/locationDataApi";
import type { City, District, Neighborhood } from "../../../features/api/types/locationData";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface AddressFormProps {
    formData: AddressFormData;
    onChange: (data: AddressFormData) => void;
    errors?: { [key: string]: string };
}

const AddressForm = ({ formData, onChange, errors = {} }: AddressFormProps) => {
    // API calls
    const { data: citiesData, isLoading: isCitiesLoading } = useGetAllCitiesQuery();
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

    // Reset dependent fields when parent selection changes
    useEffect(() => {
        if (formData.cityId) {
            onChange({ ...formData, districtId: "", neighborhoodId: "" });
        }
    }, [formData.cityId]);

    useEffect(() => {
        if (formData.districtId) {
            onChange({ ...formData, neighborhoodId: "" });
        }
    }, [formData.districtId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "latitude" || name === "longitude") {
            const parsed = value === "" ? "" : Number(value);
            onChange({ ...formData, [name]: Number.isNaN(parsed) ? "" : parsed });
            return;
        }
        onChange({ ...formData, [name]: value });
    };

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedLocation([lat, lng]);
        onChange({
            ...formData,
            latitude: lat,
            longitude: lng
        });
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700, mb: 3 }}>
                Adres Bilgileri
            </Typography>

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
                        error={!!errors.cityId}
                        helperText={errors.cityId}
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
                        error={!!errors.districtId}
                        helperText={errors.districtId}
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
                        error={!!errors.neighborhoodId}
                        helperText={errors.neighborhoodId}
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
        </Box>
    );
};

export default AddressForm;
