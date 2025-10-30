'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Account() {
  const router = useRouter();

  return (
    <div className="relative mx-3 cursor-pointer w-fit">
      <button className='mt-1' onClick={() => router.push("/compte")}>
        <Image alt="img-user" src="/icons/utilisateur.png" width={20} height={20} />
      </button>

      {/* ✅ Rond vert positionné un peu plus haut, en dehors de l'icône */}
      <span className="absolute -top-1 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
    </div>
  );
}
