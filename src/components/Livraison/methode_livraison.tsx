'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApiData } from "@/api/Users/getUserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { calculateKilo } from './calcul_livraison';
import { getPriceForWeightFromMethod45 } from './shipping_chrono_fr';
import { Checkbox } from '../ui/checkbox';
import { isCountryInSchengen } from '@/api/CheckUE';
import { getZoneId } from '@/api/getIDZone';
import ID1 from './SelonID/1';
import ID2 from './SelonID/2';

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

export default function MethodeLivraison() {
    const apiData = useApiData();
    const router = useRouter();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [totalQty, setTotalQty] = useState<number>(0);
    const totalPrice = useMemo(
        () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart]
    );

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));
    }, []);

    // hydrate total quantité + écoute des updates
    useEffect(() => {
        const refreshQty = () => setTotalQty(getTotalQuantity(readCart()));
        refreshQty();

        document.addEventListener('cart:updated', refreshQty);
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'cart') refreshQty();
        };
        window.addEventListener('storage', onStorage);

        return () => {
            document.removeEventListener('cart:updated', refreshQty);
            window.removeEventListener('storage', onStorage);
        };
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

    const allEmpty = Object.values(formData).every((v) => !v || v.toString().trim() === '');

    // poids total
    const totalWeight = useMemo(() => calculateKilo(totalQty), [totalQty]);

    // --- Méthodes d'expédition ---
    const [shippingMethods, setShippingMethods] = useState<any[] | undefined>(undefined);

    // --- Checkbox "Je prends en charge" + synchro localStorage ---
    const [takeDelivery, setTakeDelivery] = useState<boolean>(false);
    const [shippingCost, setShippingCost] = useState<number>(0);

    // init depuis localStorage au 1er rendu
    const didInitRef = useRef(false);
    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;

        const savedTake = localStorage.getItem('takeDelivery') === 'true';
        const savedCost = parseFloat(localStorage.getItem('shippingCost') || '0');
        setTakeDelivery(savedTake);
        setShippingCost(Number.isFinite(savedCost) ? savedCost : 0);
    }, []);

    // calcule le coût courant (0 si prise en charge)
    const computedShippingCost = useMemo(() => {
        if (takeDelivery) return 0;
        const c = getPriceForWeightFromMethod45(shippingMethods, totalWeight);
        return Number.isFinite(c as number) && (c as number) > 0 ? (c as number) : 0;
    }, [takeDelivery, shippingMethods, totalWeight]);

    // centralise écriture localStorage + broadcast custom event
    const writeAndBroadcast = (cost: number, take: boolean) => {
        localStorage.setItem('shippingCost', String(cost));
        localStorage.setItem('takeDelivery', take ? 'true' : 'false');
        window.dispatchEvent(
            new CustomEvent('shipping:updated', { detail: { shippingCost: cost, takeDelivery: take } })
        );
    };

    // met à jour shippingCost + diffuse dès que computedShippingCost / takeDelivery change
    useEffect(() => {
        if (shippingCost !== computedShippingCost) {
            setShippingCost(computedShippingCost);
            writeAndBroadcast(computedShippingCost, takeDelivery);
        } else {
            // même coût mais takeDelivery a pu changer
            writeAndBroadcast(shippingCost, takeDelivery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [computedShippingCost, takeDelivery]);

    const handleTakeDelivery = () => {
        setTakeDelivery((prev) => !prev);
    };

    // --- Zone + Schengen ---
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
        <div className="w-full max-w-3xl">
            <Card className="w-full max-w-2xl p-4 rounded-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl font-medium">Méthode de livraison</CardTitle>
                </CardHeader>

                {allEmpty ? (
                    <CardContent>
                        <p>Aucune adresse de livraison n&apos;a été fournie.</p>
                        <div className="mt-6">
                            <div className="flex">
                                <Button
                                    variant="outline"
                                    type="button"
                                    size="sm"
                                    className="flex items-center gap-2"
                                    onClick={() => router.push('/compte')}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Ajouter une adresse
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                ) : (
                    <CardContent>
                        <div className="w-3/4">
                            <h1 className="font-inter font-semibold text-lg uppercase">
                                {formData.shippingName} {formData.shippingSurname}
                            </h1>
                            <p className="text-gray-700">
                                {formData.shippingAddress}
                                {formData.shippingAddress && ', '}
                                {formData.shippingPostalCode} {formData.shippingCity} {formData.shippingCountry}{' '}
                                {formData.shippingPhone}
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="h-0.5 bg-black w-full" />
                        </div>

                        <div>
                            <h2 className="font-inter font-semibold text-md mt-4">Détails de la livraison</h2>

                            {userIDZone === '1' && !takeDelivery && (
                                totalPrice > 2500 ? (
                                    <div className="mt-3">
                                        <p className="text-gray-700">
                                            Vous bénéficiez de la livraison gratuite pour toute commande supérieure à{' '}
                                            <strong>2500€</strong> en France métropolitaine.
                                        </p>
                                    </div>
                                ) : (
                                    <ID1 />
                                )
                            )}

                            {userIDZone === '2' && !takeDelivery && <ID2 />}

                            {userIDZone === '3' && userInSchengen && (
                                <div className="mt-3">
                                    <p className="text-gray-700">
                                        Pour les livraisons dans la (Zone 3), veuillez nous contacter pour
                                        un devis personnalisé.
                                    </p>
                                </div>
                            )}

                            {!userIDZone && (
                                <div className="mt-3">
                                    <p className="text-gray-700">Zone de livraison inconnue. Veuillez vérifier votre adresse.</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-8">
                                <Checkbox checked={takeDelivery} onCheckedChange={handleTakeDelivery} />
                                <h3 className="font-inter text-md">Je prends en charge ma livraison</h3>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
