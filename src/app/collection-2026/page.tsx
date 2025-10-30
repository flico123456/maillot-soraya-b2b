import Layout2 from "@/components/Layout2";
import Link from "next/link";

export default function Collection2026Page() {
    return (
        <Layout2>
            <div>
                <div>
                    <h1>
                        Bienvenue sur la page de la Collection 2026
                    </h1>
                </div>
                <Link href="/collection-2026/FT2026" className="text-blue-500 hover:underline">
                    Voir le catalogue complet de la Collection 2026 (PDF)
                </Link>
            </div>
        </Layout2>
    )
}
