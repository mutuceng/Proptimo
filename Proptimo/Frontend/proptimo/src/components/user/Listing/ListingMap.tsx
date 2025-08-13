import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import type { GetAllRealEstatesPreviewResponseWithPaging } from '../../../features/api/types/realEstate';

// Leaflet icon'larını düzelt
const useLeafletIcons = () => {
    React.useEffect(() => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);
};

interface ListingMapProps {
    realEstates: GetAllRealEstatesPreviewResponseWithPaging | undefined;
}

const ListingMap: React.FC<ListingMapProps> = ({ realEstates }) => {
    const navigate = useNavigate();
    
    // Leaflet icon'larını düzelt
    useLeafletIcons();

    // Fiyat formatlama
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(price);
    };



    // Emlak detay sayfasına yönlendirme
    const handleEstateClick = (estateId: string) => {
        navigate(`/listings/${estateId}`);
    };

    // Varsayılan merkez (Türkiye geneli)
    const defaultCenter = [38.9637, 35.2433]; // Türkiye'nin tamamını gösteren merkez

    // Emlakların koordinatlarını filtrele (latitude ve longitude varsa)
    const estatesWithLocation = realEstates?.data.filter(estate => 
        estate.latitude && estate.longitude
    ) || [];

    // Harita merkezini hesapla (emlakların ortalaması veya varsayılan)
    const calculateMapCenter = () => {
        if (estatesWithLocation.length === 0) return defaultCenter;
        
        const totalLat = estatesWithLocation.reduce((sum, estate) => sum + estate.latitude!, 0);
        const totalLng = estatesWithLocation.reduce((sum, estate) => sum + estate.longitude!, 0);
        
        return [totalLat / estatesWithLocation.length, totalLng / estatesWithLocation.length];
    };

    const mapCenter = calculateMapCenter();

    return (
        <Box sx={{ width: '100%', height: '600px', position: 'relative' }}>
            {estatesWithLocation.length === 0 ? (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                }}>
                    <Typography variant="h6" color="text.secondary">
                        Haritada gösterilecek emlak bulunamadı.
                    </Typography>
                </Box>
            ) : (
                <MapContainer
                    center={mapCenter as [number, number]}
                    zoom={6}
                    style={{ height: '100%', width: '100%', borderRadius: 8 }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {estatesWithLocation.map((estate, index) => (
                        <Marker 
                            key={index} 
                            position={[estate.latitude!, estate.longitude!]}
                        >
                            <Popup
                                offset={[0, -10]}
                                className="custom-popup"
                            >
                                <Box sx={{ 
                                    width: 200, 
                                    cursor: 'pointer',
                                    '& .leaflet-popup-content-wrapper': {
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }
                                }} 
                                onClick={() => handleEstateClick(estate.realEstateId)}
                                >
                                    <Card sx={{ 
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        borderRadius: 1.5,
                                        overflow: 'hidden',
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.02)'
                                        }
                                    }}>
                                        <CardMedia
                                            component="img"
                                            height="80"
                                            image={estate.primaryImageUrl ? `${import.meta.env.VITE_API_IMG_URL}${estate.primaryImageUrl}` : '/realestate.jpg'}
                                            alt={estate.realEstateTitle}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ p: 1.5 }}>
                                            <Typography variant="subtitle2" component="h3" sx={{ 
                                                fontWeight: 600, 
                                                mb: 0.5, 
                                                fontSize: '0.8rem',
                                                lineHeight: 1.2,
                                                color: '#1a1a1a'
                                            }}>
                                                {estate.realEstateTitle}
                                            </Typography>
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.7rem' }}>
                                                {estate.realEstateTypeName}
                                            </Typography>
                                            
                                            <Typography variant="subtitle1" color="primary" sx={{ 
                                                fontWeight: 700, 
                                                mb: 0.5,
                                                fontSize: '0.85rem'
                                            }}>
                                                {formatPrice(estate.price)}
                                            </Typography>
                                            

                                            
                                            <Typography variant="caption" color="text.secondary" sx={{ 
                                                display: 'block',
                                                fontSize: '0.65rem'
                                            }}>
                                                📍 {estate.cityName}, {estate.districtName}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </Box>
    );
};

export default ListingMap;