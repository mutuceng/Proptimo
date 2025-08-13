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
    CardContent,
    Paper,
    Tabs,
    Tab,
    Pagination
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListingFilterBox from "../../components/user/Listing/ListingFilterBox";
import { useGetAllRealEstatesPreviewQuery } from "../../features/api/realEstateApi";
import type { GetAllRealEstatesPreviewRequest, GetAllRealEstatesPreviewResponseWithPaging } from "../../features/api/types/realEstate";
import ListingMap from "../../components/user/Listing/ListingMap";
import { useLanguage } from "../../context/LanguageContext";

const UserEstateListingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { t } = useLanguage();
    const [viewMode, setViewMode] = useState(0); // 0: Liste, 1: Harita
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 4x3 grid için 12 adet
    
    const [filterParams, setFilterParams] = useState<GetAllRealEstatesPreviewRequest>({
        realEstateTypeName: null,
        realEstatelistingType: null,
        realEstatestate: null,
        realEstateStartDate: null,
        realEstateEndDate: null,
        minPrice: null,
        maxPrice: null,
        cityName: null,
        districtName: null,
        pageNumber: 1
    });

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
            districtName: null,
            pageNumber: 1
        };
        setFilterParams(newFilterParams);
        setCurrentPage(1); // URL değiştiğinde sayfa 1'e dön
    }, [searchParams]);

    const { data: realEstates, isLoading, error } = useGetAllRealEstatesPreviewQuery(filterParams);

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

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(price);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('tr-TR');

    const handleEstateClick = (estateId: string) => {
        navigate(`/listings/${estateId}`);
    };

    // Sayfa değiştirme fonksiyonu
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        setFilterParams(prev => ({ ...prev, pageNumber: page }));
    };

    // Backend'den gelen paging bilgilerini kullan
    const totalPages = realEstates ? Math.ceil(realEstates.totalCount / realEstates.pageSize) : 0;

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#f8f9fa'
        }}>
            {/* Sol Taraf - Filter Box */}
            <Box sx={{ 
                width: { xs: '100%', lg: 320 },
                flexShrink: 0,
                p: { xs: 1, sm: 2 },
                backgroundColor: 'transparent',
                order: { xs: 2, lg: 1 }
            }}>
                <Box sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                    height: { xs: 'auto', lg: '100%' },
                    maxHeight: { xs: '400px', lg: 'none' },
                    overflowY: { xs: 'auto', lg: 'visible' }
                }}>
                     <ListingFilterBox onFilterChange={setFilterParams} />
                 </Box>
            </Box>

            {/* Sağ Taraf - İçerik Alanı */}
            <Box sx={{ 
                flex: 1, 
                p: { xs: 1, sm: 2, lg: 3 }, 
                overflowY: 'auto',
                order: { xs: 1, lg: 2 }
            }}>
                <Container maxWidth="xl" sx={{ p: 0 }}>
                    {/* Header */}
                    <Paper elevation={1} sx={{ 
                        mb: { xs: 2, sm: 3 }, 
                        borderRadius: 2,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0'
                    }}>
                        <Tabs 
                             value={viewMode} 
                             onChange={(_, newValue) => setViewMode(newValue)}
                             variant="fullWidth"
                             sx={{
                                 '& .MuiTab-root': {
                                     textTransform: 'none',
                                     fontWeight: 600,
                                     fontSize: { xs: '0.9rem', sm: '1rem' },
                                     minHeight: { xs: 48, sm: 64 },
                                     color: '#666',
                                     px: { xs: 2, sm: 4 },
                                     mx: { xs: 0, sm: 2 },
                                     '&.Mui-selected': {
                                         color: '#1976D2',
                                         backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                     }
                                 },
                                 '& .MuiTabs-indicator': {
                                     backgroundColor: '#1976D2',
                                     height: 3
                                 }
                             }}
                         >
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {t('realEstate.listings')}
                                        </Typography>
                                    </Box>
                                } 
                            />
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {t('map.title')}
                                        </Typography>
                                    </Box>
                                } 
                            />
                        </Tabs>
                    </Paper>
                    
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {t('errors.loadingError')}
                        </Alert>
                    )}

                    {!isLoading && !error && (!realEstates || realEstates.data.length === 0) && (
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
                                {t('errors.notFound')}
                            </Typography>
                        </Box>
                    )}

                    {!isLoading && !error && realEstates && realEstates.data.length > 0 && viewMode === 0 && (
                        <>
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: { 
                                    xs: '1fr', 
                                    sm: 'repeat(2, 1fr)', 
                                    md: 'repeat(2, 1fr)', 
                                    lg: 'repeat(3, 1fr)', 
                                    xl: 'repeat(4, 1fr)' 
                                }, 
                                gap: { xs: 2, sm: 3 },
                                mb: { xs: 3, sm: 4 }
                            }}>
                                {realEstates.data.map((estate, index) => (
                                <Card key={index} sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                                        boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.1)', sm: '0 8px 25px rgba(0,0,0,0.15)' }
                                    }
                                }}
                                onClick={() => handleEstateClick(estate.realEstateId)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={estate.primaryImageUrl ? `${import.meta.env.VITE_API_IMG_URL}${estate.primaryImageUrl}` : '/realestate.jpg'}
                                        alt={estate.realEstateTitle}
                                        sx={{ 
                                            objectFit: 'cover',
                                            height: { xs: 160, sm: 180, md: 200 }
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                                        <Typography variant="h6" component="h3" sx={{ 
                                            fontWeight: 600, 
                                            mb: 1, 
                                            fontSize: { xs: '0.9rem', sm: '1rem' }, 
                                            lineHeight: 1.3 
                                        }}>
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
                            
                            {/* Pagination */}
                            {totalPages > 0 && (
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    mt: { xs: 3, sm: 4 },
                                    p: { xs: 1, sm: 2 },
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        showFirstButton
                                        showLastButton
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}

                    {/* Harita Görünümü */}
                    {!isLoading && !error && realEstates && realEstates.data.length > 0 && viewMode === 1 && (
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
                            <ListingMap realEstates={realEstates} />
                        </Box>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default UserEstateListingPage;
