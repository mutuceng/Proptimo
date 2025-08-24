import { Box, Typography, TextField, MenuItem, Checkbox, FormControlLabel, Switch, InputAdornment, Chip, Alert, Skeleton } from "@mui/material";
import { useState, useEffect, type ChangeEvent } from "react";
import { TypeFeatureDataType, type RealEstateTypeFeature } from "../../../features/api/types/realEstateTypeFeature";
import { useGetAllRealEstateTypeFeaturesByTypeIdQuery } from "../../../features/api/realEstateTypeFeatureApi";

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

interface FeaturesFormProps {
    estateTypeId: string;
    formData: FeatureFormData;
    onChange: (data: FeatureFormData) => void;
    errors?: { [key: string]: string };
}

const FeaturesForm = ({ estateTypeId, formData, onChange, errors = {} }: FeaturesFormProps) => {
    // API'den feature'ları çek
    const { data: featuresResponse, isLoading, error } = useGetAllRealEstateTypeFeaturesByTypeIdQuery(estateTypeId, { skip: !estateTypeId });
    const features: RealEstateTypeFeature[] = (featuresResponse as unknown as RealEstateTypeFeature[]) || [];

    // Form değişiklik handler'ı
    const handleChange = (featureId: string, value: any) => {
        onChange({
            ...formData,
            [featureId]: value
        });
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
                        <Typography variant="subtitle2" sx={{ mb: 1, color: hasError ? '#d32f2f' : '#333' }}>
                            {feature.name} {feature.isRequired && '*'}
                        </Typography>
                        <Box sx={{ 
                            border: hasError ? '1px solid #d32f2f' : '1px solid #e0e0e0',
                            borderRadius: 3,
                            p: 1.5,
                            minHeight: 40,
                            backgroundColor: '#fafafa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                borderColor: hasError ? '#d32f2f' : '#1976D2',
                                backgroundColor: '#f5f5f5'
                            }
                        }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                {value ? 'Evet' : 'Hayır'}
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={value || false}
                                        onChange={(e) => handleChange(feature.id, e.target.checked)}
                                        color="primary"
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#1976D2',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                                }
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#1976D2'
                                            }
                                        }}
                                    />
                                }
                                label=""
                                sx={{ m: 0 }}
                            />
                        </Box>
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

    // API hatası varsa göster
    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                Özellik bilgileri yüklenirken hata oluştu. Lütfen tekrar deneyin.
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <Box>
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
            </Box>
        );
    }

    // Feature yoksa mesaj göster
    if (!isLoading && !error && features.length === 0) {
        return (
            <Alert severity="info" sx={{ mb: 2 }}>
                Bu emlak tipi için henüz özellik tanımlanmamış.
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700, mb: 3 }}>
                Emlak Özellikleri
            </Typography>

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
        </Box>
    );
};

export default FeaturesForm;
