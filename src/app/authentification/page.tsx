"use client"

import Image from "next/image";
import { useState } from "react";
import InputSoraya from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

export default function Authentification() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmitConnexion = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 1. Authentification de l'utilisateur
        const response = await fetch(
            'https://maillotsoraya-conception.com/wp-json/jwt-auth/v1/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            }
        );

        if (!response.ok) {
            setErrorMessage("Adresse e-mail ou mot de passe incorrect.");
            return;
        }

        const data = await response.json();
        const token = data.token;
        const username = data.user_display_name

        // 2. Vérifie si l'utilisateur est dans le rôle "distributeur"
        const roleResponse = await fetch(
            'https://maillotsoraya-conception.com/wp-json/wp/v2/users?roles=distributeur',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!roleResponse.ok) {
            setErrorMessage("Erreur lors de la récupération des rôles.");
            return;
        }

        const distributeurs = await roleResponse.json();

        const isDistributeur = distributeurs.some((user: any) => user.name === username);

        const userId = distributeurs.find((user: any) => user.name === username)?.id;

        if (isDistributeur) {
            localStorage.setItem('isLoggedInDistributeur', 'true');
            localStorage.setItem('id', userId)
            router.push('/accueil');
        } else {
            setErrorMessage("Accès refusé : vous n'êtes pas autorisé à accéder à cette section.");
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="">
                <div className="flex flex-col items-center justify-center">
                    <div className="">
                        <div className="flex justify-center">
                            <Image src={"/logo-soraya.png"} alt="logo-soraya" width={500} height={150} quality={100} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center mb-6">
                            <h2 className="text-2xl font-yanone">Bienvenue dans l'espace B2B de Soraya Swimwear</h2>
                        </div>
                        <div className="flex justify-center">
                            <Link className="text-center max-w-md hover:underline" href="https://maillotsoraya.com">
                                Vous souhaitez rejoindre notre réseau B2B ? Cliquez ici pour vous inscrire
                            </Link>.
                        </div>
                    </div>
                    <div className="flex justify-center rounded-lg p-10">
                        <form onSubmit={handleSubmitConnexion} className="max-w-sm mx-auto">
                            <div className="mb-4">
                                <label htmlFor="email" className="block">
                                    Adresse e-mail
                                </label>
                                <InputSoraya type="email" id="email" required value={email} placeholder="Adresse e-mail" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block">
                                    Mot de passe
                                </label>
                                <InputSoraya type="password" id="password" required value={password} placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="text-sm p-2 mt-1 font-semibold border rounded-lg border-slate-500 w-80 text-white bg-black cursor-pointer hover:bg-zinc-700"
                                >
                                    Connexion
                                </button>
                            </div>
                            <div className="flex justify-center mt-4">
                                <Link className="text-center max-w-md hover:underline" href="https://maillotsoraya.com">
                                    En savoir plus sur Soraya Swimwear
                                </Link>.
                            </div>
                        </form>
                    </div>

                    {/* ✅ Alerte conditionnelle */}
                    {errorMessage && (
                        <div className="fixed bottom-6 left-6 w-80 z-50">
                            <Alert variant="default" className="bg-red-100 border-red-500 text-red-700">
                                <AlertCircleIcon className="h-5 w-5" />
                                <AlertTitle className="text-red-700">Erreur de connexion</AlertTitle>
                                <AlertDescription>
                                    {errorMessage}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
