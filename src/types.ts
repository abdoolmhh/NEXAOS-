export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  calories: number;
  weight: string;
  rating: number;
  reviews: number;
  category: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Screen = 'product' | 'cart' | 'success';
