/**
 * Comparison operations — UI animations must not invent prices.
 * Uses the app's existing demo/data helpers as the current data layer.
 */
import { getGroceryRaceDemo } from '../constants/demoGroceryRace';
import { getGroceryPlatformSelectionDemo } from '../constants/demoGroceryPlatform';
import { getPlatformSelectionDemo } from '../constants/demoPlatform';
import { getCartPlatformSelectionDemo } from '../constants/demoCartPlatform';
import { getPlatformIcon } from '../constants/platformIcons';

const FOOD_LANE = {
  swiggy: {
    priceColor: '#fc8019',
    laneBg: '#fff5eb',
    trailColor: 'rgba(252,128,25,0.33)',
  },
  zomato: {
    priceColor: '#cb202d',
    laneBg: '#fff0f2',
    trailColor: 'rgba(203,32,45,0.33)',
  },
  toing: {
    priceColor: '#059669',
    laneBg: '#eefbf5',
    trailColor: 'rgba(0,181,98,0.33)',
  },
};

function buildRaceFromPlatforms(platforms = []) {
  const available = platforms.filter((p) => p && !p.unavailable && typeof p.price === 'number');
  if (available.length < 2) {
    return null;
  }

  const prices = available.map((p) => p.price);
  const bestPrice = Math.min(...prices);
  const highest = Math.max(...prices);
  const saveAmount = highest - bestPrice;
  const winner = available.find((p) => p.price === bestPrice);
  const sorted = [...available].sort((a, b) => a.price - b.price);
  const progressByRank = [0.38, 0.55, 0.82, 0.7];
  const progressMap = Object.fromEntries(
    sorted.map((p, index) => [
      p.id,
      progressByRank[Math.min(index, progressByRank.length - 1)],
    ])
  );

  const racers = available.map((platform, index) => {
    const lane = FOOD_LANE[platform.id] || {
      priceColor: platform.color || '#0b1c30',
      laneBg: '#f5f7ff',
      trailColor: 'rgba(11,28,48,0.2)',
    };
    const isWinner = platform.id === winner?.id;
    return {
      id: platform.id,
      name: platform.name || platform.label || platform.id,
      price: platform.price,
      priceColor: isWinner ? '#059669' : lane.priceColor,
      laneBg: isWinner ? '#eefbf5' : lane.laneBg,
      trailColor: isWinner ? 'rgba(0,181,98,0.33)' : lane.trailColor,
      logo: getPlatformIcon(platform),
      progress: progressMap[platform.id] ?? 0.4 + index * 0.15,
      duration: isWinner ? 1700 : 2000 + index * 150,
      winner: isWinner,
    };
  });

  return {
    racers,
    savingsTitle: `Save ₹${saveAmount} on your order!`,
    savingsSubtitle: `${winner?.name || winner?.label || 'Best platform'} has the lowest price today. Compare, order and save instantly.`,
    proceedLabel: `Proceed with ${winner?.name || winner?.label || 'best price'}`,
    winnerId: winner?.id,
    bestPrice,
    highestPrice: highest,
    saveAmount,
  };
}

/** Aggregate restaurant menu prices per platform for menu-level race. */
export function compareRestaurantMenu(restaurant) {
  if (!restaurant?.menu?.length) {
    return {
      ok: false,
      error: 'Restaurant menu unavailable',
      restaurantId: restaurant?.id,
    };
  }

  const totals = {};
  restaurant.menu.forEach((item) => {
    const platforms = item.platforms || item.prices || [];
    platforms.forEach((p) => {
      if (p == null || typeof p.price !== 'number') return;
      const id = p.id;
      if (!totals[id]) {
        totals[id] = {
          id,
          name: p.name || p.label || id,
          label: p.label || p.name || id,
          color: p.color,
          price: 0,
          count: 0,
        };
      }
      totals[id].price += p.price;
      totals[id].count += 1;
    });
  });

  const platforms = Object.values(totals).map((p) => ({
    ...p,
    // Average menu item price for race display (like-for-like across platforms)
    price: Math.round(p.price / Math.max(p.count, 1)),
  }));

  const race = buildRaceFromPlatforms(platforms);
  if (!race) {
    return {
      ok: false,
      error: 'Not enough platform prices for menu comparison',
      restaurantId: restaurant.id,
    };
  }

  return {
    ok: true,
    restaurantId: restaurant.id,
    race,
    menu: restaurant.menu,
    comparedAt: Date.now(),
  };
}

/** Single food or grocery item / variant comparison. */
export function compareSingleItem({ item, product, restaurant, quantity = 1 } = {}) {
  if (product) {
    const race = getGroceryRaceDemo(product);
    const selection = getGroceryPlatformSelectionDemo(product);
    return {
      ok: true,
      kind: 'grocery',
      itemId: product.id,
      variantId: product.packSize || product.id,
      race,
      selection,
      comparedAt: Date.now(),
    };
  }

  if (item) {
    const platforms = (item.platforms || []).map((p) => ({
      ...p,
      name: p.name || p.label,
      price: typeof p.price === 'number' ? p.price * quantity : p.price,
    }));
    const race = buildRaceFromPlatforms(platforms);
    const selection = getPlatformSelectionDemo({ item, restaurant, quantity });
    if (race && item.platforms?.length) {
      // Prefer live item platforms over static demo defaults in selection
      const prices = item.platforms.map((p) => p.price);
      const bestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);
      selection.platforms = item.platforms.map((p) => ({
        id: p.id,
        name: p.name || p.label,
        letter: p.letter,
        letterColor: p.color,
        badgeBg: p.bg || '#fff1ee',
        time: p.note?.includes('min') ? p.note : restaurant?.time,
        price: p.price * quantity,
        best: !!p.best || p.price === bestPrice,
        saveLabel:
          p.price === bestPrice
            ? `Save ₹${(highestPrice - bestPrice) * quantity} vs highest`
            : undefined,
      }));
      selection.bestPrice = bestPrice * quantity;
      selection.highestPrice = highestPrice * quantity;
      selection.saveAmount = (highestPrice - bestPrice) * quantity;
      selection.defaultPlatformId =
        selection.platforms.find((p) => p.best)?.id || selection.platforms[0]?.id;
    }

    return {
      ok: true,
      kind: 'food',
      itemId: item.id,
      variantId: item.id,
      race: race || {
        racers: undefined,
        savingsTitle: selection.saveAmount
          ? `Save ₹${selection.saveAmount} on your order!`
          : 'Save on your order!',
        savingsSubtitle: 'Compare, order and save instantly.',
        proceedLabel: 'Proceed',
      },
      selection,
      comparedAt: Date.now(),
    };
  }

  return { ok: false, error: 'No item or product to compare' };
}

/** Full-basket comparison from a cart snapshot. */
export function compareCart(cartSnapshot = []) {
  const items = Array.isArray(cartSnapshot) ? cartSnapshot : [];
  if (!items.length) {
    return { ok: false, error: 'Cart snapshot is empty', items: [] };
  }

  const selection = getCartPlatformSelectionDemo(items);
  return {
    ok: true,
    items: items.map((item) => ({ ...item })),
    selection,
    itemIds: items.map((item) => item.id),
    comparedAt: Date.now(),
  };
}

/** Race payload from cart platform totals (used when cart compare plays race). */
export function buildRaceFromCartSelection(selection) {
  const platforms = (selection?.platforms || [])
    .filter((p) => p && p.selectable !== false && typeof p.total === 'number')
    .map((p) => ({
      id: p.id,
      name: p.name,
      label: p.name,
      price: p.total,
    }));
  return buildRaceFromPlatforms(platforms);
}
