import { Box, Typography, Paper, IconButton, Tooltip } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { type RealEstateType } from '../../../features/api/types/realEstateType';
import { useEffect } from "react";
import { useDeleteRealEstateTypeMutation, useGetAllRealEstateTypesQuery } from "../../../features/api/realEstateTypeApi";
import EstateTypeAddForm from "../../../components/admin/realEstateType/EstateTypeAddForm";
import { useNavigate } from "react-router-dom";

const AdminEstateTypesListingPage = () => {

    const {data, isLoading, isFetching, refetch} = useGetAllRealEstateTypesQuery();
    const [deleteRealEstateType] = useDeleteRealEstateTypeMutation();
    const navigate = useNavigate();

    const handleDeleteRealEstateType = (id: string) => {
        if (window.confirm('Bu emlak tipini silmek istediğinizden emin misiniz?')) {
            
            deleteRealEstateType(id)
                .unwrap()
                .then(() => {
                    alert('Emlak tipi başarıyla silindi.');
                    refetch();
                })
                .catch((err: any) => {
                    alert('Silme işlemi sırasında bir hata oluştu.');
                    console.error(err);
                });
        }
    };

    useEffect(() => {
        console.log('useEffect triggered - calling refetch()');
        const fetchData = async () => {
            try {
                const response = await refetch();
                console.log('refetch executed successfully, data:', response);
            } catch (error) {
                console.error('Error during refetch:', error);
            }
        };
        fetchData();
    }, [refetch]);

    // API'den gelen veriyi kullan
    const realEstateTypes = (data as unknown as RealEstateType[]) || [];
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
            headerName: 'Emlak Tipi Adı',
            width: 300,
            resizable: false,
            sortable: true,
            flex: 1,
            minWidth: 200,
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
                <Tooltip title="Emlak Tipini Sil" arrow>
                    <IconButton
                        onClick={() => handleDeleteRealEstateType(params.row.id)}
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
        {
            field: 'addFeature',
            headerName: 'Özellik Ekle',
            width: 140,
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Tooltip title="Özellik Ekle" arrow>
                    <IconButton
                        onClick={() => navigate(`/admin/real-estate-type-features/${params.row.id}`)}
                        size="small"
                        sx={{
                            color: '#1976D2',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                color: '#0D47A1',
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        <PlaylistAddIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];


    const displayRealEstateTypes = realEstateTypes.slice(0, 10);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

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
                    Emlak Tipi Listesi
                </Typography>
                
                <Box sx={{ 
                    width: '100%',
                }}>
                    <DataGrid
                        rows={displayRealEstateTypes}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10]}
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

            <EstateTypeAddForm/>
        </Box>
    );
};

export default AdminEstateTypesListingPage;