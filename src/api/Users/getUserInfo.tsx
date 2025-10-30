'use client'

import { get } from 'http';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// Définissez une interface pour les données de l'API
interface ApiData {
  username: string;
  email: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    country: string;
    address_1: string;
    city: string;
    postcode: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    country: string;
    address_1: string;
    city: string;
    postcode: string;
    phone: string;
  };
  walletBalance?: string;
  raison_sociale?: string;
  siret?: string;
  tva_intracom?: string;
  commande: number;

  meta_data?: {
    id: number;
    key: string;
    value: string;
  }[];
}

// Créez un contexte pour les données de l'API
const ApiContext = createContext<ApiData | null>(null);

// Composant fournisseur pour envelopper votre application et gérer les données de l'API
export function UserInfoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ApiData | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer l'ID depuis le localStorage après le montage
    const storedId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;
    if (storedId) {
      setId(storedId);
    }
  }, []);

  useEffect(() => {
    // Charger les informations de l'utilisateur depuis l'API
    const fetchUtilisateur = async () => {
      if (id) {
        try {
          const response = await fetch(
            `https://maillotsoraya-conception.com/wp-json/wc/v3/customers/${id}`,
            {
              headers: {
                Authorization:
                  'Basic ' + btoa('ck_2a1fa890ddee2ebc1568c314734f51055eae2cba:cs_0ad45ea3da9765643738c94224a1fc58cbf341a7'),
              },
            }
          );
          const userData = await response.json();

          const getMeta = (key: string) => {
            const found = userData.meta_data?.find((m: any) => m.key === key);
            return found ? found.value : '';
          };

          // Mettre à jour les données de l'utilisateur avec walletBalance
          setData({...userData, raison_sociale: getMeta('raison_sociale'), siret: getMeta('siret'), tva_intracom: getMeta('tva_intracom'), commande: getMeta('commande')});

          localStorage.setItem('commande', getMeta('commande'));

        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUtilisateur();
  }, [id]);

  // Rendre le contexte des données disponibles pour les composants enfants
  return <ApiContext.Provider value={data}>{children}</ApiContext.Provider>;
}

// Hook personnalisé pour accéder aux données de l'API
export function useApiData() {
  return useContext(ApiContext);
}
