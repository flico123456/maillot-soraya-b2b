'use client';

import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/api/Users/getUserInfo";
import { useState, useEffect } from "react";
import CountrySelect from "../ui/input-country";

export default function CompteAdresseFacturationEdit({ onSaved }: { onSaved?: () => void }) {
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
        billingName: '',
        billingSurname: '',
        billingAddress: '',
        billingCity: '',
        billingPostalCode: '',
        billingCountry: '',
        billingPhone: '',
        billingCountryCode: '',
    });
    
    useEffect(() => {
        if (apiData) {
            setFormData({
                billingName: apiData.billing?.first_name || '',
                billingSurname: apiData.billing?.last_name || '',
                billingAddress: apiData.billing?.address_1 || '',
                billingCity: apiData.billing?.city || '',
                billingPostalCode: apiData.billing?.postcode || '',
                billingCountry: apiData.billing?.country || '',
                billingPhone: apiData.billing?.phone || '',
                billingCountryCode: apiData.billing?.country || '',
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
            billing: {
                first_name: formData.billingName,
                last_name: formData.billingSurname,
                address_1: formData.billingAddress,
                city: formData.billingCity,
                postcode: formData.billingPostalCode,
                country: formData.billingCountryCode,
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
                            name="billingName"
                            value={formData.billingName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-1 space-y-1 mt-4 md:mt-0">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                            id="lastName"
                            type="text"
                            name="billingSurname"
                            value={formData.billingSurname}
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
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="address">Pays</Label>
                    <CountrySelect value={formData.billingCountryCode} onChange={(value) => setFormData(prev => ({ ...prev, billingCountryCode: value }))} />
                </div>

                {/* Ligne 3 : Code postal et ville */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                            id="postalCode"
                            type="text"
                            name="billingPostalCode"
                            value={formData.billingPostalCode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-1 space-y-1 mt-4 md:mt-0">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                            id="city"
                            type="text"
                            name="billingCity"
                            value={formData.billingCity}
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
