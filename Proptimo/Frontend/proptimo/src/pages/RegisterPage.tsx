import { Container, Typography, TextField, Box, Button, Link, InputAdornment, IconButton, Paper, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import { useRegisterMutation } from "../features/api/userApi";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Form state'leri
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validasyonlar
        if (!userName.trim() || !name.trim() || !surname.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !birthDate) {
            setError(t('auth.register.fillFields'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('auth.register.passwordMismatch'));
            return;
        }

        if (password.length < 6) {
            setError(t('auth.register.passwordLength'));
            return;
        }

        // Email validasyonu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(t('auth.register.invalidEmail'));
            return;
        }

        try {
            const registerData = {
                userName,
                name,
                surname,
                email,
                password,
                birthDate: new Date(birthDate),
                phoneNumber: phoneNumber.trim() || undefined
            };

            const user = await register(registerData).unwrap();
            console.log('Başarılı kayıt:', user);
            alert(t('auth.register.success'));
            navigate('/login');
        } catch (error: any) {
            console.error('Kayıt hatası:', error);
            setError(error.data?.message || t('auth.register.error'));
        }
    };

    return (
        <div>
            {/* Register Section */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    alignItems: 'center', 
                    minHeight: '70vh',
                    justifyContent: 'center'
                }}>
                    {/* Sol Taraf - Görsel */}
                    <Box sx={{ 
                        flex: { xs: 'none', md: '1' },
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center', 
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        minHeight: '500px'
                    }}>
                        <Box sx={{
                            width: '100%',
                            maxWidth: 600,
                            height: 500,
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
                                    {t('auth.register.heroTitle')}
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: '#c5cdd4',
                                    maxWidth: 400,
                                    lineHeight: 1.8,
                                    fontSize: '1.6rem',
                                    fontWeight: 1000,   
                                    textShadow: '6 6px 10px rgba(12, 15, 19, 0.2)'
                                }}>
                                    {t('auth.register.heroSubtitle')}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Sağ Taraf - Form */}
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
                            {t('auth.register.title')}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                            mb: 4, 
                            color: '#666',
                            lineHeight: 1.6
                        }}>
                            {t('auth.register.subtitle')}
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                                {error}
                            </Alert>
                        )}
                        
                        {/* Username */}
                        <TextField
                            fullWidth
                            label={t('auth.register.username')}
                            variant="outlined"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder={t('auth.register.usernamePlaceholder')}
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

                        {/* Ad ve Soyad - Yan Yana */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <TextField
                                fullWidth
                                label={t('auth.register.firstName')}
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('auth.register.firstNamePlaceholder')}
                                sx={{ 
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
                                label={t('auth.register.lastName')}
                                variant="outlined"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder={t('auth.register.lastNamePlaceholder')}
                                sx={{ 
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
                        </Box>

                        <TextField
                            fullWidth
                            label={t('auth.register.phoneNumber')}
                            variant="outlined"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder={t('auth.register.phoneNumberPlaceholder')}
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
                            label={t('auth.register.email')}
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('auth.register.emailPlaceholder')}
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
                            label={t('auth.register.birthDate')}
                            variant="outlined"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
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
                            label={t('auth.register.password')}
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth.register.passwordPlaceholder')}
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

                        <TextField
                            fullWidth
                            label={t('auth.register.confirmPassword')}
                            type={showConfirmPassword ? "text" : "password"}
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
                                            onClick={handleToggleConfirmPassword}
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
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleRegister}
                            disabled={isLoading}
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
                                },
                                '&:disabled': {
                                    backgroundColor: '#ccc',
                                    transform: 'none',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            {isLoading ? t('auth.register.loading') : t('auth.register.button')}
                        </Button>



                        <Typography variant="body2" sx={{ color: '#666' }}>
                            {t('auth.register.haveAccount')} <Link href="/login" sx={{ color: '#1976d2', fontWeight: 600 }}>{t('auth.register.signIn')}</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default RegisterPage;