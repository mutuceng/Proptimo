import type { ReactNode } from "react";
import { UserNavbar } from "./Header/UserNavbar";

interface UserLayoutProps {
    children: ReactNode;
}
const UserLayout = ({ children }: UserLayoutProps) => {
    return (
        <>
        <UserNavbar />
        </>
    )
}

export default UserLayout;