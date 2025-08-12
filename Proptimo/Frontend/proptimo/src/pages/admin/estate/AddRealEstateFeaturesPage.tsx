import { Box, Button, Paper, Typography, TextField, MenuItem, Checkbox, 
  FormControlLabel, FormControl,FormLabel,RadioGroup,Radio,Switch,InputAdornment,Chip,
     Alert, Skeleton } from "@mui/material";
 import { ProgressSteps } from "../../../components/admin/realEstate/ProgressSteps";
 import { useState, useEffect, type ChangeEvent } from "react";
 import { TypeFeatureDataType, type RealEstateTypeFeature } from "../../../features/api/types/realEstateTypeFeature";
import { useGetAllRealEstateTypeFeaturesByTypeIdQuery } from "../../../features/api/realEstateTypeFeatureApi";
import { useCreateRealEstateTypeFeatureValueMutation } from "../../../features/api/realEstateTypeFeatureValueApi";
import { useParams, useNavigate } from "react-router-dom";
   
 // Form data interface
 interface FeatureFormData {
   [featureId: string]: any;
 }
 
 // Data type enum mapping (TypeFeatureDataType değerlerine göre)
 const DataTypeEnum = {
   Int: 0,
   Decimal: 1,
   Bool: 2,
   String: 3,
   DateTime: 4
 } as const;
 
 const steps = [
     "Emlak Bilgileri",
     "Özellik Bilgileri",
     "Adres Bilgileri", 
     "Görseller"
 ];
 
   const AddRealEstateFeaturesPage = () => {
    const { estateId, estateTypeId } = useParams<{ estateId: string; estateTypeId: string }>();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1); // Özellik bilgileri adımı
    const [formData, setFormData] = useState<FeatureFormData>({});
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [saveError, setSaveError] = useState<string>('');

    // API hook'ları
    const [createRealEstateTypeFeatureValue, { isLoading: isCreatingValues }] = useCreateRealEstateTypeFeatureValueMutation();
 
   // API'den feature'ları çek
   const { data: featuresResponse, isLoading, error } = useGetAllRealEstateTypeFeaturesByTypeIdQuery(estateTypeId || '', {skip: !estateTypeId });
 
   const features: RealEstateTypeFeature[] = (featuresResponse as unknown as RealEstateTypeFeature[]) || [];
 
   
   console.log('Final features array:', features);
 
   // Debug için console log'lar
   useEffect(() => {
     console.log('🔍 Debug Info:');
     console.log('estateTypeId:', estateTypeId);
     console.log('featuresResponse:', featuresResponse);
     console.log('features:', features);
     console.log('isLoading:', isLoading);
     console.log('error:', error);
   }, [featuresResponse, features, isLoading, error, estateTypeId]);
 
   // estateTypeId yoksa önceki sayfaya yönlendir
   useEffect(() => {
     if (!estateTypeId || !estateId) {
       navigate('/admin/real-estates/create');
     }
   }, [estateTypeId, estateId, navigate]);
 
   // Form değişiklik handler'ı
   const handleChange = (featureId: string, value: any) => {
     setFormData(prev => ({
       ...prev,
       [featureId]: value
     }));
     
     // Error temizle
     if (errors[featureId]) {
       setErrors(prev => {
         const newErrors = { ...prev };
         delete newErrors[featureId];
         return newErrors;
       });
     }
   };
 
   // Validasyon
   const validateForm = (): boolean => {
     const newErrors: {[key: string]: string} = {};
     
     features.forEach((feature:any) => {
       if (feature.isRequired) {
         const value = formData[feature.id];
         
         if (value === undefined || value === null || 
             (Array.isArray(value) && value.length === 0) || 
             (typeof value === 'string' && value.trim() === '') ||
             (feature.dataType === DataTypeEnum.Bool && value === false)) {
           newErrors[feature.id] = `${feature.name} zorunlu bir alandır.`;
         }
       }
     });
     
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   // Helper function - field tipini belirle
   const getFieldType = (feature: RealEstateTypeFeature): string => {
     const lowerName = feature.name.toLowerCase();
     
     if (lowerName.includes('e-posta') || lowerName.includes('email')) return 'email';
     if (lowerName.includes('telefon') || lowerName.includes('phone')) return 'tel';
     if (lowerName.includes('açıklama') || lowerName.includes('description')) return 'multiline';
     if (lowerName.includes('özellik') && feature.options?.length > 0) return 'multiselect';
     if (lowerName.includes('fiyat') || lowerName.includes('price')) return 'currency';
     if (lowerName.includes('kredi') || lowerName.includes('faiz')) return 'percentage';
     
     return 'default';
   };
 
   // Form render fonksiyonu
   const renderFeatureInput = (feature: RealEstateTypeFeature) => {
     const value = formData[feature.id] || (feature.dataType === DataTypeEnum.Bool ? false : '');
     const hasError = !!errors[feature.id];
     const fieldType = getFieldType(feature);
 
     switch (feature.dataType) {
       case DataTypeEnum.String:
         // Options varsa Select/MultiSelect, yoksa Text input
         if (feature.options && feature.options.length > 0) {
           if (fieldType === 'multiselect') {
             // Multi-select checkbox list
             return (
               <Box key={feature.id}>
                 <Typography variant="subtitle2" sx={{ mb: 1, color: hasError ? '#d32f2f' : '#333' }}>
                   {feature.name} {feature.isRequired && '*'}
                 </Typography>
                 <Box sx={{ 
                   border: hasError ? '1px solid #d32f2f' : '1px solid #e0e0e0',
                   borderRadius: 2,
                   p: 2,
                   minHeight: 56,
                   backgroundColor: '#fafafa'
                 }}>
                   {feature.options.map((option) => (
                     <FormControlLabel
                       key={option}
                       control={
                         <Checkbox
                           checked={Array.isArray(value) && value.includes(option)}
                           onChange={(e) => {
                             const currentValues = Array.isArray(value) ? value : [];
                             if (e.target.checked) {
                               handleChange(feature.id, [...currentValues, option]);
                             } else {
                               handleChange(feature.id, currentValues.filter(v => v !== option));
                             }
                           }}
                           size="small"
                         />
                       }
                       label={option}
                       sx={{ display: 'block', mb: 0.5 }}
                     />
                   ))}
                 </Box>
                 {hasError && (
                   <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                     {errors[feature.id]}
                   </Typography>
                 )}
               </Box>
             );
           } else {
             // Single select dropdown
             return (
               <TextField
                 key={feature.id}
                 select
                 label={feature.name}
                 value={value}
                 onChange={(e) => handleChange(feature.id, e.target.value)}
                 required={feature.isRequired}
                 error={hasError}
                 helperText={errors[feature.id]}
                 fullWidth
                 size="small"
                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                 SelectProps={{
                   displayEmpty: true
                 }}
               >
                 <MenuItem value="">
                   <em>{feature.name} seçiniz</em>
                 </MenuItem>
                 {feature.options.map((option) => (
                   <MenuItem key={option} value={option}>
                     {option}
                   </MenuItem>
                 ))}
               </TextField>
             );
           }
         } else {
           // Text input variations
           const commonProps = {
             key: feature.id,
             label: feature.name,
             value: value,
             onChange: (e: ChangeEvent<HTMLInputElement>) => handleChange(feature.id, e.target.value),
             required: feature.isRequired,
             error: hasError,
             helperText: errors[feature.id],
             fullWidth: true,
             size: "small" as const,
             sx: { '& .MuiOutlinedInput-root': { borderRadius: 3 } }
           };
 
           switch (fieldType) {
             case 'multiline':
               return (
                 <TextField
                   {...commonProps}
                   multiline
                   rows={4}
                 />
               );
             case 'email':
               return (
                 <TextField
                   {...commonProps}
                   type="email"
                 />
               );
             case 'tel':
               return (
                 <TextField
                   {...commonProps}
                   type="tel"
                   placeholder="0(5xx) xxx xx xx"
                 />
               );
             default:
               return <TextField {...commonProps} />;
           }
         }
 
       case DataTypeEnum.Decimal:
         const decimalProps = {
           key: feature.id,
           label: feature.name,
           type: "number" as const,
           value: value,
           onChange: (e: ChangeEvent<HTMLInputElement>) => handleChange(feature.id, parseFloat(e.target.value) || 0),
           required: feature.isRequired,
           error: hasError,
           helperText: errors[feature.id],
           fullWidth: true,
           size: "small" as const,
           sx: { '& .MuiOutlinedInput-root': { borderRadius: 3 } },
           inputProps: { step: 0.01, min: 0 }
         };
 
         if (fieldType === 'currency') {
           return (
             <TextField
               {...decimalProps}
               InputProps={{
                 startAdornment: <InputAdornment position="start">₺</InputAdornment>
               }}
             />
           );
         } else if (fieldType === 'percentage') {
           return (
             <TextField
               {...decimalProps}
               InputProps={{
                 endAdornment: <InputAdornment position="end">%</InputAdornment>,
                 inputProps: { min: 0, max: 100, step: 0.01 }
               }}
             />
           );
         } else {
           return (
             <TextField
               {...decimalProps}
               InputProps={{
                 endAdornment: feature.isUnit ? (
                   <InputAdornment position="end">m²</InputAdornment>
                 ) : undefined
               }}
             />
           );
         }
 
       case DataTypeEnum.Int:
         return (
           <TextField
             key={feature.id}
             label={feature.name}
             type="number"
             value={value}
             onChange={(e) => handleChange(feature.id, parseInt(e.target.value) || 0)}
             required={feature.isRequired}
             error={hasError}
             helperText={errors[feature.id]}
             fullWidth
             size="small"
             sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
             inputProps={{ step: 1, min: 0 }}
             InputProps={{
               endAdornment: feature.isUnit ? (
                 <InputAdornment position="end">m²</InputAdornment>
               ) : undefined
             }}
           />
         );
 
       case DataTypeEnum.Bool:
         return (
           <Box key={feature.id}>
             <FormControlLabel
               control={
                 <Switch
                   checked={value || false}
                   onChange={(e) => handleChange(feature.id, e.target.checked)}
                   color="primary"
                 />
               }
               label={feature.name + (feature.isRequired ? ' *' : '')}
               sx={{ 
                 border: hasError ? '1px solid #d32f2f' : '1px solid #e0e0e0',
                 borderRadius: 2,
                 px: 2,
                 py: 1,
                 m: 0,
                 width: '100%',
                 justifyContent: 'space-between'
               }}
             />
             {hasError && (
               <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                 {errors[feature.id]}
               </Typography>
             )}
           </Box>
         );
 
       case DataTypeEnum.DateTime:
         return (
           <TextField
             key={feature.id}
             label={feature.name}
             type="date"
             value={value}
             onChange={(e) => handleChange(feature.id, e.target.value)}
             required={feature.isRequired}
             error={hasError}
             helperText={errors[feature.id]}
             fullWidth
             size="small"
             sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
             InputLabelProps={{ shrink: true }}
           />
         );
 
       default:
         return (
           <Alert severity="warning" key={feature.id}>
             Desteklenmeyen veri tipi: {feature.dataType}
           </Alert>
         );
     }
   };
 
   // Form verilerini backend'e gönderme fonksiyonu
   const saveFeatureValues = async (): Promise<boolean> => {
     try {
       // Tüm feature value'ları tek bir array'de topla
       const featureValues: any[] = [];
 
       Object.entries(formData).forEach(([featureId, value]) => {
         const feature = features.find(f => f.id === featureId);
         if (!feature || value === undefined || value === null || value === '') {
           return; // Bu feature'ı atla
         }
 
         // Veri tipine göre uygun field'ı ayarla
         let payload: any = {
           realEstateId: estateId,
           realEstateTypeFeatureId: featureId,
           valueInt: null,
           valueDecimal: null,
           valueBool: null,
           valueString: null,
           valueDate: null
         };
 
         switch (feature.dataType) {
           case DataTypeEnum.Int:
             payload.valueInt = parseInt(value) || null;
             break;
             
           case DataTypeEnum.Decimal:
             payload.valueDecimal = parseFloat(value) || null;
             break;
             
           case DataTypeEnum.Bool:
             payload.valueBool = Boolean(value);
             break;
             
           case DataTypeEnum.String:
             // Array değerleri string'e çevir (multi-select için)
             if (Array.isArray(value)) {
               payload.valueString = value.join(', ');
             } else {
               payload.valueString = String(value);
             }
             break;
             
           case DataTypeEnum.DateTime:
             if (value) {
               // Date string'i ISO format'a çevir
               payload.valueDate = new Date(value).toISOString();
             }
             break;
             
           default:
             console.warn(`Desteklenmeyen veri tipi: ${feature.dataType}`);
             return;
         }
 
         featureValues.push(payload);
       });
 
       console.log('Sending feature values:', featureValues);
 
               // Tek bir API çağrısı ile tüm değerleri gönder
        const result = await createRealEstateTypeFeatureValue(featureValues).unwrap();
       
       console.log('Bulk feature values saved:', result);
       setSaveError(''); // Hata varsa temizle
       return true;
       
     } catch (error: any) {
       console.error('Bulk feature values save error:', error);
       setSaveError(error?.data?.message || 'Veriler kaydedilirken bir hata oluştu.');
       return false;
     }
   };
 
   const handleNext = async () => {
     if (validateForm()) {
       console.log('Form Data:', formData);
       
       // Backend'e kaydet
       const saveSuccess = await saveFeatureValues();
       
       if (saveSuccess) {
         // Başarılı ise localStorage'a da kaydet (yedeğe)
         localStorage.setItem('realEstateFeatures', JSON.stringify(formData));
         // Adres sayfasına yönlendir
         if (estateId) {
           navigate(`/admin/real-estates/create/address/${estateId}`);
         } else {
           // estateId yoksa create başlangıcına dön
           navigate('/admin/real-estates/create');
         }
       } else {
         // Hata durumunda scroll to top
         window.scrollTo({ top: 0, behavior: 'smooth' });
       }
     }
   };
 
   const handleBack = () => {
     setActiveStep(prev => prev - 1);
   };
 
   // API hatası varsa göster
   if (error) {
     return (
       <Box sx={{ 
         width: "100%", 
         height: "100%", 
         background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)", 
         borderRadius: 3, 
         display: 'flex', 
         justifyContent: 'center',
         p: 3
       }}>
         <Box sx={{ width: '100%', maxWidth: 1040 }}>
           <ProgressSteps steps={steps} activeStep={activeStep} />
           <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mt: 3 }}>
             <Alert severity="error" sx={{ mb: 2 }}>
               Özellik bilgileri yüklenirken hata oluştu. Lütfen tekrar deneyin.
             </Alert>
             <Button
               variant="outlined"
               onClick={() => window.location.reload()}
               sx={{ borderRadius: 3 }}
             >
               Sayfayı Yenile
             </Button>
           </Paper>
         </Box>
       </Box>
     );
   }
 
   if (isLoading) {
     return (
       <Box sx={{ 
         width: "100%", 
         height: "100%", 
         background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)", 
         borderRadius: 3, 
         display: 'flex', 
         justifyContent: 'center',
         p: 3
       }}>
         <Box sx={{ width: '100%', maxWidth: 1040 }}>
           <ProgressSteps steps={steps} activeStep={activeStep} />
           <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mt: 3 }}>
             <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 2 }} />
             <Box sx={{ 
               display: 'grid', 
               gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
               gap: 2
             }}>
               {Array.from({length: 6}).map((_, index) => (
                 <Box key={index}>
                   <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                 </Box>
               ))}
             </Box>
           </Paper>
         </Box>
       </Box>
     );
   }
 
   // Feature yoksa mesaj göster - daha detaylı kontrol
   if (!isLoading && !error && features.length === 0) {
     console.log('⚠️ No features found - Debug info:');
     console.log('featuresResponse structure:', Object.keys(featuresResponse || {}));
     console.log('featuresResponse full:', JSON.stringify(featuresResponse, null, 2));
     
     return (
       <Box sx={{ 
         width: "100%", 
         height: "100%", 
         background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)", 
         borderRadius: 3, 
         display: 'flex', 
         justifyContent: 'center',
         p: 3
       }}>
         <Box sx={{ width: '100%', maxWidth: 1040 }}>
           <ProgressSteps steps={steps} activeStep={activeStep} />
           <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mt: 3 }}>
             <Alert severity="info" sx={{ mb: 2 }}>
               Bu emlak tipi için henüz özellik tanımlanmamış.
               <br />
               <small>Estate Type ID: {estateTypeId}</small>
               <br />
               <small>Response keys: {Object.keys(featuresResponse || {}).join(', ')}</small>
             </Alert>
             <Button
               variant="outlined"
               onClick={handleBack}
               sx={{ borderRadius: 3, mr: 2 }}
             >
               Geri Dön
             </Button>
             <Button
               variant="outlined"
               onClick={() => window.location.reload()}
               sx={{ borderRadius: 3 }}
             >
               Sayfayı Yenile
             </Button>
           </Paper>
         </Box>
       </Box>
     );
   }
 
   return (
     <Box sx={{ 
       width: "100%", 
       height: "100%", 
       background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)", 
       borderRadius: 3, 
       display: 'flex', 
       justifyContent: 'center',
       overflowY: 'auto',
       p: 3
     }}>
       <Box sx={{ width: '100%', maxWidth: 1040 }}>
         <ProgressSteps steps={steps} activeStep={activeStep} />
 
         <Paper
           elevation={3}
           sx={{
             p: { xs: 2, md: 3 },
             borderRadius: 4,
             boxShadow: "0 10px 30px rgba(25, 118, 210, 0.12)",
             overflow: "hidden",
             mt: 3
           }}
         >
           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
             <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700 }}>
               Emlak Özellikleri
             </Typography>
             <Typography variant="body2" sx={{ color: "#6B7280" }}>
               * Zorunlu alanlar
             </Typography>
           </Box>
 
           {/* Features Form */}
           <Box sx={{ mb: 4 }}>
             <Box sx={{ 
               display: 'grid', 
               gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
               gap: 3
             }}>
               {features.map((feature) => {
                 const fieldType = getFieldType(feature);
                 const isFullWidth = fieldType === 'multiline' || fieldType === 'multiselect';
                 
                 return (
                   <Box 
                     key={feature.id}
                     sx={{ 
                       gridColumn: isFullWidth ? '1 / -1' : 'auto'
                     }}
                   >
                     {renderFeatureInput(feature)}
                   </Box>
                 );
               })}
             </Box>
           </Box>
 
           {/* Form özeti */}
           {Object.keys(formData).length > 0 && (
             <Box sx={{ 
               mb: 3, 
               p: 2, 
               backgroundColor: '#F8FAFC', 
               borderRadius: 2,
               border: '1px solid #E3F2FD'
             }}>
               <Typography variant="subtitle2" sx={{ mb: 1, color: '#1976D2' }}>
                 Girilen Bilgiler:
               </Typography>
               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                 {Object.entries(formData).map(([featureId, value]) => {
                   const feature = features.find(f => f.id === featureId);
                   if (!feature || !value || (Array.isArray(value) && value.length === 0)) return null;
                   
                   let displayValue = value;
                   if (Array.isArray(value)) {
                     displayValue = value.join(', ');
                   } else if (typeof value === 'boolean') {
                     displayValue = value ? 'Evet' : 'Hayır';
                   }
                   
                   return (
                     <Chip
                       key={featureId}
                       label={`${feature.name}: ${displayValue}`}
                       size="small"
                       variant="outlined"
                       color="primary"
                     />
                   );
                 })}
               </Box>
             </Box>
           )}
 
           {/* Kaydetme hatası */}
           {saveError && (
             <Alert severity="error" sx={{ mb: 3 }}>
               {saveError}
             </Alert>
           )}
 
           {/* Hata mesajları */}
           {Object.keys(errors).length > 0 && (
             <Alert severity="error" sx={{ mb: 3 }}>
               Lütfen tüm zorunlu alanları doldurun ve hataları düzeltin.
             </Alert>
           )}
 
           {/* Navigation Buttons */}
           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
             <Button
               variant="contained"
               onClick={handleNext}
               disabled={isCreatingValues}
               sx={{
                 px: 2.25,
                 py: 0.75,
                 borderRadius: 3,
                 textTransform: "none",
                 fontWeight: 600,
                 boxShadow: "0 6px 20px rgba(25, 118, 210, 0.25)",
                 background: isCreatingValues ? "#ccc" : "linear-gradient(90deg, #1976D2 0%, #1E88E5 100%)",
                 '&:hover': {
                   background: isCreatingValues ? "#ccc" : "linear-gradient(90deg, #1565C0 0%, #1976D2 100%)",
                 },
               }}
             >
               {isCreatingValues ? 'Kaydediliyor...' : 'İleri'}
             </Button>
           </Box>
         </Paper>
       </Box>
     </Box>
   );
 };
 
   export default AddRealEstateFeaturesPage;
