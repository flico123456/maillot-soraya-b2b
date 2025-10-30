const getVariationForSimpleProduct = async (product_id: number) => {
  const baseURL = `https://maillotsoraya-conception.com/wp-json/customAPI/v1/getVariationForSimpleProduct/${product_id}`;

  const response = await fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du produit');
  }

  return response.json();
};

export default getVariationForSimpleProduct;