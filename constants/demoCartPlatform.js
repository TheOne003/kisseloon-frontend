import { getCartSummary } from './demoCart';
import { getCartChipLabel } from './demoCartCompare';

const FOOD_PLATFORMS = [
  { id: 'swiggy', name: 'Swiggy', eta: '~28 mins delivery' },
  { id: 'zomato', name: 'Zomato', eta: '~30 mins delivery' },
  { id: 'toing', name: 'Toing', eta: 'Fastest • ~22 mins delivery' },
];

const GROCERY_PLATFORMS = [
  { id: 'blinkit', name: 'Blinkit', eta: 'Fastest • ~10 mins delivery' },
  { id: 'zepto', name: 'Zepto', eta: '~12 mins delivery' },
  { id: 'instamart', name: 'Instamart', eta: '~15 mins delivery' },
];

function platformIdsForItem(item) {
  if (item.category === 'grocery') {
    return item.bestPlatformId
      ? ['blinkit', 'zepto', 'instamart']
      : ['blinkit', 'zepto', 'instamart'];
  }
  return ['swiggy', 'zomato', 'toing'];
}

/** Estimate line price on a platform; mark unavailable when category mismatches. */
function lineForPlatform(item, platformId) {
  const supported = platformIdsForItem(item);
  if (!supported.includes(platformId)) {
    return { available: false, price: 0 };
  }
  // Prefer exact platform price when stored; else use cart line price only for best platform
  if (item.platformPrices && typeof item.platformPrices[platformId] === 'number') {
    return {
      available: true,
      price: item.platformPrices[platformId] * item.qty,
    };
  }
  if (item.bestPlatformId === platformId) {
    return { available: true, price: item.price * item.qty };
  }
  // Nearby estimate from list price without inventing a "winner" cheaper than best
  const bump =
    platformId === 'zomato' || platformId === 'zepto'
      ? 8
      : platformId === 'swiggy' || platformId === 'blinkit'
        ? 12
        : 0;
  return {
    available: true,
    price: (item.price + bump) * item.qty,
  };
}

function evaluatePlatform(platform, items) {
  let total = 0;
  let availableCount = 0;
  items.forEach((item) => {
    const line = lineForPlatform(item, platform.id);
    if (line.available) {
      availableCount += 1;
      total += line.price;
    }
  });

  const complete = availableCount === items.length && items.length > 0;
  const deliveryFee = complete ? (platform.id === 'toing' || platform.id === 'blinkit' ? 29 : 39) : 0;
  const packingFee = complete ? 10 : 0;
  const estimatedTotal = complete ? Math.round(total + deliveryFee + packingFee) : null;

  return {
    id: platform.id,
    name: platform.name,
    readyLabel: complete
      ? `${availableCount}/${items.length} ready`
      : 'Incomplete',
    subtitle: complete
      ? undefined
      : `${availableCount} of ${items.length} items available`,
    eta: complete ? platform.eta : undefined,
    etaTone: 'default',
    total: estimatedTotal,
    estimateLabel: complete ? 'Est. total' : undefined,
    incomplete: !complete,
    selectable: complete,
    best: false,
  };
}

export function getCartPlatformSelectionDemo(items = []) {
  const summary = getCartSummary(items);
  const itemLine =
    items.length > 0
      ? items.map(getCartChipLabel).join(' • ')
      : 'No items';

  const hasFood = items.some((i) => i.category === 'food');
  const hasGrocery = items.some((i) => i.category === 'grocery');

  let catalog = [];
  if (hasFood && hasGrocery) {
    // Mixed basket: only platforms that can partially cover — mark incomplete honestly
    catalog = [
      ...FOOD_PLATFORMS.map((p) => ({ ...p, eta: p.eta })),
      ...GROCERY_PLATFORMS,
    ];
  } else if (hasGrocery) {
    catalog = GROCERY_PLATFORMS;
  } else {
    catalog = FOOD_PLATFORMS;
  }

  const platforms = catalog.map((p) => evaluatePlatform(p, items));
  const completePlatforms = platforms.filter((p) => p.selectable && p.total != null);

  if (completePlatforms.length) {
    const bestTotal = Math.min(...completePlatforms.map((p) => p.total));
    platforms.forEach((p) => {
      if (!p.selectable || p.total == null) return;
      if (p.total === bestTotal) {
        p.best = true;
        p.etaTone = 'best';
        p.saveLabel = 'Lowest estimate';
      } else {
        p.moreLabel = `+₹${p.total - bestTotal} higher`;
      }
    });
  }

  const best =
    platforms.find((p) => p.best) ||
    [...completePlatforms].sort((a, b) => a.total - b.total)[0];

  return {
    itemCount: summary.totalCount || items.length,
    itemLine,
    // Never present a cart subtotal as a winning complete-basket total.
    bestCombinedRate: best?.total ?? null,
    defaultPlatformId: best?.id || completePlatforms[0]?.id || null,
    platforms,
    isEstimate: true,
    hasCompleteBasket: completePlatforms.length > 0,
  };
}
