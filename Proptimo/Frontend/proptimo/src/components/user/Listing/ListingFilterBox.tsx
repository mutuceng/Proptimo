import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Slider,
  Button,
  Divider,
  Chip,
  TextField,
  IconButton
} from '@mui/material';
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

interface FilterState {
  propertyType: string;
  listingType: string;
  status: string;
  priceRange: [number, number];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  location: string;
}

const ListingFilterBox: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    propertyType: '',
    listingType: '',
    status: '',
    priceRange: [0, 10000000],
    dateRange: {
      startDate: '',
      endDate: ''
    },
    location: ''
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
      location: ''
    });
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

  const propertyTypes = [
    { value: 'apartment', label: 'Daire', icon: <ApartmentIcon /> },
    { value: 'house', label: 'Ev', icon: <HomeIcon /> },
    { value: 'villa', label: 'Villa', icon: <VillaIcon /> },
    { value: 'office', label: 'Ofis', icon: <BusinessIcon /> }
  ];

  const listingTypes = [
    { value: 'sale', label: 'Satılık' },
    { value: 'rent', label: 'Kiralık' },
    { value: 'daily_rent', label: 'Günlük Kiralık' }
  ];

  const statuses = [
    { value: 'active', label: 'Aktif' },
    { value: 'pending', label: 'Beklemede' },
    { value: 'sold', label: 'Satıldı' },
    { value: 'rented', label: 'Kiralandı' }
  ];



  const getActiveFilters = () => {
    const activeFilters: { field: keyof FilterState; label: string; value: string }[] = [];
    
    if (filters.propertyType) {
      const type = propertyTypes.find(t => t.value === filters.propertyType);
      activeFilters.push({ field: 'propertyType', label: 'Emlak Tipi', value: type?.label || '' });
    }
    
    if (filters.listingType) {
      const type = listingTypes.find(t => t.value === filters.listingType);
      activeFilters.push({ field: 'listingType', label: 'İlan Tipi', value: type?.label || '' });
    }
    
    if (filters.status) {
      const status = statuses.find(s => s.value === filters.status);
      activeFilters.push({ field: 'status', label: 'Durum', value: status?.label || '' });
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
    
    if (filters.location) {
      activeFilters.push({ field: 'location', label: 'Konum', value: filters.location });
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
        backgroundColor: '#ffffff'
      }}
    >
             {/* Header */}
       <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <FilterIcon sx={{ color: '#1976d2' }} />
             <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
               Filtreler
             </Typography>
           </Box>
           {activeFiltersCount > 0 && (
             <IconButton
               onClick={handleClearFilters}
               size="small"
               sx={{
                 color: '#d32f2f',
                 backgroundColor: '#ffebee',
                 border: '1px solid #ffcdd2',
                 '&:hover': {
                   backgroundColor: '#ffcdd2',
                   transform: 'scale(1.05)'
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
           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
             {activeFilters.map((filter) => (
               <Chip
                 key={filter.field}
                 label={`${filter.label}: ${filter.value}`}
                 onDelete={() => handleRemoveFilter(filter.field)}
                                   deleteIcon={<DeleteIcon />}
                 size="small"
                 sx={{
                   backgroundColor: '#e3f2fd',
                   color: '#1976d2',
                   border: '1px solid #bbdefb',
                   '& .MuiChip-deleteIcon': {
                     color: '#1976d2',
                     '&:hover': {
                       color: '#d32f2f'
                     }
                   },
                   '&:hover': {
                     backgroundColor: '#f3e5f5'
                   }
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
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
             Emlak Tipi
           </Typography>
           <FormControl fullWidth size="small">
             <Select
               value={filters.propertyType}
               onChange={(e) => handleFilterChange('propertyType', e.target.value)}
               displayEmpty
               sx={{ borderRadius: 1 }}
             >
               <MenuItem value="">Tümü</MenuItem>
               {propertyTypes.map((type) => (
                 <MenuItem key={type.value} value={type.value}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     {type.icon}
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
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
             İlan Tipi
           </Typography>
           <FormControl fullWidth size="small">
             <Select
               value={filters.listingType}
               onChange={(e) => handleFilterChange('listingType', e.target.value)}
               displayEmpty
               sx={{ borderRadius: 1 }}
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

         {/* Status */}
         <Box sx={{ mb: 3 }}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
             Durum
           </Typography>
           <FormControl fullWidth size="small">
             <Select
               value={filters.status}
               onChange={(e) => handleFilterChange('status', e.target.value)}
               displayEmpty
               sx={{ borderRadius: 1 }}
             >
               <MenuItem value="">Tümü</MenuItem>
               {statuses.map((status) => (
                 <MenuItem key={status.value} value={status.value}>
                   {status.label}
                 </MenuItem>
               ))}
             </Select>
           </FormControl>
         </Box>

         <Divider sx={{ my: 2 }} />

         {/* Price Range */}
         <Box sx={{ mb: 3 }}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
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
                   backgroundColor: '#1976d2'
                 },
                 '& .MuiSlider-track': {
                   backgroundColor: '#1976d2'
                 },
                 '& .MuiSlider-rail': {
                   backgroundColor: '#e0e0e0'
                 }
               }}
             />
             <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
               <TextField
                 size="small"
                 label="Min"
                 value={formatPrice(filters.priceRange[0])}
                 InputProps={{ readOnly: true }}
                 sx={{ flex: 1 }}
               />
               <TextField
                 size="small"
                 label="Max"
                 value={formatPrice(filters.priceRange[1])}
                 InputProps={{ readOnly: true }}
                 sx={{ flex: 1 }}
               />
             </Box>
           </Box>
         </Box>

         <Divider sx={{ my: 2 }} />

         {/* Date Range */}
         <Box sx={{ mb: 3 }}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
             Tarih Aralığı
           </Typography>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
             <TextField
               size="small"
               label="Başlangıç Tarihi"
               type="date"
               value={filters.dateRange.startDate}
               onChange={(e) => handleNestedFilterChange('dateRange', 'startDate', e.target.value)}
               InputLabelProps={{ shrink: true }}
               sx={{ borderRadius: 1 }}
             />
             <TextField
               size="small"
               label="Bitiş Tarihi"
               type="date"
               value={filters.dateRange.endDate}
               onChange={(e) => handleNestedFilterChange('dateRange', 'endDate', e.target.value)}
               InputLabelProps={{ shrink: true }}
               sx={{ borderRadius: 1 }}
             />
           </Box>
         </Box>

         <Divider sx={{ my: 2 }} />

         {/* Location */}
         <Box sx={{ mb: 3 }}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
             Konum
           </Typography>
           <TextField
             size="small"
             placeholder="Şehir, ilçe..."
             value={filters.location}
             onChange={(e) => handleFilterChange('location', e.target.value)}
             fullWidth
             sx={{ borderRadius: 1 }}
           />
         </Box>
       </Box>

                   {/* Footer - Buttons */}
          <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', mt: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                fullWidth
                sx={{
                  backgroundColor: '#1976d2',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5,
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
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
