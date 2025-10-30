'use client';

import React, { useState } from 'react';

interface Country {
  code: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
];

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Sélectionner un pays..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setOpen(true)} // ✅ Ouvre la liste seulement au focus/click
        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-gray-300"
      />

      {/* ✅ Affiche la liste seulement si open === true */}
      {open && (
        <div className="max-h-48 overflow-y-auto border rounded-lg bg-white shadow-lg absolute w-full z-10">
          {filteredCountries.map((country) => (
            <div
              key={country.code}
              onClick={() => {
                onChange(country.code);
                setSearch(country.name);
                setOpen(false); // ✅ ferme la liste après sélection
              }}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <span className="mr-2 text-lg">{country.flag}</span>
              <span>{country.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
