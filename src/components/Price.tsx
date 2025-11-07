"use client";

import { useEffect, useState } from "react";

interface PriceDisplayProps {
  price: string | number;
  grosPrice?: string | number;   // optionnel
  className?: string;            // optionnel pour styliser le texte
}

export default function PriceDisplay({
  price,
  grosPrice,
  className = "",
}: PriceDisplayProps) {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("isLoggedInDistributeur");
      setIsLogged(stored === "true");
    } catch {
      setIsLogged(false);
    }
  }, []);

  // Pendant le chargement, ne rien afficher
  if (isLogged === null) return null;

  // Si non connecté → cacher prix
  if (!isLogged) return null;

  // Sinon → afficher prix
  return (
    <span className={className}>
      {grosPrice ? `${grosPrice} € HT` : `${price} €`}
    </span>
  );
}
