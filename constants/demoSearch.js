export const DEMO_SEARCHES = {
  'chicken biryani': {
    query: 'Chicken Biryani',
    location: 'Koramangala, Bengaluru',
    restaurants: [
      {
        id: 'biryani-by-kilo',
        name: 'Biryani By Kilo',
        cuisine: 'Hyderabadi Biryani',
        rating: '4.3',
        time: '35–45 min',
        platforms: ['swiggy', 'zomato', 'toing'],
        image: require('../assets/search/biryani-by-kilo.jpg'),
      },
      {
        id: 'dum-safar',
        name: 'Dum Safar Biryani',
        cuisine: 'North Indian',
        rating: '4.2',
        time: '20–25 min',
        platforms: ['swiggy', 'zomato', 'toing'],
        image: require('../assets/search/dum-safar.jpg'),
      },
      {
        id: 'oudh-1590',
        name: 'Oudh 1590',
        cuisine: 'Mughlai',
        rating: '4.2',
        time: '25–35 min',
        platforms: ['swiggy', 'zomato', 'toing'],
        image: require('../assets/search/oudh-1590.jpg'),
      },
      {
        id: 'khadak-singh',
        name: 'Khadak Singh Da Dhaba',
        cuisine: 'North Indian',
        rating: '4.1',
        time: '20–25 min',
        platforms: ['swiggy', 'zomato', 'toing'],
        image: require('../assets/search/khadak-singh.jpg'),
      },
      {
        id: 'bikkgane',
        name: 'Bikkgane Biryani',
        cuisine: 'Biryani',
        rating: '4.4',
        time: '20–25 min',
        platforms: ['swiggy', 'zomato', 'toing'],
        image: require('../assets/search/bikkgane.jpg'),
      },
    ],
  },
};

export function normalizeSearchQuery(value = '') {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getDemoSearchResult(query) {
  return DEMO_SEARCHES[normalizeSearchQuery(query)] ?? null;
}
