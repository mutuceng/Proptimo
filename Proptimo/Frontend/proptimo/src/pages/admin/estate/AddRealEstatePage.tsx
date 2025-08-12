import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { ProgressSteps } from "../../../components/admin/realEstate/ProgressSteps";
import { useEffect, useState, type ChangeEvent } from "react";
import { useGetAllRealEstateTypesQuery } from "../../../features/api/realEstateTypeApi";
import type { RealEstateType } from "../../../features/api/types/realEstateType";
import { useNavigate } from "react-router-dom";
import { useCreateRealEstateMutation } from "../../../features/api/realEstateApi";

const stateOptions = [
    { value: 0, label: "Yayında" },
    { value: 1, label: "Kiralandı" },
    { value: 2, label: "Satıldı" },
    { value: 3, label: "Süresi Dolmuş" },
    { value: 4, label: "Gizli" }
];
  
const listingTypeOptions = [
    { value: 0, label: "Satılık" },
    { value: 1, label: "Kiralık" },
    { value: 2, label: "Günlük Kiralık" }
];

const steps = [
    "Emlak Bilgileri",
    "Özellik Bilgileri",
    "Adres Bilgileri",
    "Görseller"
];

interface RealEstateFormData {
    title: string;
    description: string;
    startDate: Date; // ISO yyyy-mm-dd
    endDate: Date;
    price: number;
    listingType: number | 0;
    state: number | 0;
    realEstateTypeId: string;
}

const AddRealEstatePage = () => {
    const { data, isLoading, error } = useGetAllRealEstateTypesQuery();

    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<RealEstateFormData>({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        price: 0,
        listingType: 0,
        state: 0,
        realEstateTypeId: "",
    });

    const [createRealEstate, {isLoading: isCreating}] = useCreateRealEstateMutation();

    const realEstateTypes: RealEstateType[] = Array.isArray(data) ? data : [];


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "price") {
            const parsed = value === "" ? 0 : Number(value);
            setFormData((prev) => ({ ...prev, price: Number.isNaN(parsed) ? 0 : parsed }));
            return;
        }
        if (name === "listingType" || name === "state") {
            const parsed = value === "" ? 0 : Number(value);
            setFormData((prev) => ({ ...prev, [name]: Number.isNaN(parsed) ? 0 : parsed }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isValid = formData.title.trim() !== "" && 
            formData.description.trim() !== "" && 
            formData.price > 0 && 
            formData.realEstateTypeId !== "" &&
            new Date(formData.endDate) >= new Date(formData.startDate);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!isValid) {
            console.log("Form is not valid");
            return;
        }
        
        
        try {
            const now = new Date();
            const payload = {
                ...formData,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                createdAt: now,
                updatedAt: now,
            };

            const response = await createRealEstate(payload).unwrap();

            setFormData({
                title: "",
                description: "",
                startDate: new Date(),
                endDate: new Date(),
                price: 0,
                listingType: 0,
                state: 0,
                realEstateTypeId: "",
            });

            // Navigate işlemini try-catch ile sarmalayalım
            try {
                await navigate(`/admin/real-estates/create/features/${response.id}/${response.realEstateTypeId}`);
                console.log("Navigation successful");
            } catch (navError) {
                console.error("Navigation error:", navError);
                // Fallback navigation
                navigate("/admin/real-estates");
            }

        } catch (err) {
            console.error("Emlak oluşturma hatası:", err);
            console.error("Hata detayı:", JSON.stringify(err, null, 2));
            
            alert("Emlak oluşturulurken hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    // Form validasyonu


    return (
        <Box sx={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)", borderRadius: 3, display: 'flex', justifyContent: 'center', overflowX: 'hidden', overflowY: 'hidden' }}>
            <Box sx={{ width: '100%', maxWidth: 1040 }}>
                <ProgressSteps steps={steps} activeStep={activeStep} />

                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(25, 118, 210, 0.12)",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 3,
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "#1976D2", fontWeight: 700 }}>
                            Emlak Bilgileri
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6B7280" }}>
                            Lütfen zorunlu alanları doldurun
                        </Typography>
                    </Box>

                    <Box
                        component="form" onSubmit={handleSubmit}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                            gap: 2,
                        }}
                    >
                        <TextField
                            name="title"
                            label="Emlak Başlığı"
                            value={formData.title}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            name="description"
                            label="Açıklama"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            required
                            multiline
                            rows={6}
                            size="small"
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: 3 },
                                gridColumn: '1 / -1' // Tam genişlik için
                            }}
                        />

                        <TextField
                            name="price"
                            label="Fiyat"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            InputProps={{ inputProps: { min: 0 } }}
                        />

                        <TextField
                            name="startDate"
                            label="Başlangıç Tarihi"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            name="endDate"
                            label="Bitiş Tarihi"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            error={Boolean(formData.endDate) && Boolean(formData.startDate) && new Date(formData.endDate) < new Date(formData.startDate)}
                            helperText={
                                Boolean(formData.endDate) && Boolean(formData.startDate) && new Date(formData.endDate) < new Date(formData.startDate)
                                    ? "Bitiş tarihi başlangıç tarihinden önce olamaz"
                                    : ""
                            }
                        />

                        <TextField
                            name="listingType"
                            label="Listeleme Türü"
                            select
                            value={formData.listingType}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            InputLabelProps={{ shrink: true }}
                        >
                            {listingTypeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            name="state"
                            label="Durum"
                            select
                            value={formData.state}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            InputLabelProps={{ shrink: true }}
                        >
                            {stateOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            name="realEstateTypeId"
                            label="Emlak Tipi"
                            select
                            value={formData.realEstateTypeId || ""}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, realEstateTypeId: e.target.value }));
                            }}
                            fullWidth
                            required
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            SelectProps={{
                                displayEmpty: true,
                                renderValue: (value) => {
                                    console.log("RenderValue gelen value:", value);
                                    console.log("Tip:", typeof value);
                                    console.log("RealEstateTypes:", realEstateTypes);
                                    
                                    if (!value || value === "") return 'Seçiniz';
                                    
                                    const found = realEstateTypes.find((t) => String(t.id) === String(value));
                                    console.log("Bulunan:", found);
                                    return found ? found.name : 'Seçiniz';
                                },
                            }}
                            disabled={isLoading}
                            InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem value="">
                                {isLoading ? 'Yükleniyor...' : 'Seçiniz'}
                            </MenuItem>
                            {realEstateTypes.map((t) => (
                                <MenuItem key={t.id} value={String(t.id)}>
                                    {t.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", mt: 4 }}>
                            <Button
                                variant="contained"
                                disabled={!isValid || isCreating}
                                onClick={handleSubmit}
                                sx={{
                                    px: 2.25,
                                    py: 0.75,
                                    borderRadius: 3,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    boxShadow: "0 6px 20px rgba(25, 118, 210, 0.25)",
                                    background: isValid
                                        ? "linear-gradient(90deg, #1976D2 0%, #1E88E5 100%)"
                                        : "#90CAF9",
                                    '&:hover': {
                                        background: "linear-gradient(90deg, #1565C0 0%, #1976D2 100%)",
                                    },
                                }}
                            >
                                {isCreating ? "Kaydediliyor..." : "İleri"}
                            </Button>
                        </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default AddRealEstatePage;