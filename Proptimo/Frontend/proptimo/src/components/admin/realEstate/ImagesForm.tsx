import { Box, Typography, IconButton, Dialog, DialogContent, DialogActions, Alert, Chip } from "@mui/material";
import { CloudUpload, Delete, Star, StarBorder, DragIndicator, ZoomIn, Image as ImageIcon } from "@mui/icons-material";
import { useState, useRef, useCallback } from "react";

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    order: number;
    isPrimary: boolean;
}

interface ImagesFormProps {
    images: ImageFile[];
    onChange: (images: ImageFile[]) => void;
    error?: string;
}

const ImagesForm = ({ images, onChange, error }: ImagesFormProps) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((files: FileList) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        Array.from(files).forEach((file, index) => {
            if (!allowedTypes.includes(file.type)) {
                console.error(`${file.name} desteklenmeyen bir dosya formatı. Sadece JPG, PNG ve WebP dosyaları yüklenebilir.`);
                return;
            }
            
            if (file.size > maxSize) {
                console.error(`${file.name} çok büyük. Maksimum dosya boyutu 5MB olmalıdır.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage: ImageFile = {
                    id: Date.now() + index + Math.random().toString(),
                    file,
                    preview: e.target?.result as string,
                    order: images.length + index + 1,
                    isPrimary: images.length === 0 && index === 0
                };
                
                onChange([...images, newImage]);
            };
            reader.readAsDataURL(file);
        });
    }, [images, onChange]);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        
        newImages.splice(draggedIndex, 1);
        newImages.splice(dropIndex, 0, draggedImage);
        
        const updatedImages = newImages.map((img, idx) => ({
            ...img,
            order: idx + 1
        }));
        
        onChange(updatedImages);
        setDraggedIndex(null);
    };

    // Primary görsel ayarla
    const setPrimary = (id: string) => {
        onChange(images.map(img => ({
            ...img,
            isPrimary: img.id === id
        })));
    };

    // Görsel sil
    const removeImage = (id: string) => {
        const imageToRemove = images.find(img => img.id === id);
        if (imageToRemove?.isPrimary && images.length > 1) {
            const remainingImages = images.filter(img => img.id !== id);
            remainingImages[0].isPrimary = true;
            onChange(remainingImages.map((img, idx) => ({ ...img, order: idx + 1 })));
        } else {
            onChange(images.filter(img => img.id !== id)
                            .map((img, idx) => ({ ...img, order: idx + 1 })));
        }
    };

    // Dosya seçimi tetikle
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Drag & Drop upload area handlers
    const handleUploadAreaDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleUploadAreaDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files);
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700, mb: 3 }}>
                Görsel Yükleme
            </Typography>

            {/* Hata mesajı */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Yükleme alanı */}
            <Box
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    border: '2px dashed #E3F2FD',
                    backgroundColor: '#FAFBFF',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: '#1976D2',
                        backgroundColor: '#F0F7FF'
                    }
                }}
                onClick={triggerFileInput}
                onDragOver={handleUploadAreaDragOver}
                onDrop={handleUploadAreaDrop}
            >
                <CloudUpload sx={{ fontSize: 48, color: '#1976D2', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: '#1976D2' }}>
                    Görselleri Buraya Sürükleyin
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                    veya dosya seçmek için tıklayın
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#9CA3AF' }}>
                    JPG, PNG, WebP formatları desteklenir. Maksimum dosya boyutu: 5MB
                </Typography>
            </Box>

            {/* Gizli file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            />

            {/* Görsel listesi */}
            {images.length > 0 && (
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 3, color: '#1976D2' }}>
                        Yüklenen Görseller ({images.length})
                    </Typography>
                    
                    {/* Primary görsel showcase */}
                    {images.find(img => img.isPrimary) && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, color: '#1976D2', fontWeight: 600 }}>
                                Ana Görsel
                            </Typography>
                            {(() => {
                                const primaryImage = images.find(img => img.isPrimary)!;
                                return (
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                border: '3px solid #FFD700',
                                                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                                                maxWidth: 600,
                                                width: '100%'
                                            }}
                                        >
                                            <img
                                                src={primaryImage.preview}
                                                alt="Ana görsel"
                                                style={{
                                                    width: '100%',
                                                    height: 400,
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Chip
                                                icon={<Star />}
                                                label="Ana Görsel"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    left: 16,
                                                    backgroundColor: '#FFD700',
                                                    color: '#000',
                                                    fontWeight: 600
                                                }}
                                            />
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 16,
                                                right: 16,
                                                display: 'flex',
                                                gap: 1
                                            }}>
                                                <IconButton
                                                    size="small"
                                                    sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                                    onClick={() => setPreviewImage(primaryImage.preview)}
                                                >
                                                    <ZoomIn />
                                                </IconButton>
                                                {images.length > 1 && (
                                                    <IconButton
                                                        size="small"
                                                        sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                                        onClick={() => removeImage(primaryImage.id)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })()}
                        </Box>
                    )}

                    {/* Tüm görseller grid */}
                    <Typography variant="subtitle1" sx={{ mb: 2, color: '#1976D2', fontWeight: 600 }}>
                        Tüm Görseller
                    </Typography>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: 2
                    }}>
                        {images.map((image, index) => (
                            <Box
                                key={image.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                sx={{
                                    position: 'relative',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    cursor: 'grab',
                                    border: image.isPrimary ? '2px solid #FFD700' : '2px solid transparent',
                                    transform: draggedIndex === index ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 4
                                    },
                                    '&:active': {
                                        cursor: 'grabbing'
                                    }
                                }}
                            >
                                <img
                                    src={image.preview}
                                    alt={`Görsel ${image.order}`}
                                    style={{
                                        width: '100%',
                                        height: 200,
                                        objectFit: 'cover'
                                    }}
                                />
                                
                                {/* Overlay controls */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    {/* Üst kontroller */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                        <Chip
                                            size="small"
                                            label={image.order}
                                            sx={{
                                                backgroundColor: 'rgba(25, 118, 210, 0.9)',
                                                color: 'white',
                                                fontWeight: 600,
                                                minWidth: 24
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewImage(image.preview);
                                                }}
                                            >
                                                <ZoomIn fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(image.id);
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    {/* Alt kontroller */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', p: 1 }}>
                                        <IconButton
                                            size="small"
                                            sx={{ 
                                                backgroundColor: image.isPrimary ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255,255,255,0.9)',
                                                color: image.isPrimary ? '#000' : '#666'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPrimary(image.id);
                                            }}
                                        >
                                            {image.isPrimary ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                                        </IconButton>
                                        <DragIndicator sx={{ color: 'rgba(255,255,255,0.8)' }} />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Boş durum */}
            {images.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <ImageIcon sx={{ fontSize: 80, color: '#E0E0E0', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#9CA3AF', mb: 1 }}>
                        Henüz görsel yüklenmedi
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                        Yukarıdaki alana tıklayarak görsel yüklemeye başlayın
                    </Typography>
                </Box>
            )}

            {/* Önizleme dialog */}
            <Dialog
                open={!!previewImage}
                onClose={() => setPreviewImage(null)}
                maxWidth="lg"
                fullWidth
            >
                <DialogContent sx={{ p: 0 }}>
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Önizleme"
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '80vh',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Typography onClick={() => setPreviewImage(null)} sx={{ cursor: 'pointer', p: 1 }}>
                        Kapat
                    </Typography>
                </DialogActions>
            </Dialog>

            {/* İpuçları */}
            {images.length > 0 && (
                <Box sx={{ 
                    mt: 4, 
                    p: 3, 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: 2,
                    border: '1px solid #E3F2FD'
                }}>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                        💡 <strong>İpuçları:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                        • Görselleri sürükleyerek sıralamalarını değiştirebilirsiniz
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                        • Yıldız ikonuna tıklayarak ana görseli belirleyebilirsiniz
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        • Büyütme camı ile görselleri tam boyutta görüntüleyebilirsiniz
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ImagesForm;
