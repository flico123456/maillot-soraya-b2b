'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { useApiData } from "@/api/Users/getUserInfo";

interface CartItem {
    sizeId: string;
    id: string;
    id_product: number;
    name: string;
    quantity: number;
    images: { src: string }[];
    image: string;
    price: number;
    size: string;
    sku: number;
}

interface CartItem {
    sizeId: string;
    id: string;
    id_product: number;
    name: string;
    quantity: number;
    images: { src: string }[];
    image: string;
    price: number;
    size: string;
    sku: number;
}

export default function DevisFR() {
    const apiData = useApiData();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [priceShipping, setPriceShipping] = useState<number | null>(null);

    useEffect(() => {
        const storedPrice = localStorage.getItem("shippingCost");
        if (storedPrice) {
            setPriceShipping(parseFloat(storedPrice));
        }
    }, []);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const [formData, setFormData] = useState({
        shippingName: '',
        shippingSurname: '',
        shippingAddress: '',
        shippingCity: '',
        shippingPostalCode: '',
        shippingCountry: '',
        phone: '',
        raison_sociale: '',
        siret: '',
        vatNumber: '',
    });

    useEffect(() => {
        if (apiData) {
            setFormData({
                shippingName: apiData.shipping?.first_name || '',
                shippingSurname: apiData.shipping?.last_name || '',
                shippingAddress: apiData.shipping?.address_1 || '',
                shippingCity: apiData.shipping?.city || '',
                shippingPostalCode: apiData.shipping?.postcode || '',
                shippingCountry: apiData.shipping?.country || '',
                phone: apiData.billing.phone || '',
                raison_sociale: apiData.raison_sociale || '',
                siret: apiData.siret || '',
                vatNumber: apiData.tva_intracom || '',
            });
        }
    }, [apiData]);

    return (
        <div className="w-full max-w-3xl">
            <Card className="w-full max-w-2xl p-4 rounded-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl font-medium">Visualisation de votre devis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='border p-4'>
                        <div className='flex justify-center mb-4'>
                            <Image src="/logo-soraya.png" alt="Logo Soraya" width={230} height={150} />
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                            {/* Bloc gauche */}
                            <div className="md:w-1/2 w-full flex justify-center">
                                <div className='text-left mb-4'>
                                    <h2 className='text-xs font-semibold'>75 Rue de Richelieu</h2>
                                    <p className='text-xs font-semibold'>FR72531062701</p>
                                    <p className='text-xs font-semibold'>75002 Paris</p>
                                    <p className='text-xs'>au capital de 3 000,00 €</p>
                                    <p className='text-xs'>SIRET : 531 062 701 000 28</p>
                                </div>
                            </div>
                            {/* Bloc droite */}
                            <div className="md:w-1/2 w-full flex justify-center">
                                <div className='text-left mb-4'>
                                    <h3 className='text-xs'>Tél : 04 42 57 34 09</h3>
                                    <p className='text-xs'>Fax : 04 13 57 01 66</p>
                                    <p className='text-xs'>e-mail : bureau@maillot-soraya.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end items-center md:flex-row mt-10">
                            {/* Bloc SOLO */}
                            <div className="md:w-1/2 w-full flex justify-center">
                                <div className='text-left mb-4'>
                                    <h2 className='text-xs'>{formData.raison_sociale}</h2>
                                    <p className='text-xs'>{formData.siret}</p>
                                    <p className='text-xs'>{formData.vatNumber}</p>
                                    <p className='text-xs'>{formData.shippingAddress}</p>
                                    <p className='text-xs'>{formData.shippingPostalCode} {formData.shippingCity}</p>
                                    <p className='text-xs'>{formData.shippingCountry}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <table className="min-w-full border border-gray-300 text-xs">
                                <thead>
                                    <tr className="bg-color-fond">
                                        <th className="border px-2 py-1 font-semibold w-24">Référence</th>
                                        <th className="border px-2 py-1 font-semibold w-2/5">Nom du Produit</th>
                                        <th className="border px-1 py-1 font-semibold w-12 text-center">Quantité</th>
                                        <th className="border px-1 py-1 font-semibold w-20 text-right">P.U HT</th>
                                        <th className="border px-1 py-1 font-semibold w-24 text-right">Montant HT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, index) => (
                                        <tr key={index} className="align-middle" style={{ height: '36px' }}>
                                            <td className="border px-2 py-1">{item.sku}</td>
                                            <td className="border px-2 py-1 w-2/5">{item.name}</td>
                                            <td className="border px-1 py-1 text-center w-12">{item.quantity}</td>
                                            <td className="border px-1 py-1 text-right w-20">{item.price.toFixed(2)} €</td>
                                            <td className="border px-1 py-1 text-right w-24">{(item.price * item.quantity).toFixed(2)} €</td>
                                        </tr>
                                    ))}
                                    <tr className="align-middle" style={{ height: '36px' }}>
                                        <td className="border px-2 py-1"></td>
                                        <td className="border px-2 py-1 w-2/5 font-semibold">Livraison</td>
                                        <td className="border px-1 py-1 text-center w-12">1</td>
                                        <td className="border px-1 py-1 text-right w-20">{priceShipping?.toFixed(2)} €</td>
                                        <td className="border px-1 py-1 text-right w-24">{priceShipping?.toFixed(2)} €</td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* Tableau des totaux en bas à droite */}
                            <div className="flex justify-end mt-4">
                                <table className="text-xs border border-gray-300 min-w-[220px]">
                                    <tbody>
                                        <tr>
                                            <td className="border px-2 py-1 text-right font-semibold w-32 bg-color-fond">Total HT</td>
                                            <td className="border px-2 py-1 text-right font-semibold w-24">
                                                {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} €
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border px-2 py-1 text-right font-semibold bg-color-fond">TVA (20%)</td>
                                            <td className="border px-2 py-1 text-right font-semibold">
                                                {(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.2).toFixed(2)} €
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border px-2 py-1 text-right font-semibold bg-color-fond">Total TTC</td>
                                            <td className="border px-2 py-1 text-right font-semibold">
                                                {(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.2).toFixed(2)} €
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}