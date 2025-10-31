'use client';

import { useEffect, useState } from "react";
import { useApiData } from "@/api/Users/getUserInfo";

interface CartItem {
    sizeId?: string;
    id: string;
    id_product?: number;
    name: string;
    quantity: number;
    images?: { src?: string }[];
    image?: string;
    price: number;
    size?: string;
    sku: string; // ← souvent très grand: string > number
}

export default function GenerateOrder() {
    const apiData = useApiData();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [formData, setFormData] = useState({
        raison_sociale: '',
        vatNumber: '',
    });
    const [hasPosted, setHasPosted] = useState(false); // éviter doublons
    const [priceTotalTTC, setPriceTotalTTC] = useState<number | null>(null);

    useEffect(() => {
        const priceTTC = localStorage.getItem('PriceTotalTTC');
        if (priceTTC) {
            setPriceTotalTTC(parseFloat(priceTTC));
        }
    }, []);

    // 1) Charger le panier depuis localStorage
    useEffect(() => {
        try {
            const storedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
            if (storedCart) setCart(JSON.parse(storedCart));
        } catch (e) {
            console.error("Erreur parsing localStorage 'cart':", e);
        }
    }, []);

    // 2) Récupérer raison sociale + TVA depuis l'API user
    useEffect(() => {
        if (!apiData) return;
        setFormData({
            raison_sociale: apiData?.raison_sociale || '',
            vatNumber: apiData?.tva_intracom || '',
        });
    }, [apiData]);

    // 3) Appeler l’API seulement quand tout est prêt (cart + infos)
    useEffect(() => {
        const ready =
            cart.length > 0 &&
            formData.raison_sociale.trim().length > 0 &&
            String(formData.vatNumber).trim().length > 0;

        if (!ready || hasPosted) return;

        const createCommande = async () => {
            // On envoie tout le panier (en ne gardant que l’essentiel)
            const contenu = cart.map((item) => ({
                name: item.size ? `${item.name} - ${item.size}` : item.name,
                sku: String(item.sku),
                quantity: item.quantity,
                price: item.price,
                image: item.image ?? item.images?.[0]?.src ?? null,
                id: item.id,
            }));

            try {
                const res = await fetch('https://apistock.maillotsoraya-conception.com:3001/commandes/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        raison_sociale: formData.raison_sociale,
                        n_tva: String(formData.vatNumber), // ← DB en VARCHAR
                        contenu, // ← tout le panier
                        price: priceTotalTTC,
                    }),
                });

                const text = await res.text();
                if (!res.ok) {
                    console.error('Erreur création commande:', res.status, text);
                    return;
                }

                try {
                    const data = JSON.parse(text);
                    console.log('Commande créée:', data);
                } catch {
                    console.log('Réponse:', text);
                } finally {
                    setHasPosted(true);
                }
            } catch (error) {
                console.error('Erreur réseau:', error);
            }
        };

        createCommande();
    }, [cart, formData.raison_sociale, formData.vatNumber, hasPosted]);

    return (
        <div>
            <h1>Paiement accepté</h1>
            <p>Merci pour votre paiement. Votre transaction a été acceptée avec succès.</p>
        </div>
    );
}
