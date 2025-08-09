import { Container, Typography, TextField, Box, Button, Link, InputAdornment, IconButton, Paper } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            {/* Login Section */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    alignItems: 'center', 
                    minHeight: '70vh',
                    justifyContent: 'center'
                }}>
                    {/* Sol Taraf - Form */}
                    <Box sx={{ 
                        flex: { xs: 'none', md: '1' },
                        maxWidth: 400, 
                        width: '100%',
                        mx: 'auto',
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            mb: 4,
                            color: '#1a1a1a'
                        }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body1" sx={{ 
                            mb: 4, 
                            color: '#666',
                            lineHeight: 1.6
                        }}>
                            Sign in to your account to continue your journey with Proptimo
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="Username or Email"
                            variant="outlined"
                            placeholder="Enter your username or email"
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                                        transform: 'translateY(-1px)'
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.15)',
                                        borderColor: '#1976d2'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#666',
                                    fontWeight: 500,
                                    '&.Mui-focused': {
                                        color: '#1976d2'
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '16px 20px',
                                    fontSize: '1rem',
                                    fontWeight: 500
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            placeholder="Enter your password"
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                                        transform: 'translateY(-1px)'
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.15)',
                                        borderColor: '#1976d2'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#666',
                                    fontWeight: 500,
                                    '&.Mui-focused': {
                                        color: '#1976d2'
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '16px 20px',
                                    fontSize: '1rem',
                                    fontWeight: 500
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePassword}
                                            edge="end"
                                            sx={{ 
                                                color: '#666',
                                                marginRight: '8px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                    color: '#1976d2'
                                                }
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mb: 2, 
                                backgroundColor: '#1976d2', 
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                    transform: 'translateY(-2px)'
                                },
                                '&:active': {
                                    transform: 'translateY(0px)'
                                }
                            }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ 
                                mb: 3, 
                                color: '#666', 
                                borderColor: '#ddd',
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: '12px',
                                textTransform: 'none',
                                borderWidth: '2px',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    borderColor: '#1976d2', 
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                    color: '#1976d2',
                                    boxShadow: '0 4px 16px rgba(25, 118, 210, 0.15)',
                                    transform: 'translateY(-1px)'
                                },
                                '&:active': {
                                    transform: 'translateY(0px)'
                                }
                            }}
                        >
                            Connect with Google
                        </Button>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            Don't have an account? <Link href="#" sx={{ color: '#1976d2', fontWeight: 600 }}>Sign up</Link>
                        </Typography>
                    </Box>

                    {/* Sağ Taraf - Görsel */}
                    <Box sx={{ 
                        flex: { xs: 'none', md: '1' },
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center', 
                        alignItems: 'center',
                        height: '100%',
                        width: '100%'
                    }}>
                        <Box sx={{
                            width: '100%',
                            maxWidth: 500,
                            height: 450,
                            position: 'relative',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)',
                                zIndex: 1
                            }
                        }}>
                            {/* Real Estate Görseli */}
                            <img 
                                src="/realestate.jpg" 
                                alt="Real Estate" 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'brightness(0.6)',
                                    opacity: 0.85
                                }}
                            />
                            
                            {/* Content Overlay */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                p: 4,
                                color: 'white'
                            }}>
                                <Typography variant="h3" sx={{ 
                                    fontWeight: 1000, 
                                    mb: 3,
                                    color: '#c5cdd4',
                                    fontSize: '3rem',
                                    letterSpacing: '0.5px',
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    textShadow: '6px 6px 12px rgba(0, 0, 0, 0.3)',
                                    lineHeight: 1.2
                                }}>
                                    Find Your Dream Home
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: '#c5cdd4',
                                    maxWidth: 400,
                                    lineHeight: 1.8,
                                    fontSize: '1.6rem',
                                    fontWeight: 1000,
                                    fontFamily: 'Roboto',
                                    textShadow: '6 6px 10px rgba(12, 15, 19, 0.2)'
                                }}>
                                    Discover the perfect property that matches your lifestyle and budget
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default LoginPage;