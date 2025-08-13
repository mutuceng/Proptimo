import { useState } from "react";
import { type CreateRealEstateTypeRequest } from "../../../features/api/types/realEstateType";
import { useCreateRealEstateTypeMutation } from "../../../features/api/realEstateTypeApi";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const EstateTypeAddForm = () => {

    const [formData, setFormData] = useState<CreateRealEstateTypeRequest>({
        name:''
    })

    const [createEstateType, {isLoading}] = useCreateRealEstateTypeMutation();

    const handleFormChange = (field: keyof CreateRealEstateTypeRequest, value:string) => {
        setFormData( prev => ({
            ...prev, 
            [field]: value
        }));
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createEstateType(formData).unwrap();

            setFormData({
                name:''
            });

        } catch(err) {
            console.error(err);
        }
    }

    return (
        <Paper
        elevation={2}
        sx={{
            padding: 3,
            backgroundColor: 'white',
            borderRadius: 2,
        }}
        >
            <Typography
                variant="h6"
                component="h2"
                sx={{
                    marginBottom: 3,
                    color: '#1976D2',
                    fontWeight: 600,
                    fontFamily: 'Poppins, sans-serif',
                }}
            >
                Yeni Emlak Türü Ekle
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                    <TextField
                        fullWidth
                        label="Emlak Türü Adı"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="Arsa, Daire, Villa..."
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1976D2',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1976D2',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#1976D2',
                            },
                        }}
                    />
                    <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    width: '100%',
                    marginTop: '14px',
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading || !formData.name.trim()}
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#1976D2',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '14px',
                                fontWeight: 600,
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    backgroundColor: '#1565C0',
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                                    transform: 'translateY(-1px)',
                                },
                                '&:disabled': {
                                    backgroundColor: '#BDBDBD',
                                    color: '#757575',
                                    boxShadow: 'none',
                                    transform: 'none',
                                },
                                transition: 'all 0.2s ease-in-out',
                                minWidth: '140px',
                            }}
                        >
                            {isLoading ? 'Ekleniyor...' : 'Emlak Türü Ekle'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    )
}

export default EstateTypeAddForm;