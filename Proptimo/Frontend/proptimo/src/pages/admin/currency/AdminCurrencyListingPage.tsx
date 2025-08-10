import { Box, Typography, Paper, IconButton, Tooltip } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Currency } from '../../../features/api/types/currency';
import CurrencyAddForm from '../../../components/admin/currency/CurrencyAddForm';
import { useEffect } from "react";
import { useDeleteCurrencyMutation, useGetAllCurrenciesQuery } from "../../../features/api/currencyApi";

const AdminCurrencyListingPage = () => {
    const {data, isLoading, isFetching, refetch, error} = useGetAllCurrenciesQuery();
    const [deleteCurrency] = useDeleteCurrencyMutation();

    const handleDeleteCurrency = (id: string) => {
        if (window.confirm('Bu para birimini silmek istediğinizden emin misiniz?')) {
            
            deleteCurrency(id)
                .unwrap()
                .then(() => {
                    alert('Para birimi başarıyla silindi.');
                    refetch();
                })
                .catch((err) => {
                    alert('Silme işlemi sırasında bir hata oluştu.');
                    console.error(err);
                });
        }
    };


    useEffect(() => {
        console.log('useEffect triggered - calling refetch()');
        try{
            refetch();
        } catch(error){
            console.error(error);
        }  
    }, [refetch]);

    // API'den gelen veriyi kullan
    const currencies = (data as unknown as Currency[]) || [];
    const loading = isLoading || isFetching;




    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 120,
            resizable: false,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: 'Para Birimi Adı',
            width: 200,
            resizable: false,
            sortable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'symbol',
            headerName: 'Sembol',
            width: 100,
            resizable: false,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 100,
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Tooltip title="Para Birimini Sil" arrow>
                    <IconButton
                        onClick={() => handleDeleteCurrency(params.row.id)}
                        size="small"
                        sx={{
                            color: '#d32f2f',
                            '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                color: '#b71c1c',
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

   const displayCurrencies = currencies.slice(0, 5);

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
                
                <Box>
                    <DataGrid
                        rows={displayCurrencies}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        loading={loading}
                        rowHeight={52}

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

            <CurrencyAddForm/>
        </Box>
    );
};

export default AdminCurrencyListingPage;