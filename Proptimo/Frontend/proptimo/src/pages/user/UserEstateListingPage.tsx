import React from "react";
import { Box, Container, Typography } from "@mui/material";
import ListingFilterBox from "../../components/user/Listing/ListingFilterBox";

const UserEstateListingPage = () => {
    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: 'calc(100vh - 64px)', // Navbar yüksekliğini çıkar
            backgroundColor: '#f8f9fa'
        }}>
            {/* Sol Taraf - Filter Box */}
            <Box sx={{ 
                width: 320,
                flexShrink: 0,
                p: 2,
                backgroundColor: 'transparent'
            }}>
                <Box sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                    height: '100%'
                }}>
                    <ListingFilterBox />
                </Box>
            </Box>

            {/* Sağ Taraf - İçerik Alanı */}
            <Box sx={{ 
                flex: 1,
                p: 3,
                overflowY: 'auto'
            }}>
                <Container maxWidth="xl" sx={{ p: 0 }}>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 600, 
                        color: '#1976D2',
                        mb: 3 
                    }}>
                        Emlak Listesi
                    </Typography>
                    
                    {/* Buraya emlak listesi gelecek */}
                    <Box sx={{ 
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        minHeight: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography variant="h6" sx={{ color: '#666' }}>
                            Emlak listesi burada görüntülenecek
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default UserEstateListingPage;