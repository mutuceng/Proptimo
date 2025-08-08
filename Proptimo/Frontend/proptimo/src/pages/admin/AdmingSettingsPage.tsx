import AdminNavbar from "../../components/admin/navbar/AdminNavbar"
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar"

const AdminSettingsPage = () => {
    return (
        <div>
            <AdminSidebar />
            <AdminNavbar />
            <div style={{ padding: 20 }}>
                <h1>Ayarlar</h1>
            </div>
        </div>
    )
}

export default AdminSettingsPage;