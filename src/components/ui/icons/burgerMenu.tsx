'use client';

import { SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('main'); // Contrôle du menu principal ou sous-menu actif
    const router = useRouter();

    // Bloquer le scroll quand le menu est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setActiveMenu('main'); // Réinitialiser au menu principal quand on ferme
    };

    const openSubMenu = (menuName: SetStateAction<string>) => {
        setActiveMenu(menuName); // Ouvre le sous-menu spécifié
    };

    const goBack = () => {
        setActiveMenu('main'); // Retourne au menu principal
    };

    const isActive = activeMenu !== 'main';

    const [login, setLogin] = useState<string | null>(null);

    useEffect(() => {
        // Vérifie si on est côté client avant d'accéder à localStorage
        if (typeof window !== 'undefined') {
            const storedLogin = localStorage.getItem('isLoggedIn');
            setLogin(storedLogin);
        }
    }, []);

    const handleClickConnect = () => {
        if (login) {
            router.push("/account");
        } else {
            router.push("/connexion");
        }
    };

    return (
        <div>
            {/* Bouton pour ouvrir le burger menu */}
            <div onClick={toggleMenu}>
                <Image
                    className="w-5 mx-3 md:mx-3 cursor-pointer"
                    alt="img-bag"
                    src="/icons/menu.png"
                    width={20}
                    height={20}
                />
            </div>

            {/* Overlay avec flou et menu burger animé */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-lg z-40 transition-opacity duration-700 ${isOpen ? 'opacity-100 visible' : 'opacity-0 delay-700 invisible'
                    }`}
                onClick={toggleMenu}
            >
                {/* Menu burger avec animation d'entrée et de sortie */}
                <div
                    className={`fixed top-4 left-0 mt-4 mb-4 mx-4 h-[94%] w-[80%] max-xl:w-[92%] max-w-md bg-white z-50 rounded-lg p-8 overflow-y-auto transform transition-transform duration-700 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Bouton pour fermer le menu avec l'icône en haut à gauche */}
                    <div className="absolute top-4 left-4 cursor-pointer" onClick={toggleMenu}>
                        <Image
                            src="/icons/close-icon.svg"
                            alt="Close menu"
                            width={30}
                            height={30}
                        />
                    </div>

                    <div className="flex justify-center mt-10">
                        <div className="flex justify-center w-96 h-0.5 bg-gris"></div>
                    </div>

                    {/* Menu Principal */}
                    {/* Menu Principal */}
                    {activeMenu === 'main' && (
                        <div className='mt-10'>
                            <ul className="space-y-4 text-sm font-normal">
                                <div className='flex justify-start mt-8'>
                                    <h1
                                        onClick={() => router.push('/nouveautes')}
                                        className="relative inline-block cursor-pointer text-color-soraya-4 font-normal font-inter"
                                    >
                                        Nouveautés 2025
                                    </h1>
                                </div>
                                {['maillot', 'beachwear', 'last'].map((menu, index) => (
                                    <li
                                        key={index}
                                        className={`flex justify-between items-center cursor-pointer hover:text-color-black-soraya font-normal ${isActive ? 'text-gray-400' : 'text-black'
                                            }`}
                                        onClick={() => openSubMenu(menu)}
                                    >
                                        <span className="font-normal">
                                            {menu === 'maillot' && 'Maillot de bain'}
                                            {menu === 'beachwear' && 'Beachwear'}
                                            {menu === 'last' && 'Ancienne collection'}
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                            ></path>
                                        </svg>
                                    </li>
                                ))}
                                <div className='flex justify-center'>
                                    <Image
                                        className='mt-10'
                                        src="/header/cover-burger-menu.jpg"
                                        alt='cover-burger-menu'
                                        width={500}
                                        height={500}
                                    />
                                </div>
                            </ul>
                        </div>
                    )}

                    {/* Sous-menu pour "Last Chance" */}
                    {activeMenu === 'last' && (
                        <div className='overflow-hidden'>
                            <div className="flex items-center cursor-pointer mt-5" onClick={goBack}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                <h1 className="text-lg">Last chance</h1>
                            </div>
                            <div className="flex justify-center mt-5">
                                <div className="flex justify-center w-96 h-0.5 bg-gris"></div>
                            </div>
                            <ul className="space-y-4 mt-10 ml-5">
                            </ul>
                            <div className='mt-10 flex justify-center'>
                                <Image
                                    src="/cover-last.jpg"
                                    alt="arrow-right"
                                    width={500}
                                    height={300}
                                />
                            </div>
                        </div>
                    )}

                    {/* Sous-menu pour "Maillot de Bain" */}
                    {activeMenu === 'maillot' && (
                        <div className='overflow-hidden'>
                            <div className="flex items-center cursor-pointer mt-5" onClick={goBack}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                <h1 className="text-lg">Maillot de bain</h1>
                            </div>
                            <div className="flex justify-center mt-5">
                                <div className="flex justify-center w-96 h-0.5 bg-gris"></div>
                            </div>
                            <ul className="space-y-4 mt-10 ml-5">
                                <li className='font-inter text-sm flex justify-start'>
                                    <Link href="/secret-by-soraya">Collection croisière Secret By Soraya</Link>
                                </li>
                                <li className='flex items-center font-inter text-sm ' onClick={() => toggleMenu()}>
                                    <Link href="/soraya-saint-barth">Collection capsule Soraya Saint-Barth</Link>
                                </li>
                                <div className="font-inter text-xl uppercase flex">
                                    <Link href="/maillots-de-bain-1-piece">Maillots de bain 1 pièce</Link>
                                </div>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                    <Link href="/maillots-de-bain-1-piece-gainant">Maillot de bain gainant</Link>
                                </li>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                    <Link href="/maillots-de-bain-1-piece-bustier">Maillot de bain bustier</Link>
                                </li>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                    <Link href="/maillots-de-bain-trikinis">Maillot de bain trikinis</Link>
                                </li>
                                <div className="font-inter text-xl uppercase flex">
                                    <Link href="/maillots-de-bain-2-pieces">Maillots de bain 2 pièces</Link>
                                </div>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                    <Link href="/maillots-de-bain-triangle">Maillot de bain triangle</Link>
                                </li>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                    <Link href="/maillots-de-bain-emboitant">Maillot de bain emboitant</Link>
                                </li>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                    <Link href="/maillots-de-bain-echancre">Maillot de bain échancré</Link>
                                </li>
                            </ul>
                            <div className='mt-10 flex justify-center'>
                                <Image
                                    src="/header/cover-maillot-de-bain.jpg"
                                    alt="cover-maillot-de-bain"
                                    width={500}
                                    height={300}
                                />
                            </div>
                        </div>
                    )}

                    {/* Sous-menu pour "Beachwear" */}
                    {activeMenu === 'beachwear' && (
                        <div className=''>
                            <div className="flex items-center cursor-pointer mt-5" onClick={goBack}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                <h1 className="text-lg">Beachwear</h1>
                            </div>
                            <div className="flex justify-center mt-5">
                                <div className="flex justify-center w-96 h-0.5 bg-gris"></div>
                            </div>
                            <ul className="space-y-4 mt-10 ml-5">
                                <div className="font-inter text-xl uppercase flex">
                                        <Link href="/vetements-de-plage">Vêtements de plage</Link>
                                </div>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                        <Link href="/tuniques-de-plage-pareos">Tuniques de plage & paréos</Link>
                                </li>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                        <Link href="/pantalons-plage">Pantalons de plage</Link>
                                </li>
                                <li className='flex items-center font-intertext-sm' onClick={() => toggleMenu()}>
                                        <Link href="/chemises-de-plage">Nos chemises</Link>
                                </li>
                                <li className='flex items-center font-inter text-sm' onClick={() => toggleMenu()}>
                                        <Link href="/robes-de-plage-jupes-de-plage">Robes et jupes de plage</Link>
                                </li>
                            </ul>
                            <div className='mt-10 flex justify-center'>
                                <Image
                                    src="/header/cover-beachwear.jpg"
                                    alt="arrow-right"
                                    width={500}
                                    height={300}
                                />
                            </div>
                        </div>
                    )}

                    {/* Sous-menu pour "Promotions" */}
                    {activeMenu === 'sbys' && (
                        <div className=''>
                            <div className="flex items-center cursor-pointer mt-5" onClick={goBack}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                <h1 className="text-lg">Collection SbyS</h1>
                            </div>
                            <div className="flex justify-center mt-5">
                                <div className="flex justify-center w-96 h-0.5 bg-gris"></div>
                            </div>
                            <ul className="space-y-4 mt-10 ml-5">
                            </ul>
                            <div className='mt-10 flex justify-center'>
                                <Image
                                    src="/sbys-couverture.jpg"
                                    alt="couverture-sbys"
                                    width={500}
                                    height={300}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
