import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Logout } from "@mui/icons-material";

const AdminNavbar = () => {
    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log("Logout clicked");
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                bgcolor: '#E3F2FD',
                color: '#1976D2',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        color: '#1565C0',
                        fontFamily: 'Poppins, "Segoe UI", Arial, sans-serif',
                        letterSpacing: 0.3,
                    }}
                >
                    Proptimo Admin
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                            },
                        }}
                    >
                        Çıkış Yap
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AdminNavbar;
