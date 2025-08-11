import { Box, Button, Paper, TextField, Typography, MenuItem, Switch, FormControlLabel, Chip } from "@mui/material";
import type { CreateRealEstateTypeFeature } from "../../../features/api/types/realEstateTypeFeature";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useParams } from "react-router-dom";
import { useCreateRealEstateTypeFeatureMutation } from "../../../features/api/realEstateTypeFeatureApi";

const dataTypeOptions = [
    { value: 0, label: "Tam Sayı (Int)" },
    { value: 1, label: "Ondalık Sayı (Decimal)" },
    { value: 2, label: "Mantıksal (Bool)" },
    { value: 3, label: "Metin (String)" },
    { value: 4, label: "Tarih/Zaman (DateTime)" },
];

type Props = {
    onSuccess?: () => void;
  };

const TypeFeatureAddForm = ({ onSuccess }: Props) => {
    const [formData, setFormData] = useState<CreateRealEstateTypeFeature>({
        name: '',
        dataType: 0,
        isUnit: false,
        isRequired: false,
        options: [],
        realEstateTypeId: ''
    });
    const { typeId } = useParams<{ typeId: string }>();

    const [optionInput, setOptionInput] = useState('');
    const [createTypeFeature, { isLoading }] = useCreateRealEstateTypeFeatureMutation();

    const handleFormChange = (field: keyof CreateRealEstateTypeFeature, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddOption = () => {
        if (optionInput.trim() && !formData.options.includes(optionInput.trim())) {
            handleFormChange('options', [...formData.options, optionInput.trim()]);
            setOptionInput('');
        }
    };

    const handleDeleteOption = (option: string) => {
        handleFormChange('options', formData.options.filter(o => o !== option));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData, realEstateTypeId: typeId ?? '' };
            console.log('gonderilendata', dataToSend);
            const result = await createTypeFeature(dataToSend).unwrap();
            console.log('created', result);
            setFormData({
                name: '',
                dataType: 0,
                isUnit: false,
                isRequired: false,
                options: [],
                realEstateTypeId: ''
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Paper 
          elevation={6} 
          sx={{ 
            padding: 4, 
            backgroundColor: 'white', 
            borderRadius: 3,
            maxWidth: 600,
            mx: 'auto',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
          }}
        >
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                marginBottom: 4, 
                color: '#1976D2', 
                fontWeight: 700, 
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: 0.5
              }}
            >
                Yeni Emlak Türü Özelliği Ekle
            </Typography>

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}
            >
                {/* Özellik Adı */}
                <TextField
                    fullWidth
                    label="Özellik Adı"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Arsa Tipi, Alan (m²), Bina Yaşı, Isı Yalıtımı"
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#cfd8dc',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976D2',
                          boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1565c0',
                          boxShadow: '0 0 10px rgba(21, 101, 192, 0.5)',
                        },
                      },
                    }}
                />

                {/* Data Type */}
                <TextField
                    select
                    fullWidth
                    label="Veri Tipi"
                    value={formData.dataType}
                    onChange={(e) => handleFormChange('dataType', Number(e.target.value))}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#cfd8dc',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976D2',
                          boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1565c0',
                          boxShadow: '0 0 10px rgba(21, 101, 192, 0.5)',
                        },
                      },
                    }}
                >
                    {dataTypeOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </TextField>

                {/* isUnit */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.isUnit}
                            onChange={(e) => handleFormChange('isUnit', e.target.checked)}
                            color="primary"
                            sx={{
                              '&.Mui-checked': {
                                color: '#1565c0',
                              }
                            }}
                        />
                    }
                    label="Birim var mı?"
                    sx={{ userSelect: 'none' }}
                />

                {/* isRequired */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.isRequired}
                            onChange={(e) => handleFormChange('isRequired', e.target.checked)}
                            color="primary"
                            sx={{
                              '&.Mui-checked': {
                                color: '#1565c0',
                              }
                            }}
                        />
                    }
                    label="Zorunlu mu?"
                    sx={{ userSelect: 'none' }}
                />

                {/* Options */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#424242' }}>Seçenekler</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label="Seçenek Ekle"
                            value={optionInput}
                            onChange={(e) => setOptionInput(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: '#cfd8dc',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#1976D2',
                                  boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1565c0',
                                  boxShadow: '0 0 10px rgba(21, 101, 192, 0.5)',
                                },
                              },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddOption}
                            disabled={!optionInput.trim()}
                            sx={{
                                backgroundColor: '#1976D2',
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: 2,
                                padding: '12px 30px',
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: '#1565c0',
                                  boxShadow: '0 6px 18px rgba(21, 101, 192, 0.5)',
                                  transform: 'translateY(-2px)'
                                },
                                '&:disabled': {
                                  backgroundColor: '#90a4ae',
                                  boxShadow: 'none',
                                  color: '#eceff1',
                                  cursor: 'not-allowed',
                                  transform: 'none'
                                }
                            }}
                        >
                            Ekle
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {formData.options.map(opt => (
                            <Chip 
                              key={opt} 
                              label={opt} 
                              onDelete={() => handleDeleteOption(opt)} 
                              color="primary" 
                              sx={{
                                fontWeight: 600,
                                '& .MuiChip-deleteIcon': {
                                  color: '#1565c0',
                                  '&:hover': {
                                    color: '#0d47a1'
                                  }
                                }
                              }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Submit */}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading || !formData.name.trim()}
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: '#1976D2',
                        color: 'white',
                        padding: '14px 32px',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontSize: '16px',
                        fontWeight: 700,
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                            boxShadow: '0 10px 30px rgba(21, 101, 192, 0.6)',
                            transform: 'translateY(-3px)'
                        },
                        '&:disabled': {
                            backgroundColor: '#90a4ae',
                            color: '#eceff1',
                            boxShadow: 'none',
                            cursor: 'not-allowed',
                            transform: 'none'
                        }
                    }}
                >
                    {isLoading ? 'Ekleniyor...' : 'Özellik Ekle'}
                </Button>
            </Box>
        </Paper>
    );
};

export default TypeFeatureAddForm;
