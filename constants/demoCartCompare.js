export const CART_ORBIT_CANVAS = { width: 358, height: 220 };
export const CART_ORBIT_HUB = { x: 179, y: 110 };

// Exact Figma cart-orbit: letter badges, shared ring, 120° spacing
export const CART_ORBIT_PLATFORMS = [
  {
    id: 'blinkit',
    name: 'Blinkit',
    letter: 'B',
    color: '#f8cc26',
    textColor: '#1a1a1a',
    radius: 86,
    startDeg: -90,
    settleDeg: -90,
    clockwise: true,
    periodMs: 1800,
  },
  {
    id: 'zepto',
    name: 'Zepto',
    letter: 'Z',
    color: '#8b2fc9',
    textColor: '#ffffff',
    radius: 86,
    startDeg: 30,
    settleDeg: 150,
    clockwise: true,
    periodMs: 1800,
  },
  {
    id: 'instamart',
    name: 'Instamart',
    letter: 'I',
    color: '#f2702e',
    textColor: '#ffffff',
    radius: 86,
    startDeg: 150,
    settleDeg: 30,
    clockwise: true,
    periodMs: 1800,
  },
];

// Light dashed guides only (no colored blobs)
export const CART_ORBIT_RINGS = [172, 128];

export const CART_ORBIT_PHASES = [
  {
    key: 'connecting',
    progress: 0.15,
    title: 'Optimizing your cart',
    subtitle: 'Comparing item prices, delivery, and discounts…',
    statusTitle: 'Checking available platforms',
    statusSubtitle: 'Food + Grocery multi-cart engine',
    speed: 1,
    complete: false,
  },
  {
    key: 'early',
    progress: 0.4,
    title: 'Fetching real-time rates',
    subtitle: 'Connecting to Blinkit, Zepto, and Instamart…',
    statusTitle: 'Fetching prices from platforms...',
    statusSubtitle: 'Syncing current cart values',
    speed: 1,
    complete: false,
  },
  {
    key: 'mid',
    progress: 0.75,
    title: 'Calculating fees',
    subtitle: 'Assembling custom combined options…',
    statusTitle: 'Comparing delivery & packing...',
    statusSubtitle: 'Applying live coupon discounts',
    speed: 1.1,
    complete: false,
  },
  {
    key: 'complete',
    progress: 1,
    title: null,
    subtitle: null,
    statusTitle: null,
    statusSubtitle: null,
    bannerTitle: 'Best combined rate found!',
    bannerSubtitle: 'Save up to ₹140 with smart multi-split delivery',
    ctaLabel: 'View Best Deal →',
    speed: 0,
    complete: true,
  },
];

/** Copy used when orbit runs for restaurant menu comparison (not a cart). */
export const MENU_ORBIT_COPY = {
  headerTitle: 'Menu Comparison',
  headerSubtitle: 'Restaurant prices across platforms',
  listTitle: 'Restaurant menu',
  noteText: 'Comparing this restaurant’s menu across available platforms',
  phases: [
    {
      ...CART_ORBIT_PHASES[0],
      title: 'Comparing menu prices',
      subtitle: 'Checking dish prices across delivery platforms…',
      statusTitle: 'Checking available platforms',
      statusSubtitle: 'Restaurant menu price engine',
    },
    {
      ...CART_ORBIT_PHASES[1],
      title: 'Fetching platform rates',
      subtitle: 'Connecting to Swiggy, Zomato, and Toing…',
      statusTitle: 'Fetching menu prices...',
      statusSubtitle: 'Syncing live restaurant listings',
    },
    {
      ...CART_ORBIT_PHASES[2],
      title: 'Matching dish availability',
      subtitle: 'Aligning the same menu items on each platform…',
      statusTitle: 'Comparing delivery & fees...',
      statusSubtitle: 'Finding the best platform for this menu',
    },
    {
      ...CART_ORBIT_PHASES[3],
      bannerTitle: 'Best menu rates found!',
      bannerSubtitle: 'Open the menu to pick dishes at the lowest platform prices',
      ctaLabel: 'View Menu →',
    },
  ],
};

/** Copy used when orbit runs for a single grocery product comparison. */
export const PRODUCT_ORBIT_COPY = {
  headerTitle: 'Product Comparison',
  headerSubtitle: 'Grocery prices across platforms',
  listTitle: 'Selected product',
  noteText: 'Comparing this product across available grocery platforms',
  phases: [
    {
      ...CART_ORBIT_PHASES[0],
      title: 'Comparing product prices',
      subtitle: 'Checking pack price across quick-commerce apps…',
      statusTitle: 'Checking available platforms',
      statusSubtitle: 'Grocery product price engine',
    },
    {
      ...CART_ORBIT_PHASES[1],
      title: 'Fetching platform rates',
      subtitle: 'Connecting to Blinkit, Zepto, and Instamart…',
      statusTitle: 'Fetching product prices...',
      statusSubtitle: 'Syncing the same pack size',
    },
    {
      ...CART_ORBIT_PHASES[2],
      title: 'Checking stock & fees',
      subtitle: 'Comparing delivery and availability…',
      statusTitle: 'Comparing delivery & packing...',
      statusSubtitle: 'Finding the best platform for this product',
    },
    {
      ...CART_ORBIT_PHASES[3],
      bannerTitle: 'Best product price found!',
      bannerSubtitle: 'Open details to slide-order or add to cart',
      ctaLabel: 'View Product →',
    },
  ],
};

export const CART_ORBIT_PHASE_MS = 2200;
// Finale: collapse to center → expand out → ticks
export const CART_ORBIT_COLLAPSE_MS = 380;
export const CART_ORBIT_EXPAND_MS = 420;

export function getCartChipLabel(item) {
  if (!item?.name) return 'Item';
  if (item.category === 'grocery' && /coca|coke/i.test(item.name)) {
    return 'Coca-Cola (750ml)';
  }
  if (/chicken.*biryani|biryani/i.test(item.name)) return 'Chicken Biryani';
  if (/paneer/i.test(item.name)) return 'Paneer Tikka';
  return item.name.length > 18 ? `${item.name.slice(0, 16)}…` : item.name;
}

export const CART_COMPARE_PLATFORMS = CART_ORBIT_PLATFORMS;
export const CART_COMPARE_STEPS = CART_ORBIT_PHASES;
export const CART_COMPARE_STEP_MS = CART_ORBIT_PHASE_MS;
export const CART_COMPARE_HUB = CART_ORBIT_HUB;
