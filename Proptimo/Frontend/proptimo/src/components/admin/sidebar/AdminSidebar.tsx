import { Drawer, Toolbar, Box, List } from "@mui/material";
import AdminSidebarItem from "./AdminSidebarItem";

const drawerWidth = 200;

const AdminSidebar = () => {
    return (
        
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: '#F5F9FF',
                    color: '#1976D2',
                    borderRight: '1px solid',
                    borderColor: '#E3F2FD',
                    mt: '64px', // AppBar height
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List dense disablePadding>
                    {['Anasayfa', 'Emlaklar', 'Emlak Tipleri','Para Birimleri'].map((text) => (
                        <AdminSidebarItem key={text} name={text} />
                    ))}
                </List>
            </Box>
        </Drawer>
        
    )
}

export default AdminSidebar;