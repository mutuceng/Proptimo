import { Box, Paper, Typography } from "@mui/material";


const AdminEstateListingPage = () => {
    return (
 

        <Box >
            <Paper elevation={2} sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ color: '#1976D2', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                Emlak Yönetimi
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Emlak listesi burada görüntülenecek.
            </Typography>
            </Paper>
        </Box>
      
    )
}

export default AdminEstateListingPage;