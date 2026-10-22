/** Explicit comparison operation context — do not infer mode from cart length alone. */

export const ComparisonMode = {
  ITEM: 'item',
  CART: 'cart',
};

export const ComparisonSource = {
  FOOD_MENU: 'food-menu',
  FOOD_ITEM: 'food-item',
  GROCERY_PRODUCT: 'grocery-product',
  GROCERY_CART: 'grocery-cart',
  FOOD_CART: 'food-cart',
};

let snapshotSeq = 0;

export function createCartSnapshotId() {
  snapshotSeq += 1;
  return `cart-snap-${Date.now()}-${snapshotSeq}`;
}

/**
 * @param {{
 *   mode: 'item' | 'cart',
 *   source: 'food-menu' | 'food-item' | 'grocery-product' | 'grocery-cart' | 'food-cart',
 *   itemIds?: string[],
 *   cartSnapshotId?: string,
 *   restaurantId?: string,
 *   variantId?: string,
 * }} partial
 */
export function createComparisonContext(partial) {
  const mode = partial.mode === ComparisonMode.CART ? ComparisonMode.CART : ComparisonMode.ITEM;
  return {
    mode,
    source: partial.source,
    itemIds: Array.isArray(partial.itemIds) ? [...partial.itemIds] : [],
    cartSnapshotId: partial.cartSnapshotId,
    restaurantId: partial.restaurantId,
    variantId: partial.variantId,
    createdAt: Date.now(),
  };
}

export function isCartComparison(context) {
  return context?.mode === ComparisonMode.CART;
}

export function isItemComparison(context) {
  return context?.mode === ComparisonMode.ITEM;
}

/** Animation type required by an explicit comparison context (swapped visually). */
export function animationForContext(context) {
  return isCartComparison(context) ? 'race' : 'orbit';
}

export function cartSourceFromItems(items = []) {
  const hasFood = items.some((item) => item.category === 'food');
  const hasGrocery = items.some((item) => item.category === 'grocery');
  if (hasFood && !hasGrocery) return ComparisonSource.FOOD_CART;
  if (hasGrocery && !hasFood) return ComparisonSource.GROCERY_CART;
  if (hasFood) return ComparisonSource.FOOD_CART;
  return ComparisonSource.GROCERY_CART;
}
