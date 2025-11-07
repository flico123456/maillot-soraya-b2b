
import RequireAuth from "./CheckConnection";
import { ReactNode } from "react";

interface Layout2Props {
    children: ReactNode;
}

export default function Layout({ children }: Layout2Props) {
    return (
        <div>
            <main>{children}</main>
        </div>
    )
}