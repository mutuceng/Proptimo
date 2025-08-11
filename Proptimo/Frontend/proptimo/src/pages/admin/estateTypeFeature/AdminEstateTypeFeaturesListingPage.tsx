import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDeleteRealEstateTypeFeatureMutation, useGetAllRealEstateTypeFeaturesByTypeIdQuery } from "../../../features/api/realEstateTypeFeatureApi";
import type { RealEstateTypeFeature } from "../../../features/api/types/realEstateTypeFeature";
import { Box, IconButton, Paper, Tooltip, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TypeFeatureAddForm from "../../../components/admin/realEstateType/TypeFeatureAddForm";

// Backend enum karşılıkları
const dataTypeLabels: Record<number, string> = {
  0: "Tam Sayı (Int)",
  1: "Ondalık Sayı (Decimal)",
  2: "Mantıksal (Bool)",
  3: "Metin (String)",
  4: "Tarih/Zaman (DateTime)",
};

const booleanLabel = (value?: boolean) => (value ? "Evet" : "Hayır");

const AdminEstateTypeFeaturesListingPage = () => {
    const { typeId } = useParams<{ typeId: string }>();
    const { data, isLoading, isFetching, refetch } = useGetAllRealEstateTypeFeaturesByTypeIdQuery(typeId ?? "");
    const [deleteRealEstateTypeFeature] = useDeleteRealEstateTypeFeatureMutation();

    const [openAddDialog, setOpenAddDialog] = useState(false);

    const handleDeleteRealEstateTypeFeature = (featureId: string, typeId: string ) => {
        if (window.confirm('Bu özelliği silmek istediğinizden emin misiniz?')) {
            deleteRealEstateTypeFeature({ featureId, typeId })
                .unwrap()
                .then(() => {
                    alert('Özelllik başarıyla silindi.');
                    refetch();
                })
                .catch((err: any) => {
                    alert('Silme işlemi sırasında bir hata oluştu.');
                    console.error(err);
                });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refetch();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [refetch]);

    const typeFeatures = (data as unknown as RealEstateTypeFeature[]) || [];
    const loading = isLoading || isFetching;

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 130,
            resizable: true,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: 'Özellik Adı',
            flex: 1,
            minWidth: 140,
            resizable: true,
            sortable: true,
        },
        {
            field: 'dataType',
            headerName: 'Veri Tipi',
            flex: 1,
            minWidth: 140,
            resizable: true,
            sortable: true,
            renderCell: (params) => {
                const val = (params.row as RealEstateTypeFeature).dataType;
                return dataTypeLabels[val] || 'Bilinmiyor';
            },
        },
        {
            field: 'options',
            headerName: 'Seçenekler',
            flex: 1,
            minWidth: 160,
            resizable: true,
            sortable: false,
            renderCell: (params) => {
                const opts = (params.row as RealEstateTypeFeature).options;
                if (!opts || opts.length === 0) return '';
                const full = opts.join(', ');
                return (
                    <Tooltip title={full} arrow>
                        <Box sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                        }}>
                            {full}
                        </Box>
                    </Tooltip>
                );
            },
        },
        {
            field: 'isUnit',
            headerName: 'Birim',
            width: 140,
            resizable: true,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => booleanLabel((params.row as RealEstateTypeFeature).isUnit),
        },
        {
            field: 'isRequired',
            headerName: 'Zorunlu Mu',
            width: 140,
            resizable: true,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => booleanLabel((params.row as RealEstateTypeFeature).isRequired),
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
                <Tooltip title="Özelliği Sil" arrow>
                    <IconButton
                        onClick={() => {
                            if (params.row.id && typeId) {
                                handleDeleteRealEstateTypeFeature(params.row.id as string, typeId as string);
                            } else {
                                alert("Geçersiz veri: Özellik ID veya Tip ID bulunamadı.");
                            }
                        }}
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddDialog(true)}
                    sx={{ mb: 1, backgroundColor: '#1976D2', '&:hover': { backgroundColor: '#1565C0' } }}
                >
                    Yeni Özellik Ekle
                </Button>
            </Box>

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
                    Emlak Tip Özellik Listesi
                </Typography>
                
                <Box sx={{ width: '100%', height: 520 }}>
                    <DataGrid
                        rows={typeFeatures}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        // checkboxSelection kaldırıldı, istersen ekleyebilirsin
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

            {/* Modal/Dialog Form */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                
                <DialogContent dividers>
                    <TypeFeatureAddForm onSuccess={() => {
                        setOpenAddDialog(false);
                        refetch();
                    }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="secondary">
                        İptal
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminEstateTypeFeaturesListingPage;
