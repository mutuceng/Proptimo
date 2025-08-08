import type { ReactNode } from 'react';
import AdminSidebar from './sidebar/AdminSidebar';
import AdminNavbar from './navbar/AdminNavbar';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <>
        
        <AdminNavbar />
        <div style={{ display: 'flex', margin: 0, width: '100%' }}>
        <AdminSidebar />
            <main style={{ 
                flexGrow: 1, 
                marginTop: '64px',
                padding: '16px',
                minHeight: '100vh',
                backgroundColor: '#F8FAFC',
                width: '100%'
            }}>
                {children}
            </main>
        </div>
        </>
    );
};

export default AdminLayout;
