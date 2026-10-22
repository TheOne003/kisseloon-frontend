/** Shared demo grocery catalog used by home, search, and results. */

const PLATFORMS = (prices, bestId = 'instamart') => [
  {
    id: 'blinkit',
    name: 'Blinkit',
    price: prices.blinkit,
    time: '11 mins',
    letter: 'B',
    color: '#fea619',
    best: bestId === 'blinkit',
    unavailable: prices.blinkit == null,
  },
  {
    id: 'zepto',
    name: 'Zepto',
    price: prices.zepto,
    time: '8 mins',
    letter: 'Z',
    color: '#e11d48',
    best: bestId === 'zepto',
    unavailable: prices.zepto == null,
  },
  {
    id: 'instamart',
    name: 'Instamart',
    price: prices.instamart,
    time: '14 mins',
    letter: 'I',
    color: '#f97316',
    best: bestId === 'instamart',
    unavailable: prices.instamart == null,
  },
].map((p) => {
  if (p.unavailable) {
    const { price, time, best, ...rest } = p;
    return rest;
  }
  return p;
});

function bestOf(platforms) {
  const best = platforms.find((p) => p.best) || platforms.find((p) => p.price != null);
  return {
    bestPlatform: best?.name || 'Instamart',
    bestPrice: best?.price || 0,
  };
}

function product(entry) {
  const platforms = PLATFORMS(entry.prices, entry.bestId);
  const { bestPlatform, bestPrice } = bestOf(platforms);
  const saveAmount = Math.max(
    0,
    Math.max(...platforms.filter((p) => p.price != null).map((p) => p.price)) -
      bestPrice
  );
  return {
    id: entry.id,
    brand: entry.brand,
    name: entry.name,
    details: entry.details,
    packSize: entry.packSize || entry.details.split('•')[0]?.trim(),
    attribute: entry.attribute || entry.details.split('•')[1]?.trim(),
    description: entry.description,
    stock: entry.stock || 'in-stock',
    stockLabel: entry.stockLabel || 'In Stock',
    image: entry.image,
    saveAmount,
    bestPlatform,
    bestPrice,
    platforms,
    category: entry.category,
  };
}

