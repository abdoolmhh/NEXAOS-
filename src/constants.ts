import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Green Goddess Pizza',
    subtitle: 'Fresh line pizza',
    price: 12.75,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    calories: 1250,
    weight: '530 g',
    rating: 4.5,
    reviews: 587,
    category: 'pizza',
    description: 'A vibrant green vegetable pizza topped with fresh microgreens, avocado, and a light pesto base.'
  },
  {
    id: '2',
    name: 'Pineapple Natural',
    subtitle: 'Natural drink',
    price: 6.05,
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&q=80&w=800',
    calories: 120,
    weight: '350 ml',
    rating: 4.8,
    reviews: 215,
    category: 'drink',
    description: 'Freshly squeezed pineapple juice with a hint of mint.'
  },
  {
    id: '3',
    name: 'Mushroom Burger',
    subtitle: 'Fresh line burgers',
    price: 10.55,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    calories: 850,
    weight: '420 g',
    rating: 4.3,
    reviews: 432,
    category: 'burger',
    description: 'Juicy plant-based patty with sauteed mushrooms and vegan cheese.'
  }
];

export const CATEGORIES = [
  { id: 'cupcake', icon: '🧁' },
  { id: 'pizza', icon: '🍕' },
  { id: 'burger', icon: '🍔' },
  { id: 'coffee', icon: '☕' }
];
