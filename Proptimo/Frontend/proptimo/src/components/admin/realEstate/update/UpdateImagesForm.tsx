import { Box, Typography, Paper, IconButton, Button, Card, CardMedia, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState, useEffect } from "react";
import type { RealEstateImage } from "../../../../features/api/types/realEstateImage";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface ImageFile {
    id: string;
    file?: File;
    preview: string;
    order: number;
    isPrimary: boolean;
    isExisting: boolean; // Mevcut görsel mi yoksa yeni eklenen mi
    originalId?: string; // Mevcut görseller için orijinal ID
}

interface UpdateImagesFormProps {
    initialImages: RealEstateImage[];
    onChange: (data: {
        images: ImageFile[];
        deletedImages: string[];
        newImages: File[];
        isModified: boolean;
    }) => void;
    error?: string;
}

const UpdateImagesForm = ({ initialImages, onChange, error }: UpdateImagesFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [images, setImages] = useState<ImageFile[]>([]);
    const [originalImages, setOriginalImages] = useState<ImageFile[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [isModified, setIsModified] = useState(false);
    const [addImageDialogOpen, setAddImageDialogOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Initialize images from initial data
    useEffect(() => {
        const initialImageFiles: ImageFile[] = initialImages.map((img, index) => {
            // API'den gelen relative URL'i env üzerinden tam URL'e çevir
            const apiBase = (import.meta.env.VITE_API_IMG_URL || "").replace(/\/$/, "");
            const fullImageUrl = img.imageUrl.startsWith('http') 
                ? img.imageUrl 
                : `${apiBase}${img.imageUrl.startsWith('/') ? '' : '/'}${img.imageUrl}`;
            
            return {
                id: `existing-${index}-${Date.now()}`,
                preview: fullImageUrl,
                order: img.order || index + 1,
                isPrimary: img.isPrimary,
                isExisting: true,
                originalId: img.id // backend'in gerçek görsel id'si
            };
        });
        
        setImages(initialImageFiles);
        setOriginalImages(initialImageFiles);
    }, [initialImages]);

    // Check if data is modified
    useEffect(() => {
        const modified = isModified || deletedImages.length > 0 || images.some(img => !img.isExisting);
        onChange({
            images,
            deletedImages,
            newImages: images.filter(img => !img.isExisting && img.file).map(img => img.file!),
            isModified: modified
        });
    }, [images, deletedImages, isModified, onChange]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
        setAddImageDialogOpen(true);
    };

    const handleAddImages = () => {
        const newImages: ImageFile[] = selectedFiles.map((file, index) => ({
            id: `new-${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file),
            order: images.length + index + 1,
            isPrimary: images.length === 0 && index === 0, // İlk görsel primary olsun
            isExisting: false
        }));

        setImages(prev => [...prev, ...newImages]);
        setSelectedFiles([]);
        setAddImageDialogOpen(false);
        setIsModified(true);
    };

    const handleDeleteImage = (imageId: string) => {
        const image = images.find(img => img.id === imageId);
        if (image?.isExisting && image.originalId) {
            setDeletedImages(prev => [...prev, image.originalId!]);
        }
        
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== imageId);
            // Reorder remaining images
            return filtered.map((img, index) => ({
                ...img,
                order: index + 1,
                isPrimary: index === 0 // İlk görsel primary olsun
            }));
        });
        setIsModified(true);
    };

    const handleSetPrimary = (imageId: string) => {
        setImages(prev => prev.map(img => ({
            ...img,
            isPrimary: img.id === imageId
        })));
        setIsModified(true);
    };

    const handleReorder = (fromIndex: number, toIndex: number) => {
        const newImages = [...images];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        
        // Update order
        const reorderedImages = newImages.map((img, index) => ({
            ...img,
            order: index + 1
        }));
        
        setImages(reorderedImages);
        setIsModified(true);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        setOriginalImages(images);
        setIsModified(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setImages(originalImages);
        setDeletedImages([]);
        setIsModified(false);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (fromIndex !== toIndex) {
            handleReorder(fromIndex, toIndex);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700 }}>
                    Görseller
                </Typography>
                {!isEditing ? (
                    <IconButton 
                        onClick={handleEdit}
                        sx={{ 
                            color: "#1976D2",
                            '&:hover': { backgroundColor: '#E3F2FD' }
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                            onClick={handleSave}
                            disabled={!isModified && deletedImages.length === 0}
                            sx={{ 
                                color: (isModified || deletedImages.length > 0) ? "#4CAF50" : "#ccc",
                                '&:hover': { backgroundColor: (isModified || deletedImages.length > 0) ? '#E8F5E8' : 'transparent' }
                            }}
                        >
                            <SaveIcon />
                        </IconButton>
                        <IconButton 
                            onClick={handleCancel}
                            sx={{ 
                                color: "#f44336",
                                '&:hover': { backgroundColor: '#FFEBEE' }
                            }}
                        >
                            <CancelIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {error && (
                <Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
                    {error}
                </Typography>
            )}

            {isEditing && (
                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<AddPhotoAlternateIcon />}
                        sx={{ borderRadius: 3 }}
                    >
                        Görsel Ekle
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={handleFileSelect}
                        />
                    </Button>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Görselleri sürükleyip bırakarak sıralayabilirsiniz. İlk görsel ana görsel olarak ayarlanır.
                    </Typography>
                </Box>
            )}

            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 2 
            }}>
                {images.map((image, index) => (
                    <Box key={image.id}>
                        <Card 
                            sx={{ 
                                position: 'relative',
                                cursor: isEditing ? 'grab' : 'default',
                                '&:active': isEditing ? { cursor: 'grabbing' } : {}
                            }}
                            draggable={isEditing}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            {isEditing && (
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                                    }}
                                    size="small"
                                >
                                    <DragIndicatorIcon />
                                </IconButton>
                            )}
                            
                            <CardMedia
                                component="img"
                                height="200"
                                image={image.preview}
                                alt={`Görsel ${index + 1}`}
                                sx={{ objectFit: 'cover' }}
                            />
                            
                            <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {image.isPrimary && (
                                        <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                                    )}
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Sıra: {image.order}
                                    </Typography>
                                </Box>
                                
                                {isEditing && (
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {!image.isPrimary && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleSetPrimary(image.id)}
                                                sx={{ color: '#FFD700' }}
                                            >
                                                <StarBorderIcon />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteImage(image.id)}
                                            sx={{ color: '#f44336' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </CardActions>
                        </Card>
                    </Box>
                ))}
            </Box>

            {images.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Henüz görsel eklenmemiş.
                    </Typography>
                </Box>
            )}

            {/* Add Images Dialog */}
            <Dialog open={addImageDialogOpen} onClose={() => setAddImageDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Görsel Ekle</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {selectedFiles.length} görsel seçildi. Bu görseller mevcut görsellere eklenecek.
                    </Typography>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                        gap: 1 
                    }}>
                        {selectedFiles.map((file, index) => (
                            <Box key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={URL.createObjectURL(file)}
                                        alt={`Seçilen görsel ${index + 1}`}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddImageDialogOpen(false)}>İptal</Button>
                    <Button onClick={handleAddImages} variant="contained">Ekle</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default UpdateImagesForm;
