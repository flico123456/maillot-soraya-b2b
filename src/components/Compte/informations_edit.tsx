'use client';

import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/api/Users/getUserInfo";
import { useState, useEffect } from "react";

export default function CompteInformationsEdit() {
    const apiData = useApiData();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
    });

    useEffect(() => {
        if (apiData) {
            setFormData({
                username: apiData.username || '',
                email: apiData.email || '',
                phone: apiData.billing?.phone || '',
                password: '',
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
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ligne 1 : username et email */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input
                            id="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-1 space-y-1 mt-4 md:mt-0">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Ligne 2 : téléphone */}
                <div className="space-y-1">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                {/* Ligne 3 : mot de passe */}
                <div className="space-y-1">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit" className="w-full">
                    Enregistrer
                </Button>
            </form>
        </div>
    );
}
