import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import CurrencyAddForm from '../../../components/admin/currency/CurrencyAddForm';

// Mock data - gerçek API'den gelecek
const mockCurrencies = [
    { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.00, isActive: true, createdAt: '2024-01-15' },
    { id: 2, code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85, isActive: true, createdAt: '2024-01-15' },
    { id: 3, code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 30.50, isActive: true, createdAt: '2024-01-15' },
    { id: 4, code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73, isActive: false, createdAt: '2024-01-10' },
    { id: 5, code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.25, isActive: true, createdAt: '2024-01-12' },
];

const AdminCurrencyListingPage = () => {
    const handleAddCurrency = (formData: any) => {
        console.log('Yeni para birimi ekleniyor:', formData);
        // TODO: API'ye gönder ve listeyi güncelle
    };

    const columns: GridColDef[] = [
        {
            field: 'code',
            headerName: 'Kod',
            width: 120,
            resizable: true,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: 'Para Birimi Adı',
            width: 200,
            resizable: true,
            sortable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'symbol',
            headerName: 'Sembol',
            width: 100,
            resizable: true,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'rate',
            headerName: 'Kur',
            width: 150,
            resizable: true,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (params: any) => {
                return params.value ? Number(params.value).toFixed(2) : '0.00';
            },
        },
        {
            field: 'isActive',
            headerName: 'Durum',
            width: 120,
            resizable: true,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: any) => (
                <Box
                    sx={{
                        backgroundColor: params.value ? '#4CAF50' : '#F44336',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                    }}
                >
                    {params.value ? 'Aktif' : 'Pasif'}
                </Box>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Oluşturulma Tarihi',
            width: 180,
            resizable: true,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (params: any) => {
                return new Date(params.value as string).toLocaleDateString('tr-TR');
            },
        },
    ];

    // Dinamik tablo yüksekliği hesaplama
    const rowCount = Math.min(mockCurrencies.length, 10);
    const tableHeight = rowCount * 52 + 56; // 52px per row + 56px header

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Tablo Bölümü */}
            <Paper
                elevation={2}
                sx={{
                    padding: 3,
                    backgroundColor: 'white',
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        marginBottom: 3,
                        color: '#1976D2',
                        fontWeight: 600,
                        fontFamily: 'Poppins, sans-serif',
                    }}
                >
                    Para Birimi Listesi
                </Typography>
                
                <Box sx={{ 
                    height: tableHeight,
                    width: '100%',
                    overflow: 'hidden',
                }}>
                    <DataGrid
                        rows={mockCurrencies}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #E0E0E0',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#F5F9FF',
                                color: '#1976D2',
                                fontWeight: 600,
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#E3F2FD',
                            },
                            '& .MuiDataGrid-row.Mui-selected': {
                                backgroundColor: '#E3F2FD',
                            },
                            '& .MuiDataGrid-row.Mui-selected:hover': {
                                backgroundColor: '#BBDEFB',
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                overflow: 'auto',
                            },
                        }}
                    />
                </Box>
            </Paper>

            <CurrencyAddForm onSubmit={handleAddCurrency} />
        </Box>
    );
};

export default AdminCurrencyListingPage;    