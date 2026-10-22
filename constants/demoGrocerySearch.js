import { searchGroceryCatalog } from './demoGroceryCatalog';

export function normalizeGroceryQuery(value = '') {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getDemoGrocerySearch(query) {
  const normalized = normalizeGroceryQuery(query);
  if (!normalized) {
    return { query: '', products: [], related: [] };
  }

  const matched = searchGroceryCatalog(normalized);
  const products = matched.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.details,
    icon: 'drop',
    catalogId: p.id,
  }));

  const related = matched.slice(0, 4).map((p) => ({
    id: `rel-${p.id}`,
    brand: p.brand,
    rest: ` ${p.name}`,
    catalogId: p.id,
  }));

  // Extra related brand suggestions when typing a known brand/category
  if (!related.length && normalized.length >= 2) {
    const loose = searchGroceryCatalog(normalized.slice(0, 3));
    loose.slice(0, 4).forEach((p) => {
      related.push({
        id: `rel-${p.id}`,
        brand: p.brand,
        rest: ` ${p.name}`,
        catalogId: p.id,
      });
    });
  }

  return {
    query: query.trim(),
    products,
    related,
  };
}
