import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { type GetAllCurrencyResponse, type Currency } from '../../../features/api/types/currency';
import CurrencyAddForm from '../../../components/admin/currency/CurrencyAddForm';
import { useState, useEffect } from "react";
import { useGetAllCurrenciesQuery } from "../../../features/api/currencySlice";

const AdminCurrencyListingPage = () => {
    const {data, isLoading, isFetching, refetch, error} = useGetAllCurrenciesQuery();


    // Sayfa yüklendiğinde veriyi çek
    useEffect(() => {
        console.log('useEffect triggered - calling refetch()');
        refetch();
    }, [refetch]);

    // API'den gelen veriyi kullan
    const currencies = (data as unknown as Currency[]) || [];
    const loading = isLoading || isFetching;




    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
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
    ];

    // Dinamik tablo yüksekliği hesaplama
    // currencies'in her zaman bir dizi olduğundan emin ol, yoksa .length hatası alırsın
    const rowCount = Math.min(Array.isArray(currencies) ? currencies.length : 0, 10);
    const tableHeight = rowCount * 52 + 56; // 52px her satır için + 56px başlık

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
                        rows={currencies}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        loading={loading}
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