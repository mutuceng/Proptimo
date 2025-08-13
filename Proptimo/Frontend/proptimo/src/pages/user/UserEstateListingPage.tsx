import React, { useState, useEffect } from "react";
import { 
    Box, 
    Container, 
    Typography, 
    CircularProgress,
    Alert,
    Chip,
    Card,
    CardMedia,
    CardContent
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListingFilterBox from "../../components/user/Listing/ListingFilterBox";
import { useGetAllRealEstatesPreviewQuery } from "../../features/api/realEstateApi";
import type { GetAllRealEstatesPreviewRequest } from "../../features/api/types/realEstate";

const UserEstateListingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Varsayılan filtre parametreleri (null olarak başlatıyoruz)
    const [filterParams, setFilterParams] = useState<GetAllRealEstatesPreviewRequest>({
        realEstateTypeName: null,
        realEstatelistingType: null,
        realEstatestate: null,
        realEstateStartDate: null,
        realEstateEndDate: null,
        minPrice: null,
        maxPrice: null,
        cityName: null,
        districtName: null
    });

    // URL'den filtre parametrelerini al
    useEffect(() => {
        const listingType = searchParams.get('listingType');
        const cityName = searchParams.get('cityName');
        const newFilterParams: GetAllRealEstatesPreviewRequest = {
            realEstateTypeName: null,
            realEstatelistingType: listingType,
            realEstatestate: null,
            realEstateStartDate: null,
            realEstateEndDate: null,
            minPrice: null,
            maxPrice: null,
            cityName: cityName,
            districtName: null
        };
        setFilterParams(newFilterParams);
    }, [searchParams]);

    // API çağrısı
    const { data: realEstates, isLoading, error } = useGetAllRealEstatesPreviewQuery(filterParams);



    // Listing type zaten string olarak geliyor, direkt kullanıyoruz

    const getStateText = (state: number) => {
        switch (state) {
            case 0: return "Yayında";
            case 1: return "Kiralandı";
            case 2: return "Satıldı";
            case 3: return "Süresi Doldu";
            case 4: return "Gizli";
            default: return "Bilinmiyor";
        }
    };

    // State rengini belirleyen fonksiyon
    const getStateColor = (state: number) => {
        switch (state) {
            case 0: return "success";
            case 1: return "warning";
            case 2: return "error";
            case 3: return "default";
            case 4: return "default";
            default: return "default";
        }
    };

    // Fiyat formatlama
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(price);

    // Tarih formatlama
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('tr-TR');

    // Detay sayfasına yönlendirme
    const handleEstateClick = (estateId: string) => {
        navigate(`/listings/${estateId}`);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#f8f9fa'
        }}>
            {/* Sol Taraf - Filter Box */}
            <Box sx={{ 
                width: 320,
                flexShrink: 0,
                p: 2,
                backgroundColor: 'transparent'
            }}>
                <Box sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                    height: '100%'
                                 }}>
                     <ListingFilterBox onFilterChange={setFilterParams} />
                 </Box>
            </Box>

            {/* Sağ Taraf - İçerik Alanı */}
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
                <Container maxWidth="xl" sx={{ p: 0 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976D2', mb: 3 }}>
                        Emlak Listesi
                    </Typography>
                    
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            Emlak listesi yüklenirken bir hata oluştu.
                        </Alert>
                    )}

                    {!isLoading && !error && (!realEstates || realEstates.length === 0) && (
                        <Box sx={{
                            backgroundColor: 'white',
                            borderRadius: 2,
                            p: 3,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            minHeight: 400,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="h6" sx={{ color: '#666' }}>
                                Filtre kriterlerinize uygun emlak bulunamadı.
                            </Typography>
                        </Box>
                    )}

                    {!isLoading && !error && realEstates && realEstates.length > 0 && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                            {realEstates.map((estate, index) => (
                                <Card key={index} sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                    }
                                }}
                                onClick={() => handleEstateClick(estate.realEstateId)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={estate.primaryImageUrl ? `${import.meta.env.VITE_API_IMG_URL}${estate.primaryImageUrl}` : '/realestate.jpg'}
                                        alt={estate.realEstateTitle}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem', lineHeight: 1.3 }}>
                                            {estate.realEstateTitle}
                                        </Typography>
                                        
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {estate.realEstateTypeName}
                                        </Typography>
                                        
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                                            {formatPrice(estate.price)}
                                        </Typography>
                                        
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            📍 {estate.cityName}, {estate.districtName}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                                                         <Chip 
                                                 label={estate.realEstateTypeName || "Bilinmiyor"}
                                                 size="small"
                                                 color="primary"
                                                 variant="outlined"
                                             />
                                            <Chip 
                                                label={getStateText(estate.realEstateState || 0)}
                                                size="small"
                                                color={getStateColor(estate.realEstateState || 0) as any}
                                            />
                                        </Box>
                                        
                                        <Typography variant="caption" color="text.secondary">
                                            📅 {formatDate(estate.realEstateStartDate)} - {formatDate(estate.realEstateEndDate)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default UserEstateListingPage;
