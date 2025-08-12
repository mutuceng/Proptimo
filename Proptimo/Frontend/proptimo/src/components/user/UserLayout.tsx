import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { UserNavbar } from "./Header/UserNavbar";
import Footer from "./footer/Footer";

interface UserLayoutProps {
    children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh' 
        }}>
            <UserNavbar />
            <Box component="main" sx={{ flex: 1 }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default UserLayout;