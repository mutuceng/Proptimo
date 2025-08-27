import { Box, Typography, Paper, IconButton, TextField, MenuItem, FormControlLabel, Switch, Checkbox, FormGroup } from "@mui/material";
import { useState, useEffect, type ChangeEvent } from "react";
import { useGetAllRealEstateTypeFeaturesByTypeIdQuery } from "../../../../features/api/realEstateTypeFeatureApi";
import type { RealEstateTypeFeature } from "../../../../features/api/types/realEstateTypeFeature";
import type { RealEstateTypeFeatureValue } from "../../../../features/api/types/realEstateTypeFeatureValue";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface FeatureFormData {
    [featureId: string]: any;
}

interface UpdateFeaturesFormProps {
    estateTypeId: string;
    initialFeatureValues: RealEstateTypeFeatureValue[];
    initialFeatures?: RealEstateTypeFeature[]; // estateDetail.features'dan gelen veri
    onChange: (data: FeatureFormData, isModified: boolean) => void;
    errors?: { [key: string]: string };
}

const UpdateFeaturesForm = ({ estateTypeId, initialFeatureValues, initialFeatures, onChange, errors = {} }: UpdateFeaturesFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FeatureFormData>({});
    const [originalData, setOriginalData] = useState<FeatureFormData>({});
    const [isModified, setIsModified] = useState(false);

    // API call to get features for this estate type
    const { data: featuresData, isLoading } = useGetAllRealEstateTypeFeaturesByTypeIdQuery(estateTypeId, {
        skip: !estateTypeId || estateTypeId === ""
    });

    const features: RealEstateTypeFeature[] = featuresData?.data || initialFeatures || [];



        // Initialize form data from initial feature values - UserEstateDetailPage yapısını kullan
    useEffect(() => {
        
        const initialData: FeatureFormData = {};
        
        // UserEstateDetailPage'deki gibi feature mapping yap
        features.forEach(feature => {
            const featureValue = initialFeatureValues.find(v => v.realEstateTypeFeatureId === feature.id);

            if (featureValue) {
                // Determine the value based on the feature type
                let value: any = null;
                if (featureValue.valueInt !== null) {
                    value = featureValue.valueInt;
                } else if (featureValue.valueDecimal !== null) {
                    value = featureValue.valueDecimal;
                } else if (featureValue.valueBool !== null) {
                    value = featureValue.valueBool;
                } else if (featureValue.valueString !== null) {
                    value = featureValue.valueString;
                } else if (featureValue.valueDate !== null) {
                    value = featureValue.valueDate;
                }
                initialData[feature.id] = value;
            }
        });
        
        setFormData(initialData);
        setOriginalData(initialData);
    }, [initialFeatureValues, features]);

    // Check if data is modified
    useEffect(() => {
        const modified = JSON.stringify(formData) !== JSON.stringify(originalData);
        setIsModified(modified);
        onChange(formData, modified);
    }, [formData, originalData, onChange]);

    const handleChange = (featureId: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [featureId]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        setOriginalData(formData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(originalData);
        setIsModified(false);
    };

    const renderFeatureInput = (feature: RealEstateTypeFeature) => {
        const currentValue = formData[feature.id] || '';
        const error = errors[feature.id];
        
        // UserEstateDetailPage'deki gibi feature value'yu bul
        const featureValue = initialFeatureValues.find(v => v.realEstateTypeFeatureId === feature.id);

        switch (feature.dataType) {
            case 0: // Int
                return (
                    <TextField
                        label={feature.name}
                        type="number"
                        value={currentValue}
                        onChange={(e) => handleChange(feature.id, e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error}
                        disabled={!isEditing}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        InputProps={{ inputProps: { step: 1 } }}
                    />
                );

            case 1: // Decimal
                return (
                    <TextField
                        label={feature.name}
                        type="number"
                        value={currentValue}
                        onChange={(e) => handleChange(feature.id, e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error}
                        disabled={!isEditing}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        InputProps={{ inputProps: { step: "any" } }}
                    />
                );

            case 2: // Bool
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={Boolean(currentValue)}
                                onChange={(e) => handleChange(feature.id, e.target.checked)}
                                disabled={!isEditing}
                            />
                        }
                        label={feature.name}
                    />
                );

            case 3: // String
                // Eğer feature'ın options'ı varsa dropdown kullan
                if (feature.options && feature.options.length > 0) {
                    return (
                        <TextField
                            label={feature.name}
                            select
                            value={currentValue}
                            onChange={(e) => handleChange(feature.id, e.target.value)}
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error}
                            disabled={!isEditing}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        >
                            {feature.options.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    );
                }
                return (
                    <TextField
                        label={feature.name}
                        value={currentValue}
                        onChange={(e) => handleChange(feature.id, e.target.value)}
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error}
                        disabled={!isEditing}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                );

            case 4: // DateTime
                return (
                    <TextField
                        label={feature.name}
                        type="date"
                        value={currentValue ? new Date(currentValue).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleChange(feature.id, e.target.value)}
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error}
                        disabled={!isEditing}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        InputLabelProps={{ shrink: true }}
                    />
                );

            default:
                return (
                    <TextField
                        label={feature.name}
                        value={currentValue}
                        onChange={(e) => handleChange(feature.id, e.target.value)}
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error}
                        disabled={!isEditing}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                );
        }
    };

    if (isLoading || !estateTypeId || estateTypeId === "") {
        return (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography>Özellikler yükleniyor...</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700 }}>
                    Özellik Bilgileri
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

            {features.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    {estateTypeId ? 'Bu emlak tipi için tanımlanmış özellik bulunmamaktadır.' : 'Emlak tipi seçilmediği için özellikler yüklenemiyor.'}
                </Typography>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    {features.map((feature) => (
                        <Box key={feature.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    {feature.name}
                                </Typography>
                            </Box>
                            {renderFeatureInput(feature)}
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
};

export default UpdateFeaturesForm;
