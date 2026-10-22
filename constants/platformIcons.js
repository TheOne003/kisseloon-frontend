export const PLATFORM_ICONS = {
  'amazon-fresh': require('../assets/platform/amazon-fresh.jpg'),
  amazonfresh: require('../assets/platform/amazon-fresh.jpg'),
  'flipkart-minutes': require('../assets/platform/flipkart-minutes.jpg'),
  flipkartminutes: require('../assets/platform/flipkart-minutes.jpg'),
  flipkart: require('../assets/platform/flipkart-minutes.jpg'),
  swiggy: require('../assets/platform/swiggy.jpg'),
  'bistro-blinkit': require('../assets/platform/bistro-blinkit.jpg'),
  bistro: require('../assets/platform/bistro-blinkit.jpg'),
  blinkit: require('../assets/platform/blinkit.jpg'),
  toing: require('../assets/platform/toing.jpg'),
  instamart: require('../assets/platform/instamart.jpg'),
  'swiggy-instamart': require('../assets/platform/instamart.jpg'),
  zomato: require('../assets/platform/zomato.jpg'),
  jiomart: require('../assets/platform/jiomart.jpg'),
  'jio-mart': require('../assets/platform/jiomart.jpg'),
  jio: require('../assets/platform/jiomart.jpg'),
  bigbasket: require('../assets/platform/bigbasket.jpg'),
  zepto: require('../assets/platform/zepto.jpg'),
  swish: require('../assets/platform/swish.jpg'),
  'zepto-cafe': require('../assets/platform/zepto-cafe.jpg'),
  zeptocafe: require('../assets/platform/zepto-cafe.jpg'),
  'ownly-rapido': require('../assets/platform/ownly-rapido.jpg'),
  ownly: require('../assets/platform/ownly-rapido.jpg'),
  rapido: require('../assets/platform/ownly-rapido.jpg'),
};

const NAME_ALIASES = {
  'amazon fresh': 'amazon-fresh',
  'flipkart minutes': 'flipkart-minutes',
  'bistro by blinkit': 'bistro-blinkit',
  'swiggy instamart': 'instamart',
  'jio mart': 'jiomart',
  'big basket': 'bigbasket',
  'zepto cafe': 'zepto-cafe',
  'zepto café': 'zepto-cafe',
  'ownly by rapido': 'ownly-rapido',
};

/** Legacy food-result letter codes → platform id */
const LETTER_ALIASES = {
  s: 'swiggy',
  z: 'zomato',
  t: 'toing',
};

export function normalizePlatformKey(value = '') {
  const raw = String(value).trim().toLowerCase();
  if (!raw) return '';
  if (NAME_ALIASES[raw]) return NAME_ALIASES[raw];
  if (LETTER_ALIASES[raw]) return LETTER_ALIASES[raw];
  return raw.replace(/\s+/g, '-');
}

export function getPlatformIcon(platform) {
  if (!platform) return null;

  if (typeof platform === 'string') {
    const key = normalizePlatformKey(platform);
    return PLATFORM_ICONS[key] || null;
  }

  const candidates = [platform.id, platform.name, platform.label].filter(Boolean);

  for (const candidate of candidates) {
    const icon = getPlatformIcon(candidate);
    if (icon) return icon;
  }

  // Letter only as last resort (food S/Z/T badges)
  if (platform.letter) {
    return getPlatformIcon(platform.letter);
  }

  return null;
}
