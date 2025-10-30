'use client';

import Layout2 from "@/components/Layout2";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { X } from "lucide-react";
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

export default function PanierPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [commande, setCommande] = useState<number | null>(null);

    useEffect(() => {
        const storedCommande = localStorage.getItem('commande');
        if (storedCommande) {
            setCommande(Number(storedCommande));
        }
    }, []);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const handleRemoveItem = (productId: string) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (index: number, newQuantity: number) => {
        if (newQuantity < 0) return;

        const updatedCart = [...cart];
        updatedCart[index].quantity = newQuantity;
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Layout2>
            <div className="mt-20 mb-10 px-10 flex flex-col lg:flex-row gap-8 justify-center items-start font-inter">

                {/* 🛒 Panier */}
                <Card className="w-full max-w-2xl p-4 rounded-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-medium">Panier</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[400px] overflow-y-auto">
                            {cart.length === 0 ? (
                                <p className="text-gray-500 text-sm p-4">Votre panier est vide.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            <th className="py-3 text-left px-2 font-semibold">Produit</th>
                                            <th className="py-3 text-left px-4 font-semibold">Taille</th>
                                            <th className="py-3 text-left px-4 font-semibold">Quantité</th>
                                            <th className="py-3 text-left px-4 font-semibold">Prix</th>
                                            <th className="py-3 text-right px-2 font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item, index) => (
                                            <tr key={`${item.id}-${item.size}`} className="border-b hover:bg-gray-50">
                                                <td className="py-3 flex items-center gap-3 px-2">
                                                    <Image
                                                        src={item.images?.[0]?.src || item.image}
                                                        alt={item.name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover w-10 h-10"
                                                    />
                                                    <span>{item.name}</span>
                                                </td>
                                                <td className="py-3 px-4">{item.size}</td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleQuantityChange(index, parseInt(e.target.value) || 0)
                                                        }
                                                        className="w-16 border rounded px-2 py-1 text-center text-sm"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    {(item.price * item.quantity).toFixed(2)} €
                                                </td>
                                                <td className="py-3 text-right px-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 📦 Récapitulatif */}
                <Card className="w-full max-w-sm h-fit p-4 rounded-none shadow-none border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Récapitulatif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-sm font-medium">
                            <span>Total du panier HT:</span>
                            <span>{totalPrice.toFixed(2)} €</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button
                            className="w-full bg-black text-white hover:bg-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => router.push("/livraison")}
                            disabled={
                                (commande === 0 && totalPrice < 2500) ||
                                (commande === 1 && totalPrice < 500)
                            }
                        >
                            Valider le panier
                        </Button>
                        {commande === 0 && (
                            <p className="text-sm text-red-600 text-center">
                                Le montant minimum de commande est de 2500€ pour votre 1ère commande.
                            </p>
                        )}
                        {commande === 1 && (
                            <p className="text-sm text-red-600 text-center">
                                Le montant minimum de commande est de 500€ pour votre réassort.
                            </p>
                        )}
                    </CardFooter>

                    <div className="p-4">
                        <p>
                            Veuillez noter que si le panier n’est pas validé immédiatement ou si vous
                            choisissez d’attendre, les quantités sélectionnées ne sont pas réservées
                            et peuvent évoluer en fonction de la disponibilité du stock.
                        </p>
                    </div>
                </Card>
            </div>
        </Layout2>
    );
}
