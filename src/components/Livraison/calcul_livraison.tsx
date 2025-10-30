export const calculateDelivery = (weight: number, distance: number): number => {
    const baseRate = 5; // Tarif de base en euros
    const weightRate = 0.5; // Tarif par kg en euros
    const distanceRate = 0.1; // Tarif par km en euros
    const deliveryCost = baseRate + (weightRate * weight) + (distanceRate * distance);
    return parseFloat(deliveryCost.toFixed(2)); // Retourne le coût arrondi à 2 décimales
};

// Poids par pièce
export const calculateKilo = (numberPieces: number): number => {
    const weight = 0.18; // Poids en kg par pièce
    const kiloPrice = (numberPieces * weight);
    return parseFloat(kiloPrice.toFixed(2)); // Retourne le prix au kilo arrondi à 2 décimales
}

// Nombre de colis en fonction du poids
export const calculateColis = (totalWeight: number): number => {
  const maxKgPerBox = 10; // 8kg par carton
  const numberOfBoxes = Math.ceil(totalWeight / maxKgPerBox);
  return numberOfBoxes;
};