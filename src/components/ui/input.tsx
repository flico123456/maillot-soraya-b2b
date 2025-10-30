'use client';

import React from 'react';

// ✅ Étendre toutes les props natives d'un <input>
interface InputSorayaProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputSoraya: React.FC<InputSorayaProps> = ({
  value,
  onChange,
  placeholder = 'Entrez un texte...',
  id,
  type = 'text',
  required,
  readOnly = false,
  name,                // ✅ maintenant reconnu
  ...rest              // ✅ récupère toutes les autres props
}) => {
  return (
    <input
      id={id}
      name={name}        // ✅ passé au <input>
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-2 border text-sm border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
      required={required}
      readOnly={readOnly}
      {...rest}          // ✅ propage le reste (onBlur, autoComplete, etc.)
    />
  );
};

export default InputSoraya;
