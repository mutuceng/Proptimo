import { Box, Typography, Paper, TextField, Button, Switch, FormControlLabel } from "@mui/material";
import { useState } from 'react';

interface CurrencyFormData {
    code: string;
    name: string;
    symbol: string;
    rate: string;
    isActive: boolean;
}

interface CurrencyAddFormProps {
    onSubmit: (data: CurrencyFormData) => void;
}

const CurrencyAddForm = ({ onSubmit }: CurrencyAddFormProps) => {
    const [formData, setFormData] = useState<CurrencyFormData>({
        code: '',
        name: '',
        symbol: '',
        rate: '',
        isActive: true
    });

    const handleFormChange = (field: keyof CurrencyFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        // Form'u temizle
        setFormData({
            code: '',
            name: '',
            symbol: '',
            rate: '',
            isActive: true
        });
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
                            label="Para Birimi Kodu"
                            value={formData.code}
                            onChange={(e) => handleFormChange('code', e.target.value)}
                            placeholder="USD"
                            required
                        />
                    </Box>
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
                    <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                        <TextField
                            fullWidth
                            label="Kur"
                            type="number"
                            value={formData.rate}
                            onChange={(e) => handleFormChange('rate', e.target.value)}
                            placeholder="1.00"
                            inputProps={{ step: 0.01, min: 0 }}
                            required
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 150px', minWidth: '150px', display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={(e) => handleFormChange('isActive', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Aktif"
                        />
                    </Box>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: '#1976D2',
                            '&:hover': {
                                backgroundColor: '#1565C0',
                            },
                        }}
                    >
                        Para Birimi Ekle
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default CurrencyAddForm;
