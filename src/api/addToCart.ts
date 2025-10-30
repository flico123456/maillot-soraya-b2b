// cart.ts
interface Product {
  name: string;
  quantity: number;
  images: { src: string }[];
  image: string;
  price: number;
  weight: number;
  sku: string;
  size: string;
}

type CartItem = Product & { id: string };
type Cart = CartItem[];

export const addToCart = async (product: Product): Promise<void> => {
  const cart: Cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItemIndex = cart.findIndex((item) => item.name === product.name && item.size === product.size);

  if (existingItemIndex !== -1) {
    // Si le produit existe déjà dans le panier, mettez à jour la quantité
    cart[existingItemIndex].quantity += product.quantity;
  } else {
    // Sinon, ajoutez un nouvel élément au panier
    const uniqueId = `${product.sku}-${product.size}-${Date.now()}-${Math.random()}`;
    const newItem: CartItem = {
      ...product,
      id: uniqueId,
    };
    cart.push(newItem);
  }

  localStorage.setItem('cart', JSON.stringify(cart));

};
