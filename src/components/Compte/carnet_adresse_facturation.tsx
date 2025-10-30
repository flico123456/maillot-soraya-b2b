'use client';

import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/api/Users/getUserInfo";
import { useState, useEffect } from "react";
import CompteAdresseLivraisonEdit from "./carnet_adresse_livraison_edit";
import CompteAdresseFacturationEdit from "./carnet_adresse_facturation_edit";

export default function CompteAdresseFacturation() {
    const apiData = useApiData();
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        billingName: '',
        billingSurname: '',
        billingAddress: '',
        billingCity: '',
        billingPostalCode: '',
        billingCountry: '',
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
            });
        }
    }, [apiData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="w-full max-w-3xl">
            {formData == null ? (
                <p>Chargement des données...</p>
            ) : (
                (() => {
                    const allEmpty = Object.values(formData).every(
                        (val) =>
                            !val ||
                            val.startsWith("Entrez votre")
                    );
                    if (allEmpty) {
                        return (
                            <div className="flex">
                                <Button
                                    variant="outline"
                                    type="button"
                                    size="sm"
                                    className="flex items-center gap-2"
                                    onClick={() => setEditMode(true)}
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
                        );
                    }
                    return (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Ligne 1 : prénom et nom */}
                            <div className="flex flex-col md:flex-row md:space-x-4">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="username">Prénom</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        value={formData.billingName}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>
                                <div className="flex-1 space-y-1 mt-4 md:mt-0">
                                    <Label htmlFor="email">Nom</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.billingSurname}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>
                            </div>
                            {/* Ligne 2 : Adresse */}
                            <div className="space-y-1">
                                <Label htmlFor="phone">Adresse</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.billingAddress}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="address">Pays</Label>
                                <Input
                                    id="country"
                                    type="country"
                                    value={formData.billingCountry}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>

                            {/* Ligne 3 : Code postal et ville */}
                            <div className="flex flex-col md:flex-row md:space-x-4">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="username">Code postal</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        value={formData.billingPostalCode}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>
                                <div className="flex-1 space-y-1 mt-4 md:mt-0">
                                    <Label htmlFor="email">Ville</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.billingCity}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </form>
                    );
                })()
            )}
            {editMode && (
                <CompteAdresseFacturationEdit />
            )}
        </div>
    );
}
