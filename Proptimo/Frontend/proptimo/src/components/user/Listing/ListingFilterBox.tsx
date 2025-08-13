import React, { useState } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Slider, Button, Divider, Chip, TextField, IconButton} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Business as BusinessIcon,
  Villa as VillaIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import { useGetAllRealEstateTypesQuery } from '../../../features/api/realEstateTypeApi';
import type { RealEstateType } from '../../../features/api/types/realEstateType';
import type { GetAllRealEstatesPreviewRequest } from '../../../features/api/types/realEstate';

interface FilterState {
  propertyType: string;
  listingType: string;
  status: string;
  priceRange: [number, number];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  city: string;
  district: string;
}

interface ListingFilterBoxProps {
  onFilterChange?: (filters: GetAllRealEstatesPreviewRequest) => void;
}

const ListingFilterBox: React.FC<ListingFilterBoxProps> = ({ onFilterChange }) => {
  // API'den emlak tiplerini çek
  const { data: realEstateTypes, isLoading: isLoadingTypes } = useGetAllRealEstateTypesQuery();
  
  const [filters, setFilters] = useState<FilterState>({
    propertyType: '',
    listingType: '',
    status: '',
    priceRange: [0, 10000000],
    dateRange: {
      startDate: '',
      endDate: ''
    },
    city: '',
    district: ''
  });



  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedFilterChange = (parent: keyof FilterState, field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      propertyType: '',
      listingType: '',
      status: '',
      priceRange: [0, 10000000],
      dateRange: {
        startDate: '',
        endDate: ''
      },
      city: '',
      district: ''
    });
    
    // Parent component'e boş filtreleri gönder
    if (onFilterChange) {
      onFilterChange({
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
    }
  };

  const handleRemoveFilter = (field: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [field]: field === 'priceRange' ? [0, 10000000] : 
                field === 'dateRange' ? { startDate: '', endDate: '' } : ''
    }));
  };

  const formatPrice = (value: number) => {
    return `${value.toLocaleString('tr-TR')} ₺`;
  };

  // Fiyat input'larını handle et
  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value.replace(/[^\d]/g, '') ? parseInt(value.replace(/[^\d]/g, '')) : 0;
    
    if (field === 'min') {
      setFilters(prev => ({
        ...prev,
        priceRange: [numValue, prev.priceRange[1]]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        priceRange: [prev.priceRange[0], numValue]
      }));
    }
  };

  // Filtreleri API formatına dönüştür
  const convertFiltersToApiFormat = (): GetAllRealEstatesPreviewRequest => {
    return {
      realEstateTypeName: filters.propertyType || null,
      realEstatelistingType: filters.listingType || null,
      realEstatestate: filters.status ? parseInt(filters.status) : null,
      realEstateStartDate: filters.dateRange.startDate || null,
      realEstateEndDate: filters.dateRange.endDate || null,
      minPrice: filters.priceRange[0] !== 0 ? filters.priceRange[0] : null,
      maxPrice: filters.priceRange[1] !== 10000000 ? filters.priceRange[1] : null,
      cityName: filters.city || null,
      districtName: filters.district || null
    };
  };

  // Filtrele butonuna tıklandığında
  const handleFilterSubmit = () => {
    if (onFilterChange) {
      const apiFilters = convertFiltersToApiFormat();
      onFilterChange(apiFilters);
    }
  };

  const estateTypes = (realEstateTypes as unknown as RealEstateType[]) || [];
  const propertyTypes = estateTypes?.map((type: RealEstateType) => ({
    value: type.name,
    label: type.name,
  })) || [];

  const listingTypes = [
    { value: '0', label: 'Satılık' },
    { value: '1', label: 'Kiralık' },
    { value: '2', label: 'Günlük Kiralık' }
  ];


  const getActiveFilters = () => {
    const activeFilters: { field: keyof FilterState; label: string; value: string }[] = [];
    
    if (filters.propertyType) {
      const type = propertyTypes.find((t: any) => t.value === filters.propertyType);
      activeFilters.push({ field: 'propertyType', label: 'Emlak Tipi', value: type?.label || '' });
    }
    
    if (filters.listingType) {
      const type = listingTypes.find(t => t.value === filters.listingType);
      activeFilters.push({ field: 'listingType', label: 'İlan Tipi', value: type?.label || '' });
    }
    
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000000) {
      activeFilters.push({ 
        field: 'priceRange', 
        label: 'Fiyat', 
        value: `${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}` 
      });
    }
    
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      const start = filters.dateRange.startDate || 'Başlangıç';
      const end = filters.dateRange.endDate || 'Bitiş';
      activeFilters.push({ 
        field: 'dateRange', 
        label: 'Tarih', 
        value: `${start} - ${end}` 
      });
    }
    
    if (filters.city) {
      activeFilters.push({ field: 'city', label: 'Şehir', value: filters.city });
    }
    
    if (filters.district) {
      activeFilters.push({ field: 'district', label: 'İlçe', value: filters.district });
    }
    
    return activeFilters;
  };

  const activeFilters = getActiveFilters();
  const activeFiltersCount = activeFilters.length;

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}
    >
             {/* Header */}
       <Box sx={{ 
         p: 3, 
         borderBottom: '1px solid #e0e0e0',
         backgroundColor: '#1976D2'
       }}>
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
             <FilterIcon sx={{ color: '#ffffff', fontSize: 24 }} />
             <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff', fontSize: '1.1rem' }}>
               Filtreler
             </Typography>
           </Box>
           {activeFiltersCount > 0 && (
             <IconButton
               onClick={handleClearFilters}
               size="small"
               sx={{
                 color: '#ffffff',
                 backgroundColor: 'rgba(255,255,255,0.1)',
                 '&:hover': {
                   backgroundColor: 'rgba(255,255,255,0.2)'
                 },
                 transition: 'all 0.2s ease-in-out'
               }}
             >
               <ClearIcon fontSize="small" />
             </IconButton>
           )}
         </Box>

                                       {/* Active Filters */}
           {activeFilters.length > 0 && (
             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
               {activeFilters.map((filter) => (
                 <Chip
                   key={filter.field}
                   label={`${filter.label}: ${filter.value}`}
                   onDelete={() => handleRemoveFilter(filter.field)}
                   deleteIcon={<DeleteIcon />}
                   size="small"
                   sx={{
                     backgroundColor: '#e3f2fd',
                     color: '#1976D2',
                     border: '1px solid #bbdefb',
                     fontWeight: 500,
                     fontSize: '0.75rem',
                                           '& .MuiChip-deleteIcon': {
                        color: '#1976D2',
                        '&:hover': {
                          color: '#1565C0'
                        }
                      },
                     '&:hover': {
                       backgroundColor: '#f3e5f5'
                     },
                     transition: 'all 0.2s ease-in-out'
                   }}
                 />
               ))}
             </Box>
           )}
       </Box>

                           {/* Filter Content */}
       <Box sx={{ p: 3 }}>
         {/* Property Type */}
         <Box sx={{ mb: 3 }}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976D2' }}>
             Emlak Tipi
           </Typography>
           <FormControl fullWidth size="small">
             <Select
               value={filters.propertyType}
               onChange={(e) => handleFilterChange('propertyType', e.target.value)}
               displayEmpty
               disabled={isLoadingTypes}
               sx={{ 
                 borderRadius: 1,
                 '& .MuiOutlinedInput-notchedOutline': {
                   borderColor: '#e0e0e0'
                 },
                 '&:hover .MuiOutlinedInput-notchedOutline': {
                   borderColor: '#1976D2'
                 },
                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                   borderColor: '#1976D2'
                 }
               }}
             >
               <MenuItem value="">
                 {isLoadingTypes ? 'Yükleniyor...' : 'Tümü'}
               </MenuItem>
               {propertyTypes.map((type) => (
                 <MenuItem key={type.value} value={type.value}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {type.label}
                   </Box>
                 </MenuItem>
               ))}
             </Select>
           </FormControl>
         </Box>

         <Divider sx={{ my: 2 }} />

         {/* Listing Type */}
         <Box sx={{ mb: 3 }}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976D2' }}>
             İlan Tipi
           </Typography>
           <FormControl fullWidth size="small">
             <Select
               value={filters.listingType}
               onChange={(e) => handleFilterChange('listingType', e.target.value)}
               displayEmpty
               sx={{ 
                 borderRadius: 1,
                 '& .MuiOutlinedInput-notchedOutline': {
                   borderColor: '#e0e0e0'
                 },
                 '&:hover .MuiOutlinedInput-notchedOutline': {
                   borderColor: '#1976D2'
                 },
                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                   borderColor: '#1976D2'
                 }
               }}
             >
               <MenuItem value="">Tümü</MenuItem>
               {listingTypes.map((type) => (
                 <MenuItem key={type.value} value={type.value}>
                   {type.label}
                 </MenuItem>
               ))}
             </Select>
           </FormControl>
         </Box>

         <Divider sx={{ my: 2 }} />

                                       {/* Price Range */}
           <Box sx={{ mb: 3 }}>
             <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976D2' }}>
               Fiyat Aralığı
             </Typography>
             <Box sx={{ px: 1 }}>
               <Slider
                 value={filters.priceRange}
                 onChange={(_, value) => handleFilterChange('priceRange', value)}
                 valueLabelDisplay="auto"
                 valueLabelFormat={formatPrice}
                 min={0}
                 max={10000000}
                 step={100000}
                 sx={{
                   '& .MuiSlider-thumb': {
                     backgroundColor: '#1976D2',
                     width: 18,
                     height: 18,
                     '&:hover': {
                       backgroundColor: '#1565C0',
                       transform: 'scale(1.1)'
                     }
                   },
                   '& .MuiSlider-track': {
                     backgroundColor: '#1976D2',
                     height: 3
                   },
                   '& .MuiSlider-rail': {
                     backgroundColor: '#e0e0e0',
                     height: 3
                   },
                   '& .MuiSlider-valueLabel': {
                     backgroundColor: '#1976D2',
                     fontSize: '0.75rem'
                   }
                 }}
               />
               <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                 <TextField
                   size="small"
                   label="Min Fiyat"
                   value={filters.priceRange[0].toLocaleString('tr-TR')}
                   onChange={(e) => handlePriceChange('min', e.target.value)}
                   InputProps={{
                     endAdornment: <Typography variant="caption" sx={{ color: '#666' }}>₺</Typography>
                   }}
                   sx={{ 
                     flex: 1,
                     '& .MuiOutlinedInput-root': {
                       borderRadius: 1,
                       '&:hover .MuiOutlinedInput-notchedOutline': {
                         borderColor: '#1976D2'
                       },
                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                         borderColor: '#1976D2'
                       }
                     }
                   }}
                 />
                 <TextField
                   size="small"
                   label="Max Fiyat"
                   value={filters.priceRange[1].toLocaleString('tr-TR')}
                   onChange={(e) => handlePriceChange('max', e.target.value)}
                   InputProps={{
                     endAdornment: <Typography variant="caption" sx={{ color: '#666' }}>₺</Typography>
                   }}
                   sx={{ 
                     flex: 1,
                     '& .MuiOutlinedInput-root': {
                       borderRadius: 1,
                       '&:hover .MuiOutlinedInput-notchedOutline': {
                         borderColor: '#1976D2'
                       },
                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                         borderColor: '#1976D2'
                       }
                     }
                   }}
                 />
               </Box>
             </Box>
           </Box>

         <Divider sx={{ my: 2 }} />

                                       {/* Date Range */}
           <Box sx={{ mb: 3 }}>
             <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976D2' }}>
               Tarih Aralığı
             </Typography>
             <Box sx={{ display: 'flex', gap: 2 }}>
               <TextField
                 size="small"
                 label="Başlangıç Tarihi"
                 type="date"
                 value={filters.dateRange.startDate}
                 onChange={(e) => handleNestedFilterChange('dateRange', 'startDate', e.target.value)}
                 InputLabelProps={{ shrink: true }}
                 sx={{ 
                   flex: 1,
                   '& .MuiOutlinedInput-root': {
                     borderRadius: 1,
                     '&:hover .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#1976D2'
                     },
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#1976D2'
                     }
                   }
                 }}
               />
               <TextField
                 size="small"
                 label="Bitiş Tarihi"
                 type="date"
                 value={filters.dateRange.endDate}
                 onChange={(e) => handleNestedFilterChange('dateRange', 'endDate', e.target.value)}
                 InputLabelProps={{ shrink: true }}
                 sx={{ 
                   flex: 1,
                   '& .MuiOutlinedInput-root': {
                     borderRadius: 1,
                     '&:hover .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#1976D2'
                     },
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#1976D2'
                     }
                   }
                 }}
               />
             </Box>
           </Box>

         <Divider sx={{ my: 2 }} />

                   {/* Location */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1976D2' }}>
              Konum
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                label="Şehir"
                placeholder="Şehir seçiniz..."
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                sx={{ 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976D2'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976D2'
                    }
                  }
                }}
              />
              <TextField
                size="small"
                label="İlçe"
                placeholder="İlçe seçiniz..."
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                sx={{ 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976D2'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976D2'
                    }
                  }
                }}
              />
            </Box>
          </Box>
       </Box>

                                                                               {/* Footer - Buttons */}
            <Box sx={{ 
              p: 3, 
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5'
            }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                               <Button
                   variant="contained"
                   startIcon={<SearchIcon />}
                   fullWidth
                   onClick={handleFilterSubmit}
                   sx={{
                     backgroundColor: '#1976D2',
                     textTransform: 'none',
                     fontWeight: 600,
                     borderRadius: 2,
                     py: 1.5,
                     fontSize: '0.95rem',
                     boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                     transition: 'all 0.2s ease-in-out',
                     '&:hover': {
                       backgroundColor: '#1565C0',
                       transform: 'translateY(-1px)',
                       boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                     },
                     '&:active': {
                       transform: 'translateY(0)'
                     }
                   }}
                 >
                   Filtrele
                 </Button>
                
              </Box>
            </Box>
       </Box>
     );
   };

export default ListingFilterBox;
