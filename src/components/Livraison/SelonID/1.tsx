'use client';

import React, { useEffect, useState } from 'react';
import { useApiData } from "@/api/Users/getUserInfo";
import { useRouter } from 'next/navigation';
import { calculateColis, calculateKilo } from '../calcul_livraison';
import { getPriceForWeightFromMethod45 } from '../shipping_chrono_fr';
import Image from 'next/image';
import { Info } from "lucide-react";
import { isCountryInSchengen } from '@/api/CheckUE';
import { getZoneId } from '@/api/getIDZone';


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

type MaybeCartItem = Partial<CartItem> & { quantity?: number };

const readCart = (): MaybeCartItem[] => {
    try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const getTotalQuantity = (items: MaybeCartItem[]) =>
    items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);

export default function ID1() {

    const apiData = useApiData();
    const router = useRouter();
    const [totalQty, setTotalQty] = useState<number>(0);
    const [takeDelivery, setTakeDelivery] = useState(false)
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));
    }, []);

    const [formData, setFormData] = useState({
        shippingName: '',
        shippingSurname: '',
        shippingAddress: '',
        shippingCity: '',
        shippingPostalCode: '',
        shippingCountry: '',
        shippingPhone: '',
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
                shippingPhone: apiData.shipping?.phone || '',
            });
        }
    }, [apiData]);

    // hydrate total quantité + écoute des updates
    useEffect(() => {
        const refreshQty = () => setTotalQty(getTotalQuantity(readCart()));
        refreshQty();

        // Même onglet : si ton code d'ajout/suppression du panier déclenche cet event
        document.addEventListener('cart:updated', refreshQty);

        // Autres onglets/fenêtres : via localStorage
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'cart') refreshQty();
        };
        window.addEventListener('storage', onStorage);

        return () => {
            document.removeEventListener('cart:updated', refreshQty);
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    const allEmpty = Object.values(formData).every((v) => !v || v.toString().trim() === '');

    // Utilise la quantité totale pour calculer le prix au kilo
    const totalWeight = calculateKilo(totalQty);

    const colis = calculateColis(totalWeight);

    const [shippingMethods, setShippingMethods] = useState();

    useEffect(() => {
        const fetchShippingMethods = async () => {
            try {
                const methodsResponse = await fetch(
                    `https://maillotsoraya-conception.com/wp-json/wc/v3/shipping/zones/1/methods`,
                    {
                        headers: {
                            Authorization: 'Basic ' + btoa('ck_2a1fa890ddee2ebc1568c314734f51055eae2cba:cs_0ad45ea3da9765643738c94224a1fc58cbf341a7'),
                        },
                    }
                );

                if (methodsResponse.ok) {
                    const methods = await methodsResponse.json();
                    setShippingMethods(methods);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchShippingMethods();
    }, [1]);

    let price: number | null = null;

    if (!takeDelivery) {
        price = getPriceForWeightFromMethod45(shippingMethods, totalWeight);
    }

    const handleTakeDelivery = () => {
        setTakeDelivery(!takeDelivery);
        localStorage.setItem('shippingCost', '0');
    };

    const [userInSchengen, setUserInSchengen] = useState<boolean>(false);

    useEffect(() => {
        const checkSchengen = async () => {
            if (apiData) {
                const result = await isCountryInSchengen(apiData.shipping?.country);
                setUserInSchengen(result);
            }
        };
        checkSchengen();
    }, [apiData]);

    const [userIDZone, setUserIDZone] = useState<string | null>(null);

    useEffect(() => {
        if (apiData) {
            const zoneId = getZoneId(apiData.shipping?.country);
            setUserIDZone(zoneId ?? null);
        }
    }, [apiData]);
    return (
        <div className="mt-3">
            <div className="flex items-center gap-2 relative group w-fit">
                <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                <div className="absolute left-0 -top-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                    Ce poids est estimé sur une base de 0,18kg par pièce. <br />
                    Tous les 10kg, un colis est comptabilisé.
                </div>
                <p className="text-gray-700 cursor-pointer">
                    Poids total estimé : <strong>{totalWeight} kg</strong> ({colis} {colis > 1 ? "colis" : "colis"})
                </p>
            </div>
            {takeDelivery == false && (
                <div className="border p-4 mt-4">
                    <div className="flex items-center gap-4">
                        <Image src="/icons/livraison.png" alt="livraison" width={30} height={30} />
                        <p className="font-inter">Frais de livraison <strong>{price}€ HT</strong></p>
                    </div>
                </div>
            )}
        </div>
    );
}
