import getProduct from '@/api/Product/getProduct';
import getUpsellProducts from '@/api/Product/getUpsellProduct';
import getCrossSellProduct from '@/api/Product/getCrossProduct';
import getVariationForSimpleProduct from '@/api/Product/getVariationsForSimpleProduct';
import getBundleProductFirst from '@/api/Product/getBundleProductFirst';
import ProductClient from './ProductClient';
import { cookies } from 'next/headers';

export default async function ProductSlugPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const product = await getProduct(slug);

  const upsellProducts = await getUpsellProducts(product[0].upsell_ids ?? []);
  const crossSellProduct = await getCrossSellProduct(product[0].cross_sell_ids ?? []);

  const bundleMeta = product[0].meta_data.find((d: { key: string }) => d.key === 'woosb_ids');
  let bundleIds: string[] = [];

  // ✅ Traitement du format réel : { 'uniqueKey': { id: '123' }, ... }
  if (bundleMeta && typeof bundleMeta.value === 'object' && !Array.isArray(bundleMeta.value)) {
    bundleIds = Object.values(bundleMeta.value)
      .map((entry: any) => entry.id?.toString())
      .filter(Boolean);
  }

  const bundleProduct = bundleIds[0] ? await getBundleProductFirst(bundleIds[0]) : null;
  const bundleProduct2 = bundleIds[1] ? await getBundleProductFirst(bundleIds[1]) : null;

  const VariationProduitSimple = await getVariationForSimpleProduct(product[0].id);

  const VariationProduitSimpleTop = bundleProduct?.id
    ? await getVariationForSimpleProduct(bundleProduct.id)
    : [];

  const VariationProduitSimpleBottom = bundleProduct2?.id
    ? await getVariationForSimpleProduct(bundleProduct2.id)
    : [];

  // 🔹 LIRE LA DEVISE DANS LE COOKIE ET LA PASSER AU COMPOSANT CLIENT
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get('currency')?.value;
  const currency: 'EUR' | 'USD' = cookieVal === 'EUR' ? 'EUR' : 'USD';

  // (optionnel) ton taux de conversion du jour si tu veux l’utiliser
  const rateEURtoUSD = 1.08;
  
  return (
    <ProductClient
      product={product}
      upsellProducts={upsellProducts}
      crossSellProduct={crossSellProduct}
      VariationProduitSimple={VariationProduitSimple}
      VariationProduitSimple2={VariationProduitSimple} // si tu en as encore besoin
      bundleProduct={bundleProduct}
      bundleProduct2={bundleProduct2}
      VariationProduitSimpleTop={VariationProduitSimpleTop}
      VariationProduitSimpleBottom={VariationProduitSimpleBottom}
      currency={currency}               
      rateEURtoUSD={rateEURtoUSD}        
    />
  );
}
