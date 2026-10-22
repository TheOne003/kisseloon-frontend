export const DEMO_CART_ITEMS = [
  {
    id: 'food-chicken-dum-biryani',
    category: 'food',
    name: 'Chicken Dum Biryani',
    subtitle: 'Behrouz • Authentic Hyderabadi',
    price: 190,
    mrp: 240,
    bestOn: 'Best on Zomato',
    bestPlatformId: 'zomato',
    qty: 1,
    tag: 'non-veg',
    tagLabel: 'Non-Veg',
    image: require('../assets/food/biryani.jpg'),
  },
  {
    id: 'food-paneer-tikka',
    category: 'food',
    name: 'Paneer Tikka Skewers',
    subtitle: 'Punjab Grill • Mint Chutney (6 pcs)',
    price: 165,
    mrp: 199,
    bestOn: 'Best on Swiggy',
    bestPlatformId: 'swiggy',
    qty: 1,
    tag: 'veg',
    tagLabel: 'Pure Veg',
    image: require('../assets/food/paneer-tikka.jpg'),
  },
  {
    id: 'grocery-coca-cola',
    category: 'grocery',
    name: 'Coca-Cola Original',
    subtitle: '750 ml Bottle • Chilled Instant Delivery',
    price: 45,
    mrp: 50,
    bestOn: 'Best on Blinkit / Zepto',
    bestPlatformId: 'blinkit',
    qty: 1,
    tag: 'in-stock',
    tagLabel: 'In Stock',
    image: require('../assets/cart/coca-cola.jpg'),
  },
];

export function getCartSummary(items = []) {
  const foodItems = items.filter((item) => item.category === 'food');
  const groceryItems = items.filter((item) => item.category === 'grocery');

  const foodSubtotal = foodItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const grocerySubtotal = groceryItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const listSavings = items.reduce(
    (sum, item) => sum + Math.max(0, item.mrp - item.price) * item.qty,
    0
  );
  // Aligns with Figma cart estimate (~₹58 on the demo dual-basket)
  const saveAmount = Math.round(listSavings * 0.65);
  const itemsTotal = foodSubtotal + grocerySubtotal;
  const deliveryFee = items.length ? 49 : 0;
  const total = Math.max(itemsTotal + deliveryFee - saveAmount, 0);

  return {
    foodItems,
    groceryItems,
    foodCount: foodItems.reduce((sum, item) => sum + item.qty, 0),
    groceryCount: groceryItems.reduce((sum, item) => sum + item.qty, 0),
    totalCount: items.reduce((sum, item) => sum + item.qty, 0),
    foodSubtotal,
    grocerySubtotal,
    deliveryFee,
    saveAmount,
    total,
    optimizedLine: 'Blinkit + Zomato optimized',
  };
}

export function upsertCartItem(items, nextItem, { replaceQty = false } = {}) {
  const qtyToAdd = nextItem.qty || 1;
  const existing = items.find((item) => item.id === nextItem.id);
  if (existing) {
    return items.map((item) =>
      item.id === nextItem.id
        ? {
            ...item,
            ...nextItem,
            qty: replaceQty ? qtyToAdd : item.qty + qtyToAdd,
          }
        : item
    );
  }
  return [...items, { ...nextItem, qty: qtyToAdd }];
}

/** Fingerprint used to detect stale cart comparisons after qty/variant changes. */
export function getCartFingerprint(items = []) {
  return items
    .map((item) => `${item.id}:${item.variantId || ''}:${item.qty}:${item.price}`)
    .sort()
    .join('|');
}

export function cartItemFromGroceryProduct(product, platform) {
  const best =
    platform ||
    product?.platforms?.find((p) => p.best) ||
    product?.platforms?.[0];
  const price = best?.price || product?.bestPrice || 72;
  const mrp = Math.max(price + 8, Math.round(price * 1.1));
  const pack =
    product?.packSize ||
    product?.details?.split('•')?.[0]?.trim() ||
    '1 L';
  const attribute =
    product?.attribute ||
    product?.details?.split('•')?.[1]?.trim() ||
    product?.bestPlatform ||
    'Grocery item';
  const variantId = `${product.id}:${pack}`;
  const platformPrices = Object.fromEntries(
    (product?.platforms || [])
      .filter((p) => !p.unavailable && typeof p.price === 'number')
      .map((p) => [p.id, p.price])
  );

  return {
    id: `grocery-${variantId}`,
    productId: product.id,
    variantId,
    category: 'grocery',
    name: product.name,
    subtitle: `${pack} • ${attribute}`,
    price,
    mrp,
    bestOn: `Best on ${best?.name || product?.bestPlatform || 'Instamart'}`,
    bestPlatformId: best?.id || 'instamart',
    platformPrices,
    qty: 1,
    tag: 'in-stock',
    tagLabel: product?.stockLabel || 'In Stock',
    image: product.image,
  };
}

export function cartItemFromFoodSelection({ item, restaurant, platform, quantity = 1 }) {
  const price = platform?.price || item?.platforms?.find((p) => p.best)?.price || 190;
  const mrp = Math.max(price + 30, Math.round(price * 1.2));
  const isVeg = String(item?.dietary || '').toUpperCase() === 'VEG';
  const platformPrices = Object.fromEntries(
    (item?.platforms || [])
      .filter((p) => typeof p.price === 'number')
      .map((p) => [p.id, p.price])
  );

  return {
    id: `food-${item?.id || item?.name || 'item'}`,
    productId: item?.id,
    variantId: item?.id,
    restaurantId: restaurant?.id,
    category: 'food',
    name: item?.name || 'Food item',
    subtitle: restaurant
      ? `${restaurant.name} • ${restaurant.cuisine || 'Restaurant'}`
      : item?.description || 'Food item',
    price,
    mrp,
    bestOn: `Best on ${platform?.name || platform?.label || 'Toing'}`,
    bestPlatformId: platform?.id || 'toing',
    platformPrices,
    qty: quantity,
    tag: isVeg ? 'veg' : 'non-veg',
    tagLabel: isVeg ? 'Pure Veg' : 'Non-Veg',
    image: item?.detailImage || item?.image,
  };
}
