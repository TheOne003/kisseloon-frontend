export const DEMO_RESTAURANTS = {
  'biryani-by-kilo': {
    id: 'biryani-by-kilo',
    name: 'Biryani By Kilo',
    area: 'Koramangala',
    cuisine: 'Hyderabadi Biryani',
    rating: '4.3',
    reviews: '12.4K',
    time: '35–45 mins',
    open: true,
    heroImage: require('../assets/restaurant/hero-biryani-by-kilo.jpg'),
    categories: ['Popular', 'Chicken Biryani', 'Mutton Biryani'],
    menu: [
      {
        id: 'chicken-hyderabadi',
        name: 'Chicken Hyderabadi Dum Biryani',
        tag: 'Best Seller',
        dietary: 'NON-VEG',
        description:
          'Tender chicken marinated in traditional Hyderabadi spices, layered with fragrant basmati rice and slow cooked.',
        detailImage: require('../assets/item/chicken-hyderabadi-hero.jpg'),
        image: require('../assets/restaurant/chicken-hyderabadi.jpg'),
        platforms: [
          {
            id: 'swiggy',
            label: 'Swiggy',
            letter: 'S',
            color: '#ff5200',
            bg: 'rgba(255,82,0,0.1)',
            price: 525,
            note: 'FREE delivery above ₹199',
          },
          {
            id: 'zomato',
            label: 'Zomato',
            letter: 'Z',
            color: '#e23744',
            bg: 'rgba(226,55,68,0.1)',
            price: 510,
            note: 'FREE delivery above ₹149',
          },
          {
            id: 'toing',
            label: 'Toing',
            letter: 'T',
            color: '#059669',
            bg: '#059669',
            price: 490,
            note: 'FREE delivery above ₹199',
            best: true,
          },
        ],
        prices: [
          { id: 'swiggy', label: 'Swiggy', letter: 'S', color: '#ff5200', price: 525 },
          { id: 'zomato', label: 'Zomato', letter: 'Z', color: '#e23744', price: 510 },
          { id: 'toing', label: 'Toing', letter: 'T', color: '#059669', price: 490, best: true },
        ],
        savingsText: 'You save ₹35 on Toing',
        bestPriceText: '₹490 — Best Price on Toing • You save ₹35',
      },
      {
        id: 'chicken-65',
        name: 'Chicken 65 Biryani',
        tag: 'Spicy Favorite',
        dietary: 'NON-VEG',
        description:
          'Spicy Chicken 65 pieces layered with aromatic basmati rice and signature masala for a bold biryani bite.',
        detailImage: require('../assets/restaurant/chicken-65.jpg'),
        image: require('../assets/restaurant/chicken-65.jpg'),
        platforms: [
          {
            id: 'swiggy',
            label: 'Swiggy',
            letter: 'S',
            color: '#ff5200',
            bg: 'rgba(255,82,0,0.1)',
            price: 445,
            note: 'FREE delivery above ₹199',
          },
          {
            id: 'zomato',
            label: 'Zomato',
            letter: 'Z',
            color: '#e23744',
            bg: 'rgba(226,55,68,0.1)',
            price: 430,
            note: 'FREE delivery above ₹149',
          },
          {
            id: 'toing',
            label: 'Toing',
            letter: 'T',
            color: '#059669',
            bg: '#059669',
            price: 410,
            note: 'FREE delivery above ₹199',
            best: true,
          },
        ],
        prices: [
          { id: 'swiggy', label: 'Swiggy', letter: 'S', color: '#ff5200', price: 445 },
          { id: 'zomato', label: 'Zomato', letter: 'Z', color: '#e23744', price: 430 },
          { id: 'toing', label: 'Toing', letter: 'T', color: '#059669', price: 410, best: true },
        ],
        savingsText: 'You save ₹35 on Toing',
        bestPriceText: '₹410 — Best Price on Toing • You save ₹35',
      },
      {
        id: 'paneer-biryani',
        name: 'Paneer Biryani',
        tag: 'Pure Veg',
        dietary: 'VEG',
        description:
          'Soft paneer cubes cooked with fragrant spices and layered with long-grain basmati rice.',
        detailImage: require('../assets/restaurant/paneer-biryani.jpg'),
        image: require('../assets/restaurant/paneer-biryani.jpg'),
        platforms: [
          {
            id: 'swiggy',
            label: 'Swiggy',
            letter: 'S',
            color: '#ff5200',
            bg: 'rgba(255,82,0,0.1)',
            price: 399,
            note: 'FREE delivery above ₹199',
          },
          {
            id: 'zomato',
            label: 'Zomato',
            letter: 'Z',
            color: '#e23744',
            bg: 'rgba(226,55,68,0.1)',
            price: 389,
            note: 'FREE delivery above ₹149',
          },
          {
            id: 'toing',
            label: 'Toing',
            letter: 'T',
            color: '#059669',
            bg: '#059669',
            price: 379,
            note: 'FREE delivery above ₹199',
            best: true,
          },
        ],
        prices: [
          { id: 'swiggy', label: 'Swiggy', letter: 'S', color: '#ff5200', price: 399 },
          { id: 'zomato', label: 'Zomato', letter: 'Z', color: '#e23744', price: 389 },
          { id: 'toing', label: 'Toing', letter: 'T', color: '#059669', price: 379, best: true },
        ],
        savingsText: 'You save ₹20 on Toing',
        bestPriceText: '₹379 — Best Price on Toing • You save ₹20',
      },
    ],
  },
};

export function getDemoRestaurant(restaurantId) {
  return DEMO_RESTAURANTS[restaurantId] ?? null;
}

export function getDemoRestaurantForCard(restaurant) {
  if (!restaurant) return null;
  const exact = getDemoRestaurant(restaurant.id);
  if (exact) return exact;

  return {
    ...DEMO_RESTAURANTS['biryani-by-kilo'],
    id: restaurant.id,
    name: restaurant.name,
    area: 'Koramangala',
    cuisine: restaurant.cuisine,
    rating: restaurant.rating,
    time: restaurant.time?.replace('min', 'mins') || '35–45 mins',
  };
}
