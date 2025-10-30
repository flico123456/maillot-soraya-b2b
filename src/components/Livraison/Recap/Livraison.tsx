'use client';

import { useState, useEffect } from "react";
import { useApiData } from "@/api/Users/getUserInfo";
import { useRouter } from "next/navigation";
import RecapInFrance from "@/components/Livraison/Recap/InFrance";
import RecapOutsideFrance from "./outsideFrance";

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

export default function LivraisonComponent() {
  const router = useRouter();
  const apiData = useApiData();
  const [priceShipping, setPriceShipping] = useState<number | null>(null);

  useEffect(() => {
    // Fonction pour lire la valeur
    const updateShipping = () => {
      const storedPrice = localStorage.getItem("shippingCost");
      if (storedPrice) {
        setPriceShipping(parseFloat(storedPrice));
      }
    };

    // Premier appel au montage
    updateShipping();

    // Écoute les changements de localStorage
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "shippingCost") {
        updateShipping();
      }
    };

    window.addEventListener("storage", handleStorage);

    // Nettoyage
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
  
  return (
    <div>
      {formData.shippingCountry == "FR" && (
        <RecapInFrance />
      )}
      {formData.shippingCountry != "FR" && (
        <RecapOutsideFrance />
      )}
    </div>
  );
}
