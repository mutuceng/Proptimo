import AdminNavbar from "../../../components/admin/navbar/AdminNavbar"
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar"

const AdminUserListingPage = () => {
    return (
        <div>
            <AdminSidebar />
            <AdminNavbar />
            <div style={{ padding: 20 }}>
                <h1>Kullanıcı Listesi</h1>
            </div>
        </div>
    )
}

export default AdminUserListingPage;