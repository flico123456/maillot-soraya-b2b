'use client';

import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiData } from "@/api/Users/getUserInfo";
import { useState, useEffect } from "react";

export default function CompteEntreprise() {
  const apiData = useApiData();

  const [formData, setFormData] = useState({
    phone: '',
    raison_sociale: '',
    siret: '',
    vatNumber: '',
  });

  useEffect(() => {
    if (apiData) {
      setFormData({
        phone: apiData.billing.phone || '',
        raison_sociale: apiData.raison_sociale || '',
        siret: apiData.siret || '',
        vatNumber: apiData.tva_intracom || '',
      });
    }
  }, [apiData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-full max-w-3xl">
      <form className="space-y-4">

        {/* Ligne 1 : Raison sociale & Téléphone */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="companyName">Raison sociale</Label>
            <Input
              id="companyName"
              type="text"
              value={formData.raison_sociale}
              readOnly
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 space-y-1 mt-4 md:mt-0">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              readOnly
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
              value={formData.siret}
              readOnly
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 space-y-1 mt-4 md:mt-0">
            <Label htmlFor="vatNumber">N° TVA Intracom.</Label>
            <Input
              id="vatNumber"
              type="text"
              value={formData.vatNumber}
              readOnly
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
}