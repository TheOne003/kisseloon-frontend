import { getPlatformIcon } from './platformIcons';

export const GROCERY_RACERS = [
  {
    id: 'blinkit',
    name: 'Blinkit',
    price: 74,
    priceColor: '#fea619',
    laneBg: '#fff8e1',
    trailColor: 'rgba(254,166,25,0.33)',
    logo: getPlatformIcon('blinkit'),
    progress: 0.42,
    duration: 2200,
  },
  {
    id: 'zepto',
    name: 'Zepto',
    price: 76,
    priceColor: '#e11d48',
    laneBg: '#faf0ff',
    trailColor: 'rgba(82,0,106,0.28)',
    logo: getPlatformIcon('zepto'),
    progress: 0.32,
    duration: 2400,
  },
  {
    id: 'instamart',
    name: 'Instamart',
    price: 72,
    priceColor: '#059669',
    laneBg: '#eefbf5',
    trailColor: 'rgba(0,181,98,0.33)',
    logo: getPlatformIcon('instamart'),
    progress: 0.86,
    duration: 1700,
    winner: true,
  },
];

export const GROCERY_RACE_COPY = {
  savingsTitle: 'Save ₹4 on your order!',
  savingsSubtitle:
    'Instamart has the lowest price today. Compare, order and save instantly.',
  proceedLabel: 'Proceed with Instamart',
};

export function getGroceryRaceDemo(product) {
  const platforms = product?.platforms?.filter((p) => !p.unavailable) || [];
  if (platforms.length < 2) {
    return {
      racers: GROCERY_RACERS,
      ...GROCERY_RACE_COPY,
    };
  }

  const prices = platforms.map((p) => p.price);
  const bestPrice = Math.min(...prices);
  const highest = Math.max(...prices);
  const saveAmount = highest - bestPrice;
  const winner = platforms.find((p) => p.price === bestPrice);

  const progressByRank = [0.42, 0.55, 0.86];
  const sorted = [...platforms].sort((a, b) => a.price - b.price);
  const progressMap = Object.fromEntries(
    sorted.map((p, index) => [
      p.id,
      progressByRank[Math.min(index, progressByRank.length - 1)],
    ])
  );

  const racers = platforms.map((platform, index) => {
    const isWinner = platform.id === winner?.id;
    return {
      id: platform.id,
      name: platform.name,
      price: platform.price,
      priceColor: isWinner ? '#059669' : platform.color || '#0b1c30',
      laneBg: isWinner
        ? '#eefbf5'
        : platform.id === 'zepto'
          ? '#faf0ff'
          : '#fff8e1',
      trailColor: isWinner
        ? 'rgba(0,181,98,0.33)'
        : platform.id === 'zepto'
          ? 'rgba(82,0,106,0.28)'
          : 'rgba(254,166,25,0.33)',
      logo: getPlatformIcon(platform),
      progress: progressMap[platform.id] ?? 0.4 + index * 0.15,
      duration: isWinner ? 1700 : 2100 + index * 150,
      winner: isWinner,
    };
  });

  return {
    racers,
    savingsTitle: `Save ₹${saveAmount} on your order!`,
    savingsSubtitle: `${winner?.name || 'Instamart'} has the lowest price today. Compare, order and save instantly.`,
    proceedLabel: `Proceed with ${winner?.name || 'Instamart'}`,
  };
}
