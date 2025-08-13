import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { useState } from 'react';
import { type CreateCurrencyRequest } from '../../../features/api/types/currency';
import { useCreateCurrencyMutation } from "../../../features/api/currencyApi";
import AddIcon from '@mui/icons-material/Add';


const CurrencyAddForm = ( ) => {
    const [formData, setFormData] = useState<CreateCurrencyRequest>({
        name: '',
        symbol: ''
    });

    const [createCurrency, {isLoading}] = useCreateCurrencyMutation();

    const handleFormChange = (field: keyof CreateCurrencyRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            await createCurrency(formData).unwrap();

            setFormData({
                name: '',
                symbol: ''
            });
        } catch(err){
            console.error(err);
        }     
    };

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
                Yeni Para Birimi Ekle
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <TextField
                            fullWidth
                            label="Para Birimi Adı"
                            value={formData.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            placeholder="US Dollar"
                            required
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                        <TextField
                            fullWidth
                            label="Sembol"
                            value={formData.symbol}
                            onChange={(e) => handleFormChange('symbol', e.target.value)}
                            placeholder="$"
                            required
                        />
                    </Box>
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    width: '100%',
                    marginTop: '14px'
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
        </Paper>
    );
};

export default CurrencyAddForm;