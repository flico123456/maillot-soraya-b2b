'use client';

import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/api/Users/getUserInfo";
import { useState, useEffect } from "react";

export default function CompteEntrepriseEdit() {
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
    raison_sociale: '',
    phone: '',
    siret: '',
    vatNumber: '',
  });

  useEffect(() => {
    if (apiData) {
      setFormData({
        raison_sociale: apiData.raison_sociale || '',
        phone: apiData.billing.phone || '',
        siret: apiData.siret || '',
        vatNumber: apiData.tva_intracom || '',
      });
    }
  }, [apiData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
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
        phone: formData.phone,
      },
      // Ajouter les champs personnalisés
      meta_data: [
        { key: 'raison_sociale', value: formData.raison_sociale },
        { key: 'siret', value: formData.siret },
        { key: 'tva_intracom', value: formData.vatNumber },
      ]
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
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ligne 1 : Raison sociale & Téléphone */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="companyName">Raison sociale</Label>
            <Input
              id="companyName"
              type="text"
              name="raison_sociale"
              value={formData.raison_sociale}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 space-y-1 mt-4 md:mt-0">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Ligne 2 : SIRET & TVA */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="siret">N° SIRET</Label>
            <Input
              id="siret"
              type="text"
              name="siret"
              value={formData.siret}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 space-y-1 mt-4 md:mt-0">
            <Label htmlFor="vatNumber">N° TVA Intracom.</Label>
            <Input
              id="vatNumber"
              type="text"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-4">
          Enregistrer
        </Button>
      </form>
    </div>
  );
}
