import {
  GROCERY_CATALOG,
  searchGroceryCatalog,
} from './demoGroceryCatalog';

function resultsPayload(title, products) {
  return {
    title,
    foundCount: products.length,
    subtitle: 'Live prices across quick-commerce stores',
    products,
  };
}

export function normalizeGroceryResultsQuery(value = '') {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getDemoGroceryResults(query = 'Amul Gold Milk') {
  const normalized = normalizeGroceryResultsQuery(query);
  const matched = searchGroceryCatalog(normalized);

  if (matched.length) {
    return resultsPayload(query.trim() || matched[0].name, matched);
  }

  // Category-style queries
  if (normalized.includes('fruit')) {
    const products = GROCERY_CATALOG.filter((p) => p.category === 'Fruits');
    return resultsPayload(query.trim() || 'Fruits', products);
  }
  if (normalized.includes('veg')) {
    const products = GROCERY_CATALOG.filter((p) => p.category === 'Vegetables');
    return resultsPayload(query.trim() || 'Vegetables', products);
  }
  if (normalized.includes('snack')) {
    const products = GROCERY_CATALOG.filter((p) => p.category === 'Snacks');
    return resultsPayload(query.trim() || 'Snacks', products);
  }
  if (normalized.includes('milk') || normalized.includes('dairy')) {
    const products = GROCERY_CATALOG.filter((p) => p.category === 'Milk & Dairy');
    return resultsPayload(query.trim() || 'Milk & Dairy', products);
  }

  // Fallback demo list
  return resultsPayload(
    query.trim() || 'Amul Gold Milk',
    GROCERY_CATALOG.filter((p) => p.category === 'Milk & Dairy')
  );
}
