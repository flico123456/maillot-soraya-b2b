'use client';

import { useState, useEffect } from "react";
import Layout2 from "@/components/Layout2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  UserIcon,
  Building2Icon,
  MapPinIcon
} from "lucide-react";
import { useApiData } from "@/api/Users/getUserInfo";
import CompteInformations from "@/components/Compte/informations";
import CompteInformationsEdit from "@/components/Compte/informations_edit";
import { Button } from "@/components/ui/button";
import CompteEntreprise from "@/components/Compte/informations_entreprise";
import CompteEntrepriseEdit from "@/components/Compte/informations_entreprise_edit";
import CompteAdresse from "@/components/Compte/carnet_adresse_livraison";
import CompteAdresseEdit from "@/components/Compte/carnet_adresse_livraison_edit";
import CompteAdresseFacturation from "@/components/Compte/carnet_adresse_facturation";
import CompteAdresseFacturationEdit from "@/components/Compte/carnet_adresse_facturation_edit";
const tabs = [
  { name: "Informations", icon: UserIcon },
  { name: "Informations entreprise", icon: Building2Icon },
  { name: "Carnet d'adresse", icon: MapPinIcon },
];

export default function Compte() {
  const [activeTab, setActiveTab] = useState("Informations");
  const apiGetUserInfo = useApiData();
  const [editMode, setEditMode] = useState(false);
  const [donneeChargement, setDonneeChargement] = useState(false)

  useEffect(() => {
    setDonneeChargement(!!apiGetUserInfo);
  }, [apiGetUserInfo]);

  useEffect(() => {
    setEditMode(false); // ← reset le mode édition quand on change d’onglet
  }, [activeTab]);

  return (
    <Layout2>
      <div className="flex justify-center mt-16 px-6 font-inter">
        <div className="flex w-full max-w-5xl gap-6">
          {/* Sidebar */}
          <aside className="w-auto border-r pr-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;

                return (
                  <li
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition",
                      isActive
                        ? "bg-gray-100 text-gray-800"
                        : "hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{tab.name}</span>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <Card className="rounded-none shadow-none">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                  {activeTab}
                </CardTitle>

                {/* Le bouton reste toujours visible dans l'onglet "Informations" */}
                {(activeTab === "Informations" || activeTab === "Informations entreprise") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? 'Annuler' : 'Modifier'}
                  </Button>
                )}
              </CardHeader>

              <CardContent className="max-h-[400px] overflow-y-auto">
                {activeTab === "Informations" && (
                  editMode
                    ? <CompteInformationsEdit />
                    : <CompteInformations />
                )}

                {activeTab === "Informations entreprise" && (
                  editMode
                    ? <CompteEntrepriseEdit />
                    : <CompteEntreprise />
                )}

                {activeTab === "Carnet d'adresse" && (
                  <div>
                    <div>
                      <h1 className="flex text-start text-lg font-semibold mb-5">Adresse de livraison</h1>
                      {editMode
                        ? <CompteAdresseEdit />
                        : <CompteAdresse />   // ⬅️ La key change à chaque sauvegarde
                      }
                    </div>
                    <div className="mt-10">
                      <h1 className="flex text-start text-lg font-semibold mb-5">Adresse de facturation</h1>
                      {editMode
                        ? <CompteAdresseFacturationEdit  />
                        : <CompteAdresseFacturation />
                      }
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout2>
  );
}