import { ReactNode } from "react";
import RequireAuth from "./CheckConnection";
import Header from "./ui/header";
import { UserInfoProvider } from '@/api/Users/getUserInfo';
import Footer from "./Footer";

interface Layout2Props {
    children: ReactNode;
}

export default function Layout2({ children }: Layout2Props) {
    return (
        <div>
            <RequireAuth>
                <UserInfoProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </UserInfoProvider>
            </RequireAuth>
        </div>
    )
}