import { Box, IconButton, Paper, Tooltip, Typography, Button, Alert } from "@mui/material";
import { useDeleteRealEstateMutation, useGetAllRealEstatesQuery } from "../../../features/api/realEstateApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import type { RealEstate } from "../../../features/api/types/realEstate";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddHomeOutlinedIcon from '@mui/icons-material/AddHomeOutlined';
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

const AdminEstateListingPage = () => {
    const { data, isLoading, isFetching, error, refetch } = useGetAllRealEstatesQuery();
    const [deleteRealEstate] = useDeleteRealEstateMutation();
    const navigate = useNavigate();

    const realEstates: RealEstate[] = (data as unknown as RealEstate[]) || [];

    const loading = isLoading || isFetching;

    const stateMap: Record<number, string> = {
        0: "Yayında",
        1: "Kiralandı",
        2: "Satıldı",
        3: "Süresi Doldu",
        4: "Gizli"
    };

    const listingTypeMap: Record<number, string> = {
        0: "Satılık",
        1: "Kiralık",
        2: "Günlük Kiralık"
    };

    // Format fonksiyonları
    const formatPrice = (value: number) => {
        if (value === null || value === undefined) return "0 ₺";
        return `${Number(value).toLocaleString('tr-TR')} ₺`;
    };

    const formatListingType = (value: number) => {
        if (value === null || value === undefined) return "Bilinmiyor";
        const result = listingTypeMap[value] || "Bilinmiyor";
        return result;
    };

    const formatState = (value: number) => {
        if (value === null || value === undefined) return "Bilinmiyor";
        const result = stateMap[value] || "Bilinmiyor";
        return result;
    };

    const formatDate = (value: string) => {
        if (!value) return "Belirtilmemiş";
        try {
            return new Date(value).toLocaleDateString('tr-TR');
        } catch {
            return "Geçersiz tarih";
        }
    };

    const handleDeleteRealEstate = (id: string) => {
        if (window.confirm('Bu emlağı silmek istediğinizden emin misiniz?')) {
            deleteRealEstate(id)
                .unwrap()
                .then(() => {
                    alert('Emlak başarıyla silindi.');
                    refetch();
                })
                .catch((err: any) => {
                    alert('Silme işlemi sırasında bir hata oluştu.');
                    console.error(err);
                });
        }
    };

    useEffect(() => {
        refetch().catch(console.error);
    }, [refetch]);

    const columns: GridColDef<RealEstate>[] = useMemo(() => [
        { field: 'id', headerName: 'ID', flex: 1, minWidth: 160, align: 'center', headerAlign: 'center', resizable: false },
        { field: 'title', headerName: 'Başlık', flex: 1, minWidth: 160, resizable: false },
        { field: 'description', headerName: 'Açıklama', flex: 2, minWidth: 180, resizable: false },
      
        { 
          field: 'price', 
          headerName: 'Fiyat', 
          flex: 1,
          minWidth: 160,
          resizable: false,
          renderCell: (params) => formatPrice(params.row.price)
        },
        {
          field: 'listingType',
          headerName: 'İlan Tipi',
          flex: 1,
          minWidth: 160,
          resizable: false,
          renderCell: (params) => formatListingType(params.row.listingType)
        },
        {
          field: 'state',
          headerName: 'Durum',
          flex: 1,
          minWidth: 160,
          resizable: false,
          renderCell: (params) => formatState(params.row.state)
        },
        {
          field: 'startDate',
          headerName: 'Başlangıç',
          flex: 1,
          minWidth: 160,
          resizable: false,
          renderCell: (params) => formatDate(params.row.startDate.toString())
        },
        {
          field: 'endDate',
          headerName: 'Bitiş',
          flex: 1,
          minWidth: 160,
          resizable: false,
          renderCell: (params) => formatDate(params.row.endDate.toString())
        },
        {
          field: 'actions',
          headerName: 'İşlemler',
          flex: 1,
          minWidth: 120,
          resizable: false,
          sortable: false,
          filterable: false,
          renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Düzenle">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/admin/real-estates/edit/${params.row.id}`)}
                  sx={{
                    color: '#1976D2',
                    '&:hover': {
                      backgroundColor: '#E3F2FD',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sil">
                <IconButton
                  size="small"
                  onClick={() => handleDeleteRealEstate(params.row.id)}
                  sx={{
                    color: '#d32f2f',
                    '&:hover': {
                      backgroundColor: '#ffebee',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
      ], [navigate, handleDeleteRealEstate]);
      

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Veri yüklenirken hata oluştu: {JSON.stringify(error)}
                </Alert>
            )}

            <Paper elevation={2} sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: '#1976D2', fontWeight: 600 }}>
                        Emlak Listesi ({realEstates.length})
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddHomeOutlinedIcon />}
                        onClick={() => navigate('/admin/real-estates/create')}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: '0 3px 10px rgba(25, 118, 210, 0.25)',
                            background: 'linear-gradient(90deg, #1976D2 0%, #1E88E5 100%)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #1565C0 0%, #1976D2 100%)',
                            }
                        }}
                    >
                        Yeni Emlak
                    </Button>
                </Box>
                <DataGrid
                    rows={realEstates}
                    columns={columns}
                    getRowId={(row) => row.id}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    loading={loading}
                    rowHeight={52}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F5F9FF', color: '#1976D2', fontWeight: 600 },
                        '& .MuiDataGrid-row:hover': { backgroundColor: '#E3F2FD' }
                    }}
                />
            </Paper>
        </Box>
    );
};

export default AdminEstateListingPage;
