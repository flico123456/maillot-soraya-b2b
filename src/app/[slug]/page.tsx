// src/app/[slug]/page.tsx
import Layout2 from '@/components/Layout2';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PriceDisplay from '@/components/Price';

interface Categorie {
  id: string | number;
  name: string;
  images: { src: string }[];
  slug: string;
  description: string;
  yoast_head_json?: { title: string; description: string };
}

interface MetaDataItem {
  key: string;
  value: any;
}

interface Product {
  categories: any;
  id: string | number;
  name: string;
  images: { src: string }[];
  slug: string;
  weight: number | string;
  price: number | string;
  meta_data: MetaDataItem[];
  clientGrosPrice?: number | string;
}

// Util: Basic auth côté Node (pas de btoa en server)
const BASIC_AUTH =
  'Basic ' +
  Buffer.from(
    'ck_2a1fa890ddee2ebc1568c314734f51055eae2cba:cs_0ad45ea3da9765643738c94224a1fc58cbf341a7'
  ).toString('base64');

// 🔁 Génération des routes statiques
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const res = await fetch(
    'https://maillotsoraya-conception.com/wp-json/wc/v3/products/categories?per_page=100',
    { headers: { Authorization: BASIC_AUTH }, cache: 'no-store' }
  );
  if (!res.ok) return [];

  const categories = (await res.json()) as Categorie[];
  return (categories || []).map((category) => ({ slug: category.slug }));
}

// 🔁 Chargement des données pour chaque page
async function getCategoryPageData(slug: string) {
  const res = await fetch(
    `https://maillotsoraya-conception.com/wp-json/wc/v3/products/categories?slug=${encodeURIComponent(
      slug
    )}`,
    { headers: { Authorization: BASIC_AUTH }, cache: 'no-store' }
  );

  if (!res.ok) return null;

  const categoryData = (await res.json()) as Categorie[];
  if (!categoryData?.[0]) return null;

  const categoryId = categoryData[0].id;

  const productRes = await fetch(
    `https://maillotsoraya-conception.com/wp-json/wc/v3/products?category=${categoryId}&per_page=100&catalog_visibility=visible`,
    { headers: { Authorization: BASIC_AUTH }, cache: 'no-store' }
  );

  if (!productRes.ok) return null;

  const productData = (await productRes.json()) as any[];

  const products: Product[] = (productData || []).map((product: any) => {
    const meta = product.meta_data || [];
    const clientGrosPrice =
      meta.find((item: any) => item.key === '_role_based_pricing_rules')
        ?.value?.['Client gros']?.regular_price;

    return {
      categories: product.categories,
      id: product.id,
      name: product.name,
      images: product.images,
      slug: product.slug,
      weight: product.weight,
      price: product.price,
      meta_data: meta,
      clientGrosPrice,
    };
  });

  return { category: categoryData[0], products };
}

// ✅ Page — neutralise toute contrainte de PageProps globale
export default async function CategorySlugPage(props: any) {
  const slug: string | undefined = props?.params?.slug;
  if (!slug) notFound();

  const data = await getCategoryPageData(slug!);
  if (!data) notFound();

  const { category, products } = data;

  return (
    <Layout2>
      <div>
        <div className="flex justify-center mt-20 max-sm:text-center">
          <h1 className="font-yanone text-2xl">Collection : {category.name}</h1>
        </div>

        <ul className="flex justify-center flex-wrap mt-20">
          {products.map((product) => (
            <li
              key={product.id}
              className="max-sm:w-2/4 max-sm:p-3 w-1/4 max-w-sm flex justify-center mt-10"
            >
              <Link href={`/produit/${product.slug}`} className="cursor-pointer">
                <div className="cursor-pointer relative">
                  <Image
                    className="h-460 w-340 max-sm:h-400 object-cover transition-opacity duration-300 p-2"
                    alt={product.name}
                    src={product.images?.[0]?.src || '/placeholder.png'}
                    width={460}
                    height={340}
                  />
                  <div className="flex justify-center mt-3">
                    <h1 className="font-inter text-base max-sm:text-center">
                      {product.name}
                    </h1>
                  </div>
                  <div className="flex justify-center">
                    <PriceDisplay
                      price={product.price}
                      grosPrice={product.clientGrosPrice}
                      className=""
                    />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Description déroulante */}
        <div className="mt-32 flex flex-col items-center">
          <details className="cursor-pointer w-full max-w-4xl">
            <summary className="text-center font-inter text-base hover:underline">
              Description de la page
            </summary>
            <div className="mt-5 text-center px-4 xl:px-0">
              <p
                className="font-inter text-base"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            </div>
          </details>
        </div>
      </div>
    </Layout2>
  );
}
