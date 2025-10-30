'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Panier() {

  const router = useRouter()

  const handleClickPanier = () => {
    router.push("/panier")
  }

  const [panierCount, setPanierCount] = useState<number>(0);

  useEffect(() => {
    // Récupérer la wishlist depuis le localStorage
    const panierData = localStorage.getItem('cart');
    if (panierData) {
      const panier = JSON.parse(panierData);
      // Compter le nombre d'éléments dans la wishlist
      setPanierCount(panier.length);
    }
  }, []);


  return (
    <div>
      <div className='relative' onClick={() => handleClickPanier()}>
        <Image className='w-5 max-xl:w-5 mx-3 md:mx-3 cursor-pointer' alt="img-bag" src="/icons/bag.png" width={20} height={20} />
        {panierCount > 0 && (
          <div className="absolute -top-2 -right-0 w-4 h-4 bg-color-soraya rounded-full flex items-center justify-center text-white text-xs">
            {panierCount}
          </div>
        )}
      </div>
    </div>
  )
}