export const GROCERY_CATALOG = [
  product({
    id: 'amul-gold-1l',
    brand: 'AMUL',
    name: 'Amul Gold Milk',
    details: '1 Litre • Full Cream 6% Fat',
    description: 'Pasteurized full-cream milk for everyday use.',
    image: require('../assets/grocery/amul-gold-1l.jpg'),
    prices: { blinkit: 74, zepto: 76, instamart: 72 },
    bestId: 'instamart',
    category: 'Milk & Dairy',
  }),
  product({
    id: 'amul-taaza-1l',
    brand: 'AMUL',
    name: 'Amul Taaza Milk',
    details: '1 Litre • Toned Milk 3% Fat',
    description: 'Light toned milk, everyday fresh.',
    image: require('../assets/grocery/amul-taaza-1l.jpg'),
    prices: { blinkit: 58, zepto: 60, instamart: 57 },
    bestId: 'instamart',
    category: 'Milk & Dairy',
  }),
  product({
    id: 'amul-gold-500',
    brand: 'AMUL',
    name: 'Amul Gold Milk 500 ml',
    details: '500 ml • Full Cream 6% Fat',
    description: 'Handy half-litre pouch of Amul Gold.',
    image: require('../assets/grocery/amul-gold-500.jpg'),
    prices: { blinkit: 38, zepto: 39, instamart: 37 },
    bestId: 'instamart',
    category: 'Milk & Dairy',
  }),
  product({
    id: 'amul-cow-1l',
    brand: 'AMUL',
    name: 'Amul Cow Milk',
    details: '1 Litre • Pure Cow Milk 3.5% Fat',
    description: 'Pure cow milk with balanced creaminess.',
    image: require('../assets/grocery/amul-cow-1l.jpg'),
    prices: { blinkit: 56, zepto: null, instamart: 58 },
    bestId: 'blinkit',
    category: 'Milk & Dairy',
    stock: 'fast-moving',
    stockLabel: 'Fast Moving',
  }),
  product({
    id: 'banana-robusta',
    brand: 'FRESH',
    name: 'Robusta Banana',
    details: '1 dozen • Fresh',
    description: 'Naturally ripened robusta bananas.',
    image: require('../assets/grocery/amul-gold-1l.jpg'),
    prices: { blinkit: 48, zepto: 52, instamart: 45 },
    bestId: 'instamart',
    category: 'Fruits',
  }),
  product({
    id: 'apple-shimla',
    brand: 'FRESH',
    name: 'Shimla Apple',
    details: '1 kg • Premium',
    description: 'Crisp Shimla apples, hand-picked.',
    image: require('../assets/grocery/amul-taaza-1l.jpg'),
    prices: { blinkit: 160, zepto: 155, instamart: 168 },
    bestId: 'zepto',
    category: 'Fruits',
  }),
  product({
    id: 'orange-nagpur',
    brand: 'FRESH',
    name: 'Nagpur Orange',
    details: '1 kg • Juicy',
    description: 'Sweet Nagpur oranges for fresh juice.',
    image: require('../assets/grocery/amul-cow-1l.jpg'),
    prices: { blinkit: 72, zepto: 70, instamart: 75 },
    bestId: 'zepto',
    category: 'Fruits',
  }),
  product({
    id: 'tomato-hybrid',
    brand: 'FARM',
    name: 'Hybrid Tomato',
    details: '1 kg • Fresh',
    description: 'Firm hybrid tomatoes for daily cooking.',
    image: require('../assets/grocery/paneer.jpg'),
    prices: { blinkit: 36, zepto: 34, instamart: 38 },
    bestId: 'zepto',
    category: 'Vegetables',
  }),
  product({
    id: 'onion-nashik',
    brand: 'FARM',
    name: 'Nashik Onion',
    details: '1 kg • Fresh',
    description: 'Pungent Nashik onions, kitchen staple.',
    image: require('../assets/grocery/curd.jpg'),
    prices: { blinkit: 32, zepto: 30, instamart: 33 },
    bestId: 'zepto',
    category: 'Vegetables',
  }),
  product({
    id: 'potato-table',
    brand: 'FARM',
    name: 'Table Potato',
    details: '1 kg • Fresh',
    description: 'Clean table potatoes for fries & curries.',
    image: require('../assets/grocery/butter.jpg'),
    prices: { blinkit: 28, zepto: 29, instamart: 26 },
    bestId: 'instamart',
    category: 'Vegetables',
  }),
  product({
    id: 'lays-classic',
    brand: 'LAYS',
    name: 'Lays Classic Salted',
    details: '52 g • Chips',
    description: 'Classic salted potato chips.',
    image: require('../assets/grocery/amul-milk.jpg'),
    prices: { blinkit: 20, zepto: 22, instamart: 19 },
    bestId: 'instamart',
    category: 'Snacks',
  }),
  product({
    id: 'kurkure-masala',
    brand: 'KURKURE',
    name: 'Kurkure Masala Munch',
    details: '75 g • Crunchy',
    description: 'Spicy masala crunch snack.',
    image: require('../assets/grocery/paneer.jpg'),
    prices: { blinkit: 20, zepto: 18, instamart: 21 },
    bestId: 'zepto',
    category: 'Snacks',
  }),
  product({
    id: 'bingo-mad-angles',
    brand: 'BINGO',
    name: 'Bingo Mad Angles',
    details: '66 g • Tangy',
    description: 'Tangy mad angles for movie night.',
    image: require('../assets/grocery/curd.jpg'),
    prices: { blinkit: 20, zepto: 20, instamart: 18 },
    bestId: 'instamart',
    category: 'Snacks',
  }),
  product({
    id: 'coca-cola-750',
    brand: 'COCA-COLA',
    name: 'Coca-Cola',
    details: '750 ml • Soft Drink',
    description: 'Chilled cola classic.',
    image: require('../assets/grocery/amul-milk.jpg'),
    prices: { blinkit: 40, zepto: 38, instamart: 42 },
    bestId: 'zepto',
    category: 'Beverages',
  }),
  product({
    id: 'real-juice-1l',
    brand: 'REAL',
    name: 'Real Mixed Fruit Juice',
    details: '1 L • Juice',
    description: 'Mixed fruit juice, no concentrate fuss.',
    image: require('../assets/grocery/amul-gold-1l.jpg'),
    prices: { blinkit: 110, zepto: 115, instamart: 105 },
    bestId: 'instamart',
    category: 'Beverages',
  }),
];

export function getCatalogByCategory(category) {
  return GROCERY_CATALOG.filter((p) => p.category === category);
}

export function getCatalogProduct(id) {
  return GROCERY_CATALOG.find((p) => p.id === id) || GROCERY_CATALOG[0];
}

export function searchGroceryCatalog(query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return GROCERY_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.details.toLowerCase().includes(q)
  );
}
