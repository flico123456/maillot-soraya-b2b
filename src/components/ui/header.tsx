'use client';

import Image from "next/image";
import BurgerMenu from "./icons/burgerMenu";
import Panier from "./icons/panier";
import Account from "./icons/account";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import Connexion from "./icons/connexion";

const Header = () => {

    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null);

    useEffect(() => {
        const storedisLoggedInDistributeur = localStorage.getItem("isLoggedInDistributeur");
        if (storedisLoggedInDistributeur) {
            setIsLoggedIn(storedisLoggedInDistributeur);
        }
    }, []);

    return (
        <header className="w-full py-4">
            <div className="grid grid-cols-3 items-center px-6">
                {/* Burger menu à gauche */}
                <div className="w-10">
                    <BurgerMenu />
                </div>

                {/* Logo centré */}
                <div className="flex justify-center">
                    <Image
                        className="max-xl:w-32 w-96 max-xl:hidden cursor-pointer"
                        alt="Logo"
                        src="/logo-soraya.png"
                        width={500}
                        height={500}
                        onClick={() => router.push('/')}
                    />
                </div>

                {isLoggedIn === "true" ? (
                    <div className="flex items-center justify-end gap-4">
                        {/* Panier à droite */}
                        <div className="w-10 flex justify-end">
                            <Panier />
                        </div>

                        <div className="w-12 flex justify-end">
                            <Account />
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-end">
                        <Connexion />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
