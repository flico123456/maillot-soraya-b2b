'use client';

import Image from "next/image";
import BurgerMenu from "./icons/burgerMenu";
import Panier from "./icons/panier";
import Account from "./icons/account";
import { useRouter } from "next/navigation";
import Devise from "./icons/devise";

const Header = () => {

    const router = useRouter();

    return (
        <header className="w-full py-4">
            <div className="flex items-center justify-between px-6">
                {/* Burger menu à gauche */}
                <div className="w-10">
                    <BurgerMenu />
                </div>

                {/* Logo centré */}
                <div className="flex justify-center flex-1">
                    <Image className='max-xl:w-32 w-96 max-xl:hidden cursor-pointer' alt="Logo" src="/logo-soraya.png" width={500} height={500} onClick={() => router.push('/')}/>
                </div>

                <div className="flex items-center ">
                    <Devise />
                </div>

                {/* Panier à droite */}
                <div className="w-10 flex justify-end">
                    <Panier />
                </div>

                <div className="w-12 flex justify-end">
                    <Account />
                </div>
            </div>
        </header>
    );
};

export default Header;
