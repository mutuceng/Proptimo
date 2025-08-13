import { useParams } from 'react-router-dom';
import { useGetRealEstateDetailQuery } from '../../features/api/realEstateApi';
import { useGetAllCurrenciesQuery, useConvertCurrencyMutation } from '../../features/api/currencyApi';
import { useLanguage } from '../../context/LanguageContext';
import {Box,
  Container,
  Typography,
  Paper,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton,
  Alert,
  Button,
  Stack
} from '@mui/material';
import {
  LocationOn,
  Home,
  AttachMoney,
  CalendarToday,
  CheckCircle,
  Cancel,
  Phone,
  Email,
  Share,
  Map as MapIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Currency } from '../../features/api/types/currency';

const useLeafletIcons = () => {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);
};

interface MapComponentProps {
  lat: number;
  lng: number;
  title: string;
  address: any;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng, title, address }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {address.cityName}, {address.districtName}, {address.neighborhoodName}
            </Typography>
          </Box>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

const UserEstateDetailPage = () => {
  const { estateId } = useParams<{ estateId: string }>();
  const { data, isLoading, error } = useGetRealEstateDetailQuery(estateId || '');
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [convertedPrices, setConvertedPrices] = useState<{[key: string]: number}>({});
  const [loadingCurrencies, setLoadingCurrencies] = useState<{[key: string]: boolean}>({});

  // Currency API'leri
  const { data: currencyResponse } = useGetAllCurrenciesQuery();
  const [convertCurrency] = useConvertCurrencyMutation();

  const currencies: Currency[] = (currencyResponse as unknown as Currency[]) || [];


  // Leaflet icon'larını düzelt
  useLeafletIcons();

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ flex: { xs: 1, lg: 3 } }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={20} />
            </Box>
          </Box>
          <Box sx={{ flex: { xs: 1, lg: 1 } }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 3 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3, mb: 3 }} />
            <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {t('errors.loadingError')}
        </Alert>
      </Container>
    );
  }

  const { realEstate, address, features, images, featureValues } = data;

  // Feature değerlerini feature'larla eşleştir
  const featureMap = new Map();
  features.forEach(feature => {
    const value = featureValues.find(v => v.realEstateTypeFeatureId === feature.id);
    if (value) {
      featureMap.set(feature.id, { feature, value });
    }
  });

  // Listing type'ı string'e çevir
  const getListingTypeText = (type: number) => {
    if (type === 0) return t('realEstate.listingType.sale');
    if (type === 1) return t('realEstate.listingType.rent');
    if (type === 2) return t('realEstate.listingType.dailyRent');
    return '';
  };

  // State'i string'e çevir
  const getStateText = (state: number) => {
    if (state === 0) return t('realEstate.status.active');
    if (state === 1) return t('realEstate.status.hidden');
    return '';
  };

  // Tarih formatını düzenle
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Fiyat formatını düzenle
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  // Para birimi çevirme fonksiyonu
  const handleCurrencyConvert = async (currency: Currency) => {
    // Loading state'ini başlat
    setLoadingCurrencies(prev => ({
      ...prev,
      [currency.id]: true
    }));

    try {
      const result = await convertCurrency({
        to: currency.symbol,
        amount: realEstate.price
      }).unwrap();
      
      // Başarılı sonucu state'e kaydet
      setConvertedPrices(prev => ({
        ...prev,
        [currency.id]: result
      }));
    } catch (error) {
      console.error('Para birimi çevirme hatası:', error);
      // Hata durumunda kullanıcıya bilgi ver
      alert('Para birimi çevirme işlemi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      // Loading state'ini bitir
      setLoadingCurrencies(prev => ({
        ...prev,
        [currency.id]: false
      }));
    }
  };

  // Haritada göster butonu için scroll fonksiyonu
  const scrollToMap = () => {
    const mapElement = document.querySelector('[data-map-section]');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Sol Taraf - Resimler ve Detaylar */}
        <Box sx={{ flex: { xs: 1, lg: 3 } }}>
          {/* Ana Resim */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            {images.length > 0 ? (
              <CardMedia
                component="img"
                height="400"
                image={`${import.meta.env.VITE_API_IMG_URL}${images[selectedImageIndex]?.imageUrl}`}
                alt={realEstate.title}
                sx={{ objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  height: 400,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {t('realEstate.images')}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Küçük Resimler */}
          {images.length > 1 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                  <Box key={image.id}>
                    <Card
                      sx={{
                        width: 80,
                        height: 60,
                        cursor: 'pointer',
                        border: selectedImageIndex === index ? 2 : 1,
                        borderColor: selectedImageIndex === index ? 'primary.main' : 'grey.300'
                      }}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <CardMedia
                        component="img"
                        height="60"
                        image={`${import.meta.env.VITE_API_IMG_URL}${image.imageUrl}`}
                        alt={`${realEstate.title} - ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Başlık ve Temel Bilgiler */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {realEstate.title}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  size="small"
                >
                  {t('common.share')}
                </Button>
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body1" color="text.secondary">
                {address.cityName}, {address.districtName}, {address.neighborhoodName}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={getListingTypeText(realEstate.listingType)}
                color={realEstate.listingType === 1 ? 'success' : 'primary'}
                variant="outlined"
              />
              <Chip
                label={getStateText(realEstate.state)}
                color={realEstate.state === 1 ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
          </Paper>

          {/* Açıklama */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('realEstate.description')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {realEstate.description}
            </Typography>
          </Paper>

          {/* Özellikler */}
          {featureMap.size > 0 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('realEstate.features')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                {Array.from(featureMap.values()).map(({ feature, value }) => (
                  <Box key={feature.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {feature.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {value.valueString || value.valueInt || value.valueDecimal || 
                           (value.valueBool !== undefined ? (value.valueBool ? t('common.yes') : t('common.no')) : '') ||
                           value.valueDate || t('common.notSpecified')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* Harita Bölümü */}
          {address.latitude && address.longitude && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }} data-map-section>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MapIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('realEstate.location')}
                </Typography>
              </Box>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'grey.300' }}>
                <MapComponent
                  lat={address.latitude}
                  lng={address.longitude}
                  title={realEstate.title}
                  address={address}
                />
              </Box>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  📍 {address.cityName}, {address.districtName}, {address.neighborhoodName}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>

        {/* Sağ Taraf - Fiyat ve İletişim */}
        <Box sx={{ flex: { xs: 1, lg: 1 } }}>
          {/* Fiyat Kartı */}
          <Paper elevation={3} sx={{ 
            p: 4, 
            borderRadius: 3, 
            mb: 3, 
            background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Dekoratif arka plan elementi */}
            <Box sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              zIndex: 0
            }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  {getListingTypeText(realEstate.listingType)}
                </Typography>
              </Box>
              
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: { xs: '2rem', sm: '2.5rem' }
              }}>
                {formatPrice(realEstate.price)}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                mb: 3
              }}>
                <CheckCircle sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('currency.reliablePrice')}
                </Typography>
              </Box>

              {/* Para Birimi Çevirme Bölümü */}
              {currencies && currencies.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.9, fontWeight: 600 }}>
                    {t('currency.internationalUnits')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {currencies.map((currency) => (
                      <Box key={currency.id} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                            {currency.symbol}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {currency.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {loadingCurrencies[currency.id] ? (
                            <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                              {t('currency.converting')}
                            </Typography>
                          ) : convertedPrices[currency.id] ? (
                            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                              {new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: currency.symbol
                              }).format(convertedPrices[currency.id])}
                            </Typography>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleCurrencyConvert(currency)}
                              sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.3)',
                                '&:hover': {
                                  borderColor: 'white',
                                  backgroundColor: 'rgba(255,255,255,0.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              {t('currency.convert')}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>

          {/* İletişim Kartı */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3, border: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1976D2' }}>
              {t('realEstate.contact')}
            </Typography>
            <Stack spacing={2.5}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Phone />}
                sx={{ 
                  py: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #4CAF50 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)'
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                {t('contact.call')}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Email />}
                sx={{ 
                  py: 2,
                  borderRadius: 2,
                  borderColor: '#1976D2',
                  color: '#1976D2',
                  '&:hover': {
                    borderColor: '#1565C0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                {t('contact.message')}
              </Button>
            </Stack>
          </Paper>

          {/* Detay Bilgileri */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1976D2' }}>
              {t('realEstate.details')}
            </Typography>
            <List dense>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box sx={{ 
                    p: 1, 
                    bgcolor: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CalendarToday fontSize="small" color="primary" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={t('realEstate.listingDate')}
                  secondary={formatDate(realEstate.createdAt.toString())}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box sx={{ 
                    p: 1, 
                    bgcolor: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Home fontSize="small" color="primary" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={t('realEstate.type')}
                  secondary={t('realEstate.type')}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box sx={{ 
                    p: 1, 
                    bgcolor: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <LocationOn fontSize="small" color="primary" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={t('contact.address')}
                  secondary={`${address.street} ${address.buildingNo}/${address.doorNumber}`}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
            </List>

            {/* Haritada Göster Butonu */}
            {address.latitude && address.longitude && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<MapIcon />}
                  onClick={scrollToMap}
                  sx={{ 
                    py: 2,
                    borderRadius: 2,
                    borderColor: '#FF9800',
                    color: '#FF9800',
                    '&:hover': {
                      borderColor: '#F57C00',
                      backgroundColor: 'rgba(255, 152, 0, 0.04)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {t('map.viewDetails')}
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default UserEstateDetailPage;