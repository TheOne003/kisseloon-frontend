export const DEMO_PLATFORM_SELECTION = {
  itemTitle: 'Chicken Dum Biryani',
  restaurantLine: 'Paradise Restaurant • North Indian',
  image: require('../assets/platform/selected-biryani.jpg'),
  platforms: [
    {
      id: 'blinkit',
      name: 'Blinkit',
      letter: 'B',
      letterColor: '#fc8019',
      badgeBg: '#fff1ee',
      time: '30–35 min',
      price: 220,
    },
    {
      id: 'zepto',
      name: 'Zepto',
      letter: 'Z',
      letterColor: '#e23744',
      badgeBg: '#feeceb',
      time: '35–40 min',
      price: 205,
    },
    {
      id: 'instamart',
      name: 'Instamart',
      letter: 'I',
      letterColor: '#f2702e',
      badgeBg: '#fff0e5',
      price: 190,
      best: true,
      saveLabel: 'Save ₹30 vs highest',
    },
  ],
};

export function getPlatformSelectionDemo({ item, restaurant, quantity = 1 } = {}) {
  const highest = DEMO_PLATFORM_SELECTION.platforms[0].price;
  const best = DEMO_PLATFORM_SELECTION.platforms.find((p) => p.best);
  const saveAmount = highest - (best?.price || highest);

  return {
    ...DEMO_PLATFORM_SELECTION,
    quantity,
    itemTitle: item?.name?.replace('Chicken Hyderabadi Dum Biryani', 'Chicken Dum Biryani')
      || DEMO_PLATFORM_SELECTION.itemTitle,
    restaurantLine: restaurant
      ? `${restaurant.name} • ${restaurant.cuisine}`
      : DEMO_PLATFORM_SELECTION.restaurantLine,
    image: item?.image || item?.detailImage || DEMO_PLATFORM_SELECTION.image,
    bestPrice: best?.price || 190,
    highestPrice: highest,
    saveAmount,
    defaultPlatformId: best?.id || 'instamart',
  };
}
