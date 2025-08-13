import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDeleteRealEstateTypeFeatureMutation, useGetAllRealEstateTypeFeaturesByTypeIdQuery, useUpdateRealEstateTypeFeatureMutation } from "../../../features/api/realEstateTypeFeatureApi";
import type { RealEstateTypeFeature, UpdateRealEstateTypeFeature, TypeFeatureDataType } from "../../../features/api/types/realEstateTypeFeature";
import { Box, IconButton, Paper, Tooltip, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, MenuItem, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
    const [updateRealEstateTypeFeature] = useUpdateRealEstateTypeFeatureMutation();

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingFeature, setEditingFeature] = useState<RealEstateTypeFeature | null>(null);
    const [editForm, setEditForm] = useState<UpdateRealEstateTypeFeature>({
        id: '',
        name: '',
        dataType: 0,
        isUnit: false,
        isRequired: false,
        options: [],
        realEstateTypeId: typeId ?? ''
    });
    const [newOption, setNewOption] = useState('');

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

    const handleEditFeature = (feature: RealEstateTypeFeature) => {
        setEditingFeature(feature);
        setEditForm({
            id: feature.id,
            name: feature.name,
            dataType: feature.dataType,
            isUnit: feature.isUnit,
            isRequired: feature.isRequired,
            options: [...feature.options],
            realEstateTypeId: feature.realEstateTypeId
        });
        setOpenEditDialog(true);
    };

    const handleUpdateFeature = async () => {
        try {
            await updateRealEstateTypeFeature(editForm).unwrap();
            alert('Özellik başarıyla güncellendi.');
            setOpenEditDialog(false);
            setEditingFeature(null);
            refetch();
        } catch (error) {
            alert('Güncelleme işlemi sırasında bir hata oluştu.');
            console.error(error);
        }
    };

    const handleAddOption = () => {
        if (newOption.trim() && !editForm.options.includes(newOption.trim())) {
            setEditForm(prev => ({
                ...prev,
                options: [...prev.options, newOption.trim()]
            }));
            setNewOption('');
        }
    };

    const handleRemoveOption = (optionToRemove: string) => {
        setEditForm(prev => ({
            ...prev,
            options: prev.options.filter(option => option !== optionToRemove)
        }));
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
            width: 200,
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <Tooltip title="Özelliği Düzenle" arrow>
                        <IconButton
                            onClick={() => handleEditFeature(params.row as RealEstateTypeFeature)}
                            size="small"
                            sx={{
                                color: '#FF9800',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                    color: '#E65100',
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
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
                </Box>
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

            {/* Edit Modal/Dialog Form */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" sx={{ color: '#1976D2', fontWeight: 600 }}>
                        Özellik Düzenle: {editingFeature?.name}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <TextField
                            label="Özellik Adı"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            fullWidth
                            required
                        />
                        
                        <TextField
                            select
                            label="Veri Tipi"
                            value={editForm.dataType}
                            onChange={(e) => setEditForm(prev => ({ ...prev, dataType: Number(e.target.value) as TypeFeatureDataType }))}
                            fullWidth
                            required
                        >
                            {Object.entries(dataTypeLabels).map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={editForm.isUnit}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, isUnit: e.target.checked }))}
                                    />
                                }
                                label="Birim"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={editForm.isRequired}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, isRequired: e.target.checked }))}
                                    />
                                }
                                label="Zorunlu"
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Seçenekler
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <TextField
                                    label="Yeni Seçenek"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    size="small"
                                    sx={{ flex: 1 }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleAddOption}
                                    disabled={!newOption.trim()}
                                >
                                    Ekle
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {editForm.options.map((option, index) => (
                                    <Chip
                                        key={index}
                                        label={option}
                                        onDelete={() => handleRemoveOption(option)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                        İptal
                    </Button>
                    <Button 
                        onClick={handleUpdateFeature}
                        variant="contained"
                        disabled={!editForm.name.trim()}
                        sx={{ backgroundColor: '#1976D2', '&:hover': { backgroundColor: '#1565C0' } }}
                    >
                        Güncelle
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminEstateTypeFeaturesListingPage;
