const getUpsellProducts = async (upsellIds: number[]) => {
    const username = 'ck_2a1fa890ddee2ebc1568c314734f51055eae2cba';
    const password = 'cs_0ad45ea3da9765643738c94224a1fc58cbf341a7';
    const products = [];

    // Limiter à récupérer les 3 premiers produits
    const ids = upsellIds.slice(0, 3).join(','); // Prend les 3 premiers IDs
    const url = `https://maillotsoraya-conception.com/wp-json/customAPI/v1/getUpsellProduct/${ids}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des produits upsell`);
        }
    
        const productsData = await response.json();
        return productsData;
    } catch (error) {
        console.error(error);
    }
};

export default getUpsellProducts;
