'use client';

import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/api/Users/getUserInfo";
import { useState, useEffect } from "react";
import CountrySelect from "../ui/input-country";

export default function CompteAdresseLivraisonEdit({ onSaved }: { onSaved?: () => void }) {
    const apiData = useApiData();
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        // Récupérer l'ID depuis le localStorage après le montage
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;
        if (storedId) {
            setId(storedId);
        }
    }, []);


    const [formData, setFormData] = useState({
        shippingName: '',
        shippingSurname: '',
        shippingAddress: '',
        shippingCity: '',
        shippingPostalCode: '',
        shippingCountry: '',
        shippingPhone: '',
        shippingCountryCode: '',
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
                shippingCountryCode: apiData.shipping?.country || '',
            });
        }
    }, [apiData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id) {
            alert("Utilisateur introuvable");
            return;
        }

        const payload = {
            shipping: {
                first_name: formData.shippingName,
                last_name: formData.shippingSurname,
                address_1: formData.shippingAddress,
                city: formData.shippingCity,
                postcode: formData.shippingPostalCode,
                country: formData.shippingCountryCode,
                phone: formData.shippingPhone,
            }
        };

        try {
            const res = await fetch(`https://maillotsoraya-conception.com/wp-json/wc/v3/customers/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Basic ' + btoa('ck_2a1fa890ddee2ebc1568c314734f51055eae2cba:cs_0ad45ea3da9765643738c94224a1fc58cbf341a7'),
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Erreur API");

            await res.json();
            window.location.reload(); // Recharger la page pour mettre à jour les données
        } catch (err) {
            console.error(err);
            alert("❌ Erreur lors de l'enregistrement");
        }
    };

    return (
        <div className="w-full max-w-3xl mt-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ligne 1 : username et email */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                            id="firstName"
                            type="text"
                            name="shippingName"
                            value={formData.shippingName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-1 space-y-1 mt-4 md:mt-0">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                            id="lastName"
                            type="text"
                            name="shippingSurname"
                            value={formData.shippingSurname}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Ligne 2 : Adresse */}
                <div className="space-y-1">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                        id="address"
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="address">Pays</Label>
                    <CountrySelect value={formData.shippingCountryCode} onChange={(value) => setFormData(prev => ({ ...prev, shippingCountryCode: value }))} />
                </div>

                {/* Ligne 3 : Code postal et ville */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                            id="postalCode"
                            type="text"
                            name="shippingPostalCode"
                            value={formData.shippingPostalCode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-1 space-y-1 mt-4 md:mt-0">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                            id="city"
                            type="text"
                            name="shippingCity"
                            value={formData.shippingCity}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full !mt-10">
                    Enregistrer
                </Button>
            </form>
        </div>
    );
}
