const getProduct = async (slug: string) => {
  const baseURL = `https://maillotsoraya-conception.com/wp-json/wc/v3/products?slug=${slug}`;
  const username = 'ck_2a1fa890ddee2ebc1568c314734f51055eae2cba';
  const password = 'cs_0ad45ea3da9765643738c94224a1fc58cbf341a7';

  const response = await fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(username + ':' + password)}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du produit');
  }

  return response.json();
};

export default getProduct;