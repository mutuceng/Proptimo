import { ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { Home, People, HomeWork, Category, CurrencyExchange, Settings } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

interface AdminSidebarItemProps {
    name: string;
    path?: string;
}

const AdminSidebarItem = ({ name, path }: AdminSidebarItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const getIcon = (itemName: string) => {
        const itemNameLower = itemName.toLowerCase();
        switch (itemNameLower) {
            case 'anasayfa':
                return <Home fontSize="small" />;
            case 'emlaklar':
                return <HomeWork fontSize="small" />;
            case 'emlak tipleri':
                return <Category fontSize="small" />;
            case 'para birimleri':
                return <CurrencyExchange fontSize="small" />;
            default:
                return null;
        }
    };

    const getPath = (itemName: string) => {
        const itemNameLower = itemName.toLowerCase();
        switch (itemNameLower) {
            case 'anasayfa':
                return '/admin';
            case 'emlaklar':
                return '/admin/real-estates';
            case 'emlak tipleri':
                return '/admin/real-estate-types';
            case 'para birimleri':
                return '/admin/currencies';
            default:
                return '/admin';
        }
    };

    const handleClick = () => {
        if (path) {
            navigate(path);
        } else {
            navigate(getPath(name));
        }
    };

    const isActive = location.pathname === (path || getPath(name));

    return (
        <ListItemButton
            onClick={handleClick}
            sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.25,
                py: 0.75,
                px: 1.25,
                color: isActive ? '#1565C0' : '#1976D2',
                backgroundColor: isActive ? '#E3F2FD' : 'transparent',
                '&:hover': { 
                    bgcolor: '#E3F2FD',
                    color: '#1565C0',
                },
            }}
        >
            <ListItemIcon sx={{ 
                minWidth: 32, 
                color: 'inherit',
            }}>
                {getIcon(name)}
            </ListItemIcon>
            <ListItemText
                primary={name}
                primaryTypographyProps={{ 
                    noWrap: true, 
                    fontSize: 14, 
                    fontWeight: isActive ? 600 : 500,
                    color: 'inherit',
                }}
            />
        </ListItemButton>
    );
};

export default AdminSidebarItem;
