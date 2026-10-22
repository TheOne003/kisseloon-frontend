import { getCatalogProduct } from './demoGroceryCatalog';

/** Full product detail for grocery item screen (food-item shaped). */
export function getDemoGroceryProduct(product = {}) {
  const base = getCatalogProduct(product.id || 'amul-gold-1l');
  const merged = {
    ...base,
    ...product,
    platforms: product.platforms?.length ? product.platforms : base.platforms,
    image: product.detailImage || product.image || base.image,
    name: product.name || base.name,
  };

  return {
    ...merged,
    brandLine: `${merged.brand} • ${merged.category || 'GROCERY'}`,
    packSize: merged.packSize || merged.details?.split('•')?.[0]?.trim() || '1 unit',
    attribute:
      merged.attribute ||
      merged.details?.split('•')?.[1]?.trim() ||
      'Grocery item',
    description:
      merged.description ||
      `${merged.name} — compare live prices and slide to order on the best platform.`,
    inStock: merged.stock !== 'oos',
    platformsVerified: (merged.platforms || []).filter((p) => !p.unavailable)
      .length,
    selectedPlatformId:
      merged.platforms?.find((p) => p.best)?.id || merged.platforms?.[0]?.id,
    selectedNote: 'Best live price',
  };
}

/** Shape grocery product for ItemDetailScreen (same UI as food). */
export function groceryProductToItemDetail(product) {
  const detail = getDemoGroceryProduct(product);
  const platforms = (detail.platforms || [])
    .filter((p) => !p.unavailable)
    .map((p) => ({
      id: p.id,
      label: p.name || p.label,
      name: p.name || p.label,
      price: p.price,
      color: p.color,
      letter: p.letter,
      best: !!p.best,
      note:
        p.note ||
        (p.best ? 'FREE delivery' : `${p.time || ''}`.replace(/delivery/i, '').trim() || 'Standard delivery'),
    }));

  const best = platforms.find((p) => p.best) || platforms[0];
  const next =
    platforms.find((p) => p.id !== best?.id && typeof p.price === 'number') ||
    best;
  const save = Math.max(0, (next?.price || 0) - (best?.price || 0));

  return {
    id: detail.id,
    name: detail.name,
    dietary: 'GROCERY',
    description: detail.description,
    image: detail.image,
    detailImage: detail.image,
    platforms,
    bestPriceText:
      save > 0
        ? `Save ₹${save} vs next best platform`
        : `Best price on ${best?.label || 'this platform'}`,
  };
}

export function groceryProductToRestaurantMeta(product) {
  const detail = getDemoGroceryProduct(product);
  return {
    name: detail.brandLine || detail.brand || 'Grocery',
    time: '10–20 mins',
    rating: '4.6',
    area: detail.category || 'Quick commerce',
  };
}
