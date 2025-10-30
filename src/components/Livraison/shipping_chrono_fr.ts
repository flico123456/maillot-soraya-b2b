// Types (adaptables à ta réponse API)
type Rate = { min: number | string; max: number | string; price: number | string };
type ShippingRatesSetting = { value: Rate[] };
type NumberSetting = { value?: string | number };
type Settings = {
  packaging_weight?: NumberSetting;
  management_fees?: NumberSetting;
  shipping_rates?: ShippingRatesSetting;
  // ... autres champs possibles (free_shipping, quickcost, etc.)
};

type ShippingMethod = {
  id: number;
  settings?: Settings;
};

const toNum = (v: unknown, fallback = 0): number => {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Calcule le prix pour un poids total (kg) via la méthode id=45.
 * - Ajoute packaging_weight si présent
 * - Choisit le palier [min, max) correspondant
 * - Ajoute management_fees si présent
 * Retourne `null` si non trouvée ou pas de palier correspondant.
 */
export function getPriceForWeightFromMethod45(
  methods: ShippingMethod[] | undefined,
  weightKg: number
): number | null {
  if (!methods || !Number.isFinite(weightKg)) return null;

  const method = methods.find((m) => m.id === 45 || m.id === 38);
  if (!method) return null;

  const settings = method.settings ?? {};
  const packagingWeight = toNum(settings.packaging_weight?.value, 0);
  const managementFees = toNum(settings.management_fees?.value, 0);

  const totalWeight = Math.max(0, weightKg + packagingWeight);

  const rates = settings.shipping_rates?.value ?? [];
  if (!Array.isArray(rates) || rates.length === 0) return null;

  // Cherche le palier tel que min <= totalWeight < max
  let match = rates.find((r) => {
    const min = toNum(r.min);
    const max = toNum(r.max, Number.POSITIVE_INFINITY);
    return totalWeight >= min && totalWeight < max;
  });

  // Si le poids dépasse le dernier palier, on prend le dernier (comportement courant en e-commerce)
  if (!match) {
    const sorted = [...rates].sort((a, b) => toNum(a.max) - toNum(b.max));
    match = sorted[sorted.length - 1];
    // Si même comme ça on ne trouve pas, on renvoie null
    if (!match) return null;
  }

  const basePrice = toNum(match.price, 0);
  const finalPrice = basePrice + managementFees;
 
  
  localStorage.setItem('shippingCost', finalPrice.toString());

  // Arrondi à 2 décimales
  return Math.round(finalPrice * 100) / 100;
}
