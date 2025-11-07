'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout2 from '@/components/Layout2';
import Modal from '@/components/Zoom';
import { addToCart } from '@/api/addToCart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect } from 'react';
import PriceDisplay from '@/components/Price';
import { AlertCircleIcon } from 'lucide-react';

// ❌ SUPPRIMÉ : import { cookies } from 'next/headers'

// Helpers
function formatMoney(amount: number, currency: 'EUR' | 'USD') {
  return new Intl.NumberFormat(currency === 'EUR' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
function convertEUR(amountEUR: number, currency: 'EUR' | 'USD', rateEURtoUSD = 1.08) {
  return currency === 'EUR' ? amountEUR : Math.round(amountEUR * rateEURtoUSD * 100) / 100;
}

interface Variation {
  name: string;
  stock_quantity: number;
  id: number;
  sku: number;
  image: { src: string };
  client_gros_price: number; // en EUR dans tes données
}

interface ProductPanier {
  id: number;
  id_product: number;
  name: string;
  image: string;
  images: { src: string }[];
  slug: string;
  sku: string;
  price: number; // prix dans la devise affichée
  weight: number;
  quantity: number;
  size: string;
  sizeId: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  images: { src: string }[];
  slug: string;
  price: number;
  sku: number;
  weight: number;
  type: string;
  short_description: string;
  description: string;
  cross_sell_ids: number[];
  upsell_ids: number[];
  meta_data: { key: string; value: any }[];
}

interface Props {
  product: Product[];
  upsellProducts: any[];
  crossSellProduct: any[];
  VariationProduitSimple: Variation[];      // principal
  VariationProduitSimple2: Variation[];     // (non utilisé ici)
  bundleProduct: Product | null;            // haut
  bundleProduct2: Product | null;           // bas
  VariationProduitSimpleTop: Variation[];   // pour le haut
  VariationProduitSimpleBottom: Variation[];// pour le bas

  // 🔸 NOUVEAU : devise + taux optionnel
  currency: 'EUR' | 'USD';
  rateEURtoUSD?: number; // ex: 1.08
}

const ProductClient: React.FC<Props> = ({
  product,
  upsellProducts,
  crossSellProduct,
  VariationProduitSimple,
  VariationProduitSimple2,
  bundleProduct,
  bundleProduct2,
  VariationProduitSimpleTop,
  VariationProduitSimpleBottom,
  currency,
  rateEURtoUSD = 1.08,
}) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectSizeId, setSelectSizeId] = useState('');
  const [selectVariationSku, setSelectVariationSku] = useState('');
  const [outOfStock, setOutOfStock] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [hoveredVariation, setHoveredVariation] = useState<string | null>(null);
  const [bundleQuantitiesTop, setBundleQuantitiesTop] = useState<Record<string, number>>({});
  const [bundleQuantitiesBottom, setBundleQuantitiesBottom] = useState<Record<string, number>>({});
  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  const handClickProduitCroise = (slug: string) => {
    router.push(`/produit/${slug}`);
  };

  const p = product[0];

  // ✅ Extraire le prix Client Gros (EUR) depuis meta_data (souvent string)
  const clientGrosPriceEUR = parseFloat(
    p.meta_data.find((item) => item.key === '_role_based_pricing_rules')
      ?.value?.['Client gros']?.regular_price ?? '0'
  ) || 0;

  const handleQuantityChange = (size: string, quantity: number) => {
    const variation = VariationProduitSimple.find(v => v.name === size);
    const maxStock = variation?.stock_quantity ?? 0;
    if (quantity > maxStock) quantity = maxStock;

    setQuantities(prev => ({ ...prev, [size]: quantity }));
  };

  const handleTopQuantityChange = (size: string, quantity: number) => {
    const variation = VariationProduitSimpleTop.find(v => v.name === size);
    const maxStock = variation?.stock_quantity ?? 0;
    setBundleQuantitiesTop(prev => ({ ...prev, [size]: Math.min(quantity, maxStock) }));
  };

  const handleBottomQuantityChange = (size: string, quantity: number) => {
    const variation = VariationProduitSimpleBottom.find(v => v.name === size);
    const maxStock = variation?.stock_quantity ?? 0;
    setBundleQuantitiesBottom(prev => ({ ...prev, [size]: Math.min(quantity, maxStock) }));
  };

  const handleAddToCart = () => {
    if (p.type === 'woosb') {
      // 🔷 Produit bundle : ajouter HAUT
      Object.entries(bundleQuantitiesTop).forEach(([sizeName, quantity]) => {
        if (quantity > 0) {
          const variation = VariationProduitSimpleTop.find(v => v.name === sizeName);
          if (!variation) return;

          // Prix client gros en EUR → converti selon currency
          const priceConverted = convertEUR(variation.client_gros_price, currency, rateEURtoUSD);

          const productToAdd: ProductPanier = {
            id: bundleProduct?.id ?? 0,
            id_product: bundleProduct?.id ?? 0,
            name: bundleProduct?.name ?? '',
            image: bundleProduct?.image ?? '',
            images: bundleProduct?.images ?? [],
            slug: bundleProduct?.slug ?? '',
            sku: String(variation.sku),
            price: priceConverted,
            weight: bundleProduct?.weight ?? 0,
            quantity,
            size: sizeName,
            sizeId: String(variation.id),
          };

          addToCart({
            name: productToAdd.name,
            quantity: productToAdd.quantity,
            images: productToAdd.images,
            image: productToAdd.image,
            price: productToAdd.price, // 💱 déjà converti
            weight: productToAdd.weight,
            sku: productToAdd.sku,
            size: productToAdd.size,
          });
        }
      });

      // 🔷 Produit bundle : ajouter BAS
      Object.entries(bundleQuantitiesBottom).forEach(([sizeName, quantity]) => {
        if (quantity > 0) {
          const variation = VariationProduitSimpleBottom.find(v => v.name === sizeName);
          if (!variation) return;

          const priceConverted = convertEUR(variation.client_gros_price, currency, rateEURtoUSD);

          const productToAdd: ProductPanier = {
            id: bundleProduct2?.id ?? 0,
            id_product: bundleProduct2?.id ?? 0,
            name: bundleProduct2?.name ?? '',
            image: bundleProduct2?.image ?? '',
            images: bundleProduct2?.images ?? [],
            slug: bundleProduct2?.slug ?? '',
            sku: String(variation.sku),
            price: priceConverted,
            weight: bundleProduct2?.weight ?? 0,
            quantity,
            size: sizeName,
            sizeId: String(variation.id),
          };

          addToCart({
            name: productToAdd.name,
            quantity: productToAdd.quantity,
            images: productToAdd.images,
            image: productToAdd.image,
            price: productToAdd.price, // 💱 déjà converti
            weight: productToAdd.weight,
            sku: productToAdd.sku,
            size: productToAdd.size,
          });
        }
      });
    } else {
      // 🔹 Produit simple
      Object.entries(quantities).forEach(([sizeName, quantity]) => {
        if (quantity > 0) {
          const variation = VariationProduitSimple.find(v => v.name === sizeName);
          if (!variation) return;

          // Pour le simple, tu utilisais clientGrosPrice venant du produit (EUR)
          const priceConverted = convertEUR(clientGrosPriceEUR, currency, rateEURtoUSD);

          const productToAdd: ProductPanier = {
            id: p.id,
            id_product: p.id,
            name: p.name,
            image: p.image,
            images: p.images,
            slug: p.slug,
            sku: String(variation.sku),
            price: priceConverted,
            weight: p.weight,
            quantity,
            size: sizeName,
            sizeId: String(variation.id),
          };

          addToCart({
            name: productToAdd.name,
            quantity: productToAdd.quantity,
            images: productToAdd.images,
            image: productToAdd.image,
            price: productToAdd.price, // 💱 déjà converti
            weight: productToAdd.weight,
            sku: productToAdd.sku,
            size: productToAdd.size,
          });
        }
      });
    }

    // router.push('/panier'); // si tu veux rediriger après
    setNotifMessage("Produit(s) ajouté(s) au panier avec succès !");
  };

    const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null);

    useEffect(() => {
        const storedisLoggedInDistributeur = localStorage.getItem("isLoggedInDistributeur");
        if (storedisLoggedInDistributeur) {
            setIsLoggedIn(storedisLoggedInDistributeur);
        }
    }, []);

  return (
    <Layout2>
      <div className="max-w-full flex justify-center">
        <div className="mt-20 md:flex justify-center">
          <section>
            <div className="md:flex md:justify-center max-sm:flex cursor-zoom-in max-sm:w-36 max-sm:ml-16 ">
              <Image className="mr-5" alt="img-close" src={p.images[0]?.src || ''} width={400} height={0} onClick={() => setSelectedImage(product[0].images[0].src)} />
              <Image className="mr-5" alt="img-close" src={p.images[1]?.src || ''} width={400} height={0} onClick={() => setSelectedImage(product[0].images[1].src)} />
            </div>
            <div className="mt-5 md:flex md:justify-evenly cursor-zoom-in max-sm:flex max-sm:w-28 max-sm:ml-6">
              <Image className="mr-5" alt="img-close" src={p.images[2]?.src || ''} width={260} height={0} onClick={() => setSelectedImage(product[0].images[2].src)} />
              <Image className="mr-5" alt="img-close" src={p.images[3]?.src || ''} width={260} height={0} onClick={() => setSelectedImage(product[0].images[3].src)} />
              <Image className="mr-5" alt="img-close" src={p.images[4]?.src || ''} width={260} height={0} onClick={() => setSelectedImage(product[0].images[4].src)} />
            </div>
            {selectedImage && <Modal imageSrc={selectedImage} onClose={() => setSelectedImage(null)} />}
          </section>

          <section className="ml-10">
            <div>
              <h1 className="font-yanone text-2xl max-sm:mt-5">{product[0].name}</h1>
              <div>
                <PriceDisplay
                  price={clientGrosPriceEUR}
                  grosPrice={clientGrosPriceEUR}
                  className="font-inter font-medium"
                />
              </div>
            </div>

            <div className="flex">
              {crossSellProduct.length > 0 && (
                <div className="mt-5">
                  <h2 className="mb-2 font-medium text-base">Autres coloris</h2>
                  <div className="flex">
                    {crossSellProduct.map((item) => (
                      <div
                        key={item.id}
                        className="relative mt-3 mr-3 cursor-pointer"
                        onMouseEnter={() => setHoveredVariation(item.name)}
                        onMouseLeave={() => setHoveredVariation(null)}
                        onClick={() => handClickProduitCroise(item.slug)}
                      >
                        <Image
                          className="rounded-full object-cover w-7 h-7 hover:ring-2 hover:ring-gray-300"
                          alt={item.name}
                          src={item.images}
                          width={50}
                          height={50}
                        />
                        {hoveredVariation === item.name && (
                          <div className="absolute top-10 left-0 bg-white p-2 rounded-md shadow-md font-inter text-sm z-10">
                            {item.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* GRILLE DES TAILLES */}
            <div className='mt-10'>
              <div>
                <h1 className='mb-2 font-medium text-base'>Tailles</h1>
              </div>

              {/* PRODUIT BUNDLE */}
              {p.type === 'woosb' ? (
                <>
                  {/* Section HAUT */}
                  <h2 className="mt-4 mb-2 text-sm">Haut :</h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {VariationProduitSimpleTop.map((option) => {
                      const isOutOfStock = option.stock_quantity === 0 || option.stock_quantity === null;
                      return (
                        <div
                          key={option.id}
                          className={`flex flex-col items-center justify-center border rounded-md p-1 w-16 h-16 text-[10px]
                          ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white hover:border-black cursor-pointer'}
                          `}
                        >
                          <span className="font-medium">{option.name}</span>
                          <input
                            type="number"
                            min={0}
                            max={option.stock_quantity ?? 1}
                            value={bundleQuantitiesTop[option.name] || ''}
                            disabled={isOutOfStock}
                            className="w-10 h-7 mt-1 border text-center text-xs rounded-sm"
                            onChange={(e) => {
                              const qty = parseInt(e.target.value);
                              if (!isNaN(qty)) handleTopQuantityChange(option.name, qty);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Section BAS */}
                  <h2 className="mt-4 mb-2 text-sm">Bas :</h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {VariationProduitSimpleBottom.map((option) => {
                      const isOutOfStock = option.stock_quantity === 0 || option.stock_quantity === null;
                      return (
                        <div
                          key={option.id}
                          className={`flex flex-col items-center justify-center border rounded-md p-1 w-16 h-16 text-[10px]
                          ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white hover:border-black cursor-pointer'}
                          `}
                        >
                          <span className="font-medium">{option.name}</span>
                          <input
                            type="number"
                            min={0}
                            max={option.stock_quantity ?? 1}
                            value={bundleQuantitiesBottom[option.name] || ''}
                            disabled={isOutOfStock}
                            className="w-10 h-7 mt-1 border text-center text-xs rounded-sm"
                            onChange={(e) => {
                              const qty = parseInt(e.target.value);
                              if (!isNaN(qty)) handleBottomQuantityChange(option.name, qty);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2 mt-6">
                  {/* PRODUIT SIMPLE */}
                  {VariationProduitSimple.map((option: Variation) => {
                    const isOutOfStock = option.stock_quantity === 0 || option.stock_quantity === null;

                    return (
                      <div
                        key={option.id}
                        className={`flex flex-col items-center justify-center border rounded-md p-1 w-16 h-16 text-[10px]
                        ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white hover:border-black cursor-pointer'}
                      `}
                        onClick={() => {
                          if (!isOutOfStock) {
                            setSelectedSize(option.name);
                            setSelectSizeId(String(option.id));
                            setSelectVariationSku(String(option.sku));
                            setOutOfStock(false);
                          }
                        }}
                      >
                        <span className="font-medium">{option.name}</span>
                        <input
                          type="number"
                          min={0}
                          max={option.stock_quantity ?? 1}
                          value={quantities[option.name] || ''}
                          disabled={isOutOfStock}
                          className="w-10 h-7 mt-1 border text-center text-xs rounded-sm"
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value);
                            if (!isNaN(quantity) && quantity >= 0) {
                              handleQuantityChange(option.name, quantity);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BOUTON AJOUTER AU PANIER */}
              <button
                type="button"
                onClick={() => { if (isLoggedIn !== 'true') return; handleAddToCart(); }}
                disabled={isLoggedIn !== 'true'}
                className={`mt-10 font-inter p-2 border rounded-lg bg-black text-white hover:bg-gray-800 text-sm w-64 disabled:cursor-not-allowed ${
                  isLoggedIn !== 'true'
                    ? 'opacity-50'
                    : 'text-white bg-black cursor-pointer hover:bg-color-black-soraya'
                }`}
              >
                Ajouter au panier
              </button>
              <div>
                {isLoggedIn !== 'true' && (
                  <div className="flex items-center text-red-600 mt-10">
                    <AlertCircleIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm w-60">Veuillez vous connecter pour ajouter des produits au panier.</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-start mt-10">
                <div className="flex justify-center w-72 h-0.5 bg-gray-300"></div>
              </div>
              <div className="mt-7">
                <div className="flex justify-start space-x-4">
                  <h1
                    className={`font-inter text-lg cursor-pointer ${activeTab === 'details' ? 'text-black underline' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Détails
                  </h1>
                  <h1
                    className={`font-inter text-lg cursor-pointer ${activeTab === 'description' ? 'text-black underline' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </h1>
                </div>

                <div className="mt-5">
                  {activeTab === 'details' && (
                    <div className="w-96 font-inter font-light">
                      <div dangerouslySetInnerHTML={{ __html: product[0].short_description }}></div>
                    </div>
                  )}
                  {activeTab === 'description' && (
                    <div className="w-96 font-inter font-light">
                      <div dangerouslySetInnerHTML={{ __html: product[0].description }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {notifMessage && (
        <div className="fixed bottom-6 left-6 w-80 z-50">
          <Alert variant="default" className="bg-green-100 border-green-500 text-green-700">
            <AlertTitle className="text-green-700">Succès</AlertTitle>
            <AlertDescription className='text-black'>
              {notifMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Layout2>
  );
};

export default ProductClient;
