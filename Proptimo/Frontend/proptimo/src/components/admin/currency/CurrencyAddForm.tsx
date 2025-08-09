import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { useState } from 'react';
import { type CreateCurrencyRequest } from '../../../features/api/types/currency';
import { useCreateCurrencyMutation } from "../../../features/api/currencySlice";



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
            const created = await createCurrency(formData).unwrap();
            console.log('created', created);

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
                <Box sx={{ mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            backgroundColor: '#1976D2',
                            '&:hover': {
                                backgroundColor: '#1565C0',
                            },
                        }}
                    >
                        {isLoading ? 'Ekleniyor...' : 'Para Birimi Ekle'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default CurrencyAddForm;