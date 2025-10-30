'use client';

import { useState, useEffect } from "react";
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

export default function RecapInFrance() {
  const router = useRouter();
  const apiData = useApiData();

  const [priceShipping, setPriceShipping] = useState<number>(0);
  const [takeDelivery, setTakeDelivery] = useState<boolean>(false);

  // lecture initiale + écoute du CustomEvent
  useEffect(() => {
    const read = () => {
      const cost = parseFloat(localStorage.getItem('shippingCost') || '0');
      const take = localStorage.getItem('takeDelivery') === 'true';
      setPriceShipping(Number.isFinite(cost) ? cost : 0);
      setTakeDelivery(take);
    };
    read();

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (typeof detail.shippingCost === 'number') setPriceShipping(detail.shippingCost);
      if (typeof detail.takeDelivery === 'boolean') setTakeDelivery(detail.takeDelivery);
    };

    window.addEventListener('shipping:updated', handler as EventListener);
    return () => window.removeEventListener('shipping:updated', handler as EventListener);
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const shippingHT = takeDelivery ? 0 : (priceShipping || 0);

  const handleValidateAndPay = () => {
    localStorage.setItem('PriceTotalHT', String(totalPrice + shippingHT));
    localStorage.setItem('PriceTotalTTC', String((totalPrice + shippingHT) * 1.2));
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
          <div className="flex mt-2 border-t pt-2 justify-between text-sm font-semibold">
            <span>Total HT:</span>
            <span>{(totalPrice + shippingHT).toFixed(2)} €</span>
          </div>
          <div className="flex mt-1 pt-2 justify-between text-base font-semibold">
            <span>Total TTC:</span>
            <span>{((totalPrice + shippingHT) * 1.2).toFixed(2)} €</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="mt-2 w-full bg-black text-white hover:bg-gray-800 text-sm" onClick={handleValidateAndPay}>
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
