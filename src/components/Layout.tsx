import Accueil from "@/app/accueil/page";
import RequireAuth from "./CheckConnection";
import { ReactNode } from "react";

interface Layout2Props {
    children: ReactNode;
}

export default function Layout({ children }: Layout2Props) {
    return (
        <div>
            <RequireAuth>
                <main>{children}</main>
            </RequireAuth>
        </div>
    )
}