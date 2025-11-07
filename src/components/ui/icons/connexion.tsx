'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Connexion() {
  const router = useRouter();

  return (
    <div className="relative mx-3 w-fit">
        <button
            className="mt-1 cursor-pointer hover:underline focus:outline-none focus:underline"
            onClick={() => router.push('/connexion')}
        >
            Se connecter
        </button>
    </div>
  );
}
