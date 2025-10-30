// Liste des codes pays de l'espace Schengen
const schengenCountries = [
    'AT', 'BE', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT',
    'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'SK', 'SI', 'ES', 'SE', 'CH'
];

// Fonction pour vérifier si le pays est dans l'espace Schengen
export function isCountryInSchengen(countryCode: string): boolean {
    return schengenCountries.includes(countryCode);
}
