'use client';

import { useState, useEffect, useMemo } from "react";
import Layout2 from "@/components/Layout2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiData } from "@/api/Users/getUserInfo";
import { useRouter } from "next/navigation";
import MethodeLivraison from "@/components/Livraison/methode_livraison";

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

export default function RecapOutsideFrance() {
  const router = useRouter();
  const apiData = useApiData();

  const [priceShipping, setPriceShipping] = useState<number>(0);
  const [takeDelivery, setTakeDelivery] = useState<boolean>(false);

  // Lecture initiale + synchro via CustomEvent (même onglet) + fallback via 'storage' (autres onglets)
  useEffect(() => {
    const readFromStorage = () => {
      const cost = parseFloat(localStorage.getItem('shippingCost') || '0');
      const take = localStorage.getItem('takeDelivery') === 'true';
      setPriceShipping(Number.isFinite(cost) ? cost : 0);
      setTakeDelivery(take);
    };
    readFromStorage();

    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (typeof detail.shippingCost === 'number') setPriceShipping(detail.shippingCost);
      if (typeof detail.takeDelivery === 'boolean') setTakeDelivery(detail.takeDelivery);
    };
    window.addEventListener('shipping:updated', onCustom as EventListener);

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'shippingCost' || event.key === 'takeDelivery') {
        readFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('shipping:updated', onCustom as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (apiData) {
      console.log("Données de l'API :", apiData);
    }
  }, [apiData]);

  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  // 0 si prise en charge
  const shippingHT = takeDelivery ? 0 : (priceShipping || 0);

  const handleValidateAndPay = () => {
    // Total HT (hors TVA pour l’international si c’est ta règle côté /devis)
    localStorage.setItem('PriceTotal', String(totalPrice + shippingHT));
    router.push('/devis');
  };

  return (
    <div className="mt-20 mb-10 px-10 flex flex-col lg:flex-row gap-8 justify-center items-start font-inter">
      <MethodeLivraison />

      <Card className="w-full max-w-sm h-fit p-4 rounded-none shadow-none border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Récapitulatif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm font-medium">
            <span>Total des articles :</span>
            <span>{totalPrice.toFixed(2)} € HT</span>
          </div>
          <div className="flex mt-2 justify-between text-sm font-medium">
            <span>Frais de livraison :</span>
            <span>{shippingHT.toFixed(2)} € HT</span>
          </div>
          <div className="flex mt-2 border-t pt-2 justify-between text-base font-semibold">
            <span>Total HT :</span>
            <span>{(totalPrice + shippingHT).toFixed(2)} €</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="mt-2 w-full bg-black text-white hover:bg-gray-800 text-sm"
            onClick={handleValidateAndPay}
          >
            Visualiser le devis et payer
          </Button>
        </CardFooter>
        <div className="p-4">
          <p>
            Veuillez noter que si le panier n’est pas validé immédiatement ou si vous choisissez d’attendre,
            les quantités sélectionnées ne sont pas réservées et peuvent évoluer en fonction de la disponibilité du stock.
          </p>
        </div>
      </Card>
    </div>
  );
}
