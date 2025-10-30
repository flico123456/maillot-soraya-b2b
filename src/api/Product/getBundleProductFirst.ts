const getBundleProductFirst = async (woosb_ids: string) => {
    const baseURL = `https://maillotsoraya-conception.com/wp-json/customAPI/v1/getBundleProduct/${woosb_ids}`;
  
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response)
  
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du produit');
    }
    
    return response.json();
  };
  
  export default getBundleProductFirst